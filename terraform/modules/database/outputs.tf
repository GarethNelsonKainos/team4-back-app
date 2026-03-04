output "server_name" {
  description = "PostgreSQL server name"
  value       = azurerm_postgresql_server.this.name
}

output "server_fqdn" {
  description = "PostgreSQL server fully qualified domain name"
  value       = azurerm_postgresql_server.this.fqdn
}

output "database_name" {
  description = "PostgreSQL database name"
  value       = azurerm_postgresql_database.this.name
}

output "admin_username" {
  description = "PostgreSQL admin username"
  value       = azurerm_postgresql_server.this.administrator_login
  sensitive   = true
}

output "connection_string" {
  description = "PostgreSQL connection string for app"
  value       = "postgresql://${azurerm_postgresql_server.this.administrator_login}:${var.admin_password}@${azurerm_postgresql_server.this.fqdn}:5432/${azurerm_postgresql_database.this.name}?sslmode=require"
  sensitive   = true
}

output "jdbc_url" {
  description = "JDBC connection URL"
  value       = "jdbc:postgresql://${azurerm_postgresql_server.this.fqdn}:5432/${azurerm_postgresql_database.this.name}"
  sensitive   = true
}
