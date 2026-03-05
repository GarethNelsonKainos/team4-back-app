output "resource_group_name" {
  description = "Name of the resource group"
  value       = module.resource_group.name
}

output "acr_login_server" {
  description = "ACR login server URL"
  value       = module.acr.login_server
}

output "container_app_fqdn" {
  description = "Fully qualified domain name of the container app"
  value       = module.container_app.fqdn
}

output "database_fqdn" {
  description = "Fully qualified domain name of the PostgreSQL server"
  value       = module.database.fqdn
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = module.key_vault.vault_uri
}
