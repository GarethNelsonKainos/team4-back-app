resource "azurerm_postgresql_flexible_server" "this" {
  name                   = "${var.name_prefix}-db-${var.environment}"
  resource_group_name    = var.resource_group_name
  location               = var.location
  version                = "16"
  delegated_subnet_id    = var.subnet_id
  private_dns_zone_id    = var.private_dns_zone_id
  administrator_login    = var.db_admin_username
  administrator_password = var.db_admin_password

  storage_mb   = 32768
  sku_name     = "B_Standard_B1ms"
  zone         = "1"

  public_network_access_enabled = false

  backup_retention_days        = 7
  geo_redundant_backup_enabled = false

  tags = {
    environment = var.environment
    project     = var.name_prefix
    managed_by  = "terraform"
  }
}

resource "azurerm_postgresql_flexible_server_database" "this" {
  name      = "jobSite"
  server_id = azurerm_postgresql_flexible_server.this.id
  collation = "en_US.utf8"
  charset   = "utf8"
}
