output "fqdn" {
  description = "Fully qualified domain name of the container app"
  value       = azurerm_container_app.this.ingress[0].fqdn
}

output "container_app_id" {
  description = "ID of the container app"
  value       = azurerm_container_app.this.id
}

output "environment_id" {
  description = "ID of the container app environment"
  value       = azurerm_container_app_environment.this.id
}
