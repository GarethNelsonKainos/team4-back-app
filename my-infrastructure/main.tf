terraform {
  backend "azurerm" {
    resource_group_name  = "Blake-team4-rg"
    storage_account_name = "blaketeam4tfstate"
    container_name       = "tfstate"
    key                  = "backend.terraform.tfstate"
  }
    
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# ── Existing resources (data sources only, not managed here) ──────────────────

data "azurerm_resource_group" "this" {
  name = "blake-team4-rg"
}

data "azurerm_container_app_environment" "env" {
  name                = "blake-team4-env-dev"
  resource_group_name = data.azurerm_resource_group.this.name
}

data "azurerm_user_assigned_identity" "identity" {
  name                = "blake-team4-identity-dev"
  resource_group_name = data.azurerm_resource_group.this.name
}

# ── Resource Group module (tags existing RG) ──────────────────────────────────

module "team4_rg" {
  source   = "./modules/resource-group"
  name     = "blake-team4-rg"
  location = "UK South"
  tags = {
    owner       = "team4"
    project     = "backend"
    environment = "dev"
  }
}


# ── PostgreSQL Flexible Server ───────────────────────────────────────────────

resource "azurerm_postgresql_flexible_server" "db" {
  name                   = "blake-team4-db-dev"
  resource_group_name    = data.azurerm_resource_group.this.name
  location               = data.azurerm_resource_group.this.location
  version                = "16"
  administrator_login    = var.db_admin_username
  administrator_password = var.db_admin_password
  storage_mb             = 32768
  sku_name               = "B_Standard_B1ms"
  zone                   = "1"

  tags = {
    owner       = "team4"
    project     = "backend"
    environment = var.environment
  }
}

resource "azurerm_postgresql_flexible_server_database" "app_db" {
  name      = "team4db"
  server_id = azurerm_postgresql_flexible_server.db.id
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure" {
  name             = "allow-azure-services"
  server_id        = azurerm_postgresql_flexible_server.db.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# ── Backend Container App ─────────────────────────────────────────────────────

resource "azurerm_container_app" "backend" {
  name                         = "blake-team4-backend-dev"
  container_app_environment_id = data.azurerm_container_app_environment.env.id
  resource_group_name          = data.azurerm_resource_group.this.name
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [data.azurerm_user_assigned_identity.identity.id]
  }

  registry {
    server   = var.acr_login_server
    identity = data.azurerm_user_assigned_identity.identity.id
  }

  ingress {
    external_enabled = false
    target_port      = 8080
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    container {
      name   = "backend"
      image  = "${var.acr_login_server}/blake-team4-backend:${var.backend_image_tag}"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "API_PORT"
        value = "8080"
      }

      env {
        name  = "DATABASE_URL"
        value = "postgresql://${var.db_admin_username}:${var.db_admin_password}@${azurerm_postgresql_flexible_server.db.fqdn}:5432/${azurerm_postgresql_flexible_server_database.app_db.name}?sslmode=require"
      }
    }
  }

  tags = {
    owner       = "team4"
    project     = "backend"
    environment = var.environment
  }
}