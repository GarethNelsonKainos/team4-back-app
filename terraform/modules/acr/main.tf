resource "azurerm_container_registry" "this" {
  name                = var.registry_name
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = var.sku

  admin_enabled = var.admin_enabled

  tags = var.tags
}

resource "azurerm_role_assignment" "pull_access" {
  count              = var.enable_pull_role ? 1 : 0
  scope              = azurerm_container_registry.this.id
  role_definition_id = "/subscriptions/${data.azurerm_client_config.current.subscription_id}/providers/Microsoft.Authorization/roleDefinitions/7f951dda-4ed3-4694-a41a-89b694d56da1"
  principal_id       = var.pull_principal_id
}

data "azurerm_client_config" "current" {}
