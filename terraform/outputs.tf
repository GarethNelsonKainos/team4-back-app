output "resource_group_name" {
  description = "Resource group name"
  value       = module.resource_group.name
}

output "resource_group_id" {
  description = "Resource group id"
  value       = module.resource_group.id
}

output "resource_group_location" {
  description = "Resource group location"
  value       = module.resource_group.location
}

# Database outputs
output "database_server_name" {
  description = "PostgreSQL server name"
  value       = module.database.server_name
}

output "database_server_fqdn" {
  description = "PostgreSQL server FQDN"
  value       = module.database.server_fqdn
}

output "database_name" {
  description = "PostgreSQL database name"
  value       = module.database.database_name
}

output "database_connection_string" {
  description = "PostgreSQL connection string"
  value       = module.database.connection_string
  sensitive   = true
}

# ACR outputs
output "acr_registry_name" {
  description = "Azure Container Registry name"
  value       = module.acr.registry_name
}

output "acr_login_server" {
  description = "ACR login server URL"
  value       = module.acr.login_server
}

output "acr_registry_id" {
  description = "ACR registry resource ID"
  value       = module.acr.registry_id
}

# Container Instance outputs
output "container_instance_id" {
  description = "Container instance resource ID"
  value       = var.enable_container_instance ? module.container_instance[0].container_group_id : null
}

output "container_instance_ip_address" {
  description = "Container instance IP address"
  value       = var.enable_container_instance ? module.container_instance[0].ip_address : null
}

output "container_instance_fqdn" {
  description = "Container instance FQDN"
  value       = var.enable_container_instance ? module.container_instance[0].fqdn : null
}
