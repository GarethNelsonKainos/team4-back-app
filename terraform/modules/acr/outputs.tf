output "registry_name" {
  description = "Container registry name"
  value       = azurerm_container_registry.this.name
}

output "registry_id" {
  description = "Container registry resource ID"
  value       = azurerm_container_registry.this.id
}

output "login_server" {
  description = "Container registry login server URL"
  value       = azurerm_container_registry.this.login_server
}

output "admin_username" {
  description = "Admin username (if enabled)"
  value       = azurerm_container_registry.this.admin_username
  sensitive   = true
}

output "admin_password" {
  description = "Admin password (if enabled)"
  value       = azurerm_container_registry.this.admin_password
  sensitive   = true
}
