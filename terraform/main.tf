module "resource_group" {
  source   = "./modules/resource-group"
  name     = "${var.project_name}-${var.environment}-rg"
  location = var.location
}

module "database" {
  source              = "./modules/database"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  server_name         = "${var.project_name}-db-${var.environment}-${random_string.db_suffix.result}"
  admin_username      = var.db_admin_username
  admin_password      = var.db_admin_password
  database_name       = var.db_name
  sku_name            = var.db_sku_name
  postgres_version    = var.db_postgres_version
  storage_mb          = var.db_storage_mb

  tags = local.common_tags
}

module "acr" {
  source              = "./modules/acr"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  registry_name       = "${replace(var.project_name, "-", "")}acr${var.environment}${random_string.acr_suffix.result}"
  sku                 = var.acr_sku
  admin_enabled       = var.acr_admin_enabled

  tags = local.common_tags
}

module "container_instance" {
  count                = var.enable_container_instance ? 1 : 0
  source               = "./modules/container-instance"
  resource_group_name  = module.resource_group.name
  location             = module.resource_group.location
  container_group_name = "${var.project_name}-${var.environment}-cg"
  container_name       = "${var.project_name}-app"
  container_image      = var.container_image
  container_port       = var.container_port
  cpu                  = var.container_cpu
  memory               = var.container_memory

  environment_variables = {
    NODE_ENV       = var.environment
    API_PORT       = tostring(var.container_port)
    AWS_REGION     = var.aws_region
    S3_BUCKET_NAME = var.s3_bucket_name
  }

  secure_environment_variables = {
    DATABASE_URL          = module.database.connection_string
    AWS_ACCESS_KEY_ID     = var.aws_access_key_id
    AWS_SECRET_ACCESS_KEY = var.aws_secret_access_key
  }

  image_registry_server   = module.acr.login_server
  image_registry_username = var.acr_admin_enabled ? module.acr.admin_username : ""
  image_registry_password = var.acr_admin_enabled ? module.acr.admin_password : ""

  dns_name_label  = var.dns_name_label
  ip_address_type = var.container_ip_address_type

  tags = local.common_tags

  depends_on = [module.acr]
}

resource "random_string" "db_suffix" {
  length  = 4
  special = false
  lower   = true
}

resource "random_string" "acr_suffix" {
  length  = 4
  special = false
  lower   = true
}

locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}
