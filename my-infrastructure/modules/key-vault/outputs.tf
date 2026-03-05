output "vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.this.vault_uri
}

output "key_vault_id" {
  description = "ID of the Key Vault"
  value       = azurerm_key_vault.this.id
}
