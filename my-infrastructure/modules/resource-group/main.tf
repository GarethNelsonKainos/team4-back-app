resource "azurerm_resource_group" "this" {
  name     = "${var.name_prefix}-rg-${var.environment}"
  location = var.location

  tags = {
    environment = var.environment
    project     = var.name_prefix
    managed_by  = "terraform"
  }
}
