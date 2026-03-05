data "azurerm_client_config" "current" {}

module "resource_group" {
  source      = "../../modules/resource-group"
  name_prefix = var.name_prefix
  environment = var.environment
  location    = var.location
}

module "networking" {
  source              = "../../modules/networking"
  name_prefix         = var.name_prefix
  environment         = var.environment
  location            = var.location
  resource_group_name = module.resource_group.name
}

module "key_vault" {
  source              = "../../modules/key-vault"
  name_prefix         = var.name_prefix
  environment         = var.environment
  location            = var.location
  resource_group_name = module.resource_group.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  object_id           = data.azurerm_client_config.current.object_id
  db_admin_password   = var.db_admin_password
  jwt_secret          = var.jwt_secret
}

module "storage_account" {
  source              = "../../modules/storage-account"
  name_prefix         = var.name_prefix
  environment         = var.environment
  location            = var.location
  resource_group_name = module.resource_group.name
}

module "acr" {
  source              = "../../modules/acr"
  name_prefix         = var.name_prefix
  environment         = var.environment
  location            = var.location
  resource_group_name = module.resource_group.name
}

module "database" {
  source              = "../../modules/database"
  name_prefix         = var.name_prefix
  environment         = var.environment
  location            = var.location
  resource_group_name = module.resource_group.name
  db_admin_username   = var.db_admin_username
  db_admin_password   = var.db_admin_password
  subnet_id           = module.networking.db_subnet_id
  private_dns_zone_id = module.networking.db_private_dns_zone_id
}

module "container_app" {
  source              = "../../modules/container-app"
  name_prefix         = var.name_prefix
  environment         = var.environment
  location            = var.location
  resource_group_name = module.resource_group.name
  acr_login_server    = module.acr.login_server
  acr_admin_username  = module.acr.admin_username
  acr_admin_password  = module.acr.admin_password
  database_url        = "postgresql://${var.db_admin_username}:${var.db_admin_password}@${module.database.fqdn}:5432/jobSite?sslmode=require"
  jwt_secret          = var.jwt_secret
  infrastructure_subnet_id = module.networking.container_app_subnet_id
}
