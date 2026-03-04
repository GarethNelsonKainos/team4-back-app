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

data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = "rg-academy-acr"
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

# ── ACR role assignment for managed identity ──────────────────────────────────

resource "azurerm_role_assignment" "acr_pull" {
  scope                = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = data.azurerm_user_assigned_identity.identity.principal_id

  lifecycle {
    ignore_changes = [principal_id]
  }
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
    }
  }

  tags = {
    owner       = "team4"
    project     = "backend"
    environment = var.environment
  }
}