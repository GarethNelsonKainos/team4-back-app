output "fqdn" {
  description = "Fully qualified domain name of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.this.fqdn
}

output "server_name" {
  description = "Name of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.this.name
}

output "database_name" {
  description = "Name of the database"
  value       = azurerm_postgresql_flexible_server_database.this.name
}
