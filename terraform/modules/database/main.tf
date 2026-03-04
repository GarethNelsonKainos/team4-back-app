resource "azurerm_postgresql_server" "this" {
  name                = var.server_name
  location            = var.location
  resource_group_name = var.resource_group_name

  administrator_login          = var.admin_username
  administrator_login_password = var.admin_password

  sku_name   = var.sku_name
  version    = var.postgres_version
  storage_mb = var.storage_mb

  backup_retention_days             = var.backup_retention_days
  geo_redundant_backup_enabled      = var.geo_redundant_backup_enabled
  auto_grow_enabled                 = var.auto_grow_enabled
  ssl_enforcement_enabled           = true
  ssl_minimal_tls_version_enforced  = "TLS1_2"

  tags = var.tags
}

resource "azurerm_postgresql_database" "this" {
  name                = var.database_name
  resource_group_name = azurerm_postgresql_server.this.resource_group_name
  server_name         = azurerm_postgresql_server.this.name
  charset             = "UTF8"
  collation           = "en_US.utf8"
}

resource "azurerm_postgresql_firewall_rule" "allow_azure" {
  name                = "AllowAzureServices"
  resource_group_name = azurerm_postgresql_server.this.resource_group_name
  server_name         = azurerm_postgresql_server.this.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

resource "azurerm_postgresql_firewall_rule" "developer" {
  count               = var.developer_ip != null ? 1 : 0
  name                = "AllowDeveloper"
  resource_group_name = azurerm_postgresql_server.this.resource_group_name
  server_name         = azurerm_postgresql_server.this.name
  start_ip_address    = var.developer_ip
  end_ip_address      = var.developer_ip
}
