resource "azurerm_container_app_environment" "this" {
  name                       = "${var.name_prefix}-cae-${var.environment}"
  location                   = var.location
  resource_group_name        = var.resource_group_name
  infrastructure_subnet_id   = var.infrastructure_subnet_id

  tags = {
    environment = var.environment
    project     = var.name_prefix
    managed_by  = "terraform"
  }
}

resource "azurerm_container_app" "this" {
  name                         = "${var.name_prefix}-ca-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.this.id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"

  registry {
    server               = var.acr_login_server
    username             = var.acr_admin_username
    password_secret_name = "acr-password"
  }

  secret {
    name  = "acr-password"
    value = var.acr_admin_password
  }

  secret {
    name  = "database-url"
    value = var.database_url
  }

  secret {
    name  = "jwt-secret"
    value = var.jwt_secret
  }

  template {
    min_replicas = 1
    max_replicas = 3

    container {
      name   = "${var.name_prefix}-backend"
      image  = "${var.acr_login_server}/${var.name_prefix}-backend:latest"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name        = "DATABASE_URL"
        secret_name = "database-url"
      }

      env {
        name        = "JWT_SECRET"
        secret_name = "jwt-secret"
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "PORT"
        value = "8080"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 8080

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  tags = {
    environment = var.environment
    project     = var.name_prefix
    managed_by  = "terraform"
  }
}
