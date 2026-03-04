output "container_group_id" {
  description = "Container group resource ID"
  value       = azurerm_container_group.this.id
}

output "container_group_name" {
  description = "Container group name"
  value       = azurerm_container_group.this.name
}

output "ip_address" {
  description = "Container group IP address"
  value       = azurerm_container_group.this.ip_address
}

output "fqdn" {
  description = "Container group FQDN (if DNS label set)"
  value       = azurerm_container_group.this.fqdn
}

output "containers" {
  description = "Container details"
  value       = azurerm_container_group.this.container
}
