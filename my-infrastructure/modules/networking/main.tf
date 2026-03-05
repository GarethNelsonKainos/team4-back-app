resource "azurerm_virtual_network" "this" {
  name                = "${var.name_prefix}-vnet-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group_name
  address_space       = ["10.0.0.0/16"]

  tags = {
    environment = var.environment
    project     = var.name_prefix
    managed_by  = "terraform"
  }
}

resource "azurerm_subnet" "container_app" {
  name                 = "${var.name_prefix}-subnet-containerapp-${var.environment}"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = ["10.0.0.0/23"]

  delegation {
    name = "containerapp-delegation"
    service_delegation {
      name = "Microsoft.App/environments"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/join/action"
      ]
    }
  }
}

resource "azurerm_subnet" "database" {
  name                 = "${var.name_prefix}-subnet-db-${var.environment}"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = ["10.0.2.0/24"]

  delegation {
    name = "postgresql-delegation"
    service_delegation {
      name = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/join/action"
      ]
    }
  }
}

resource "azurerm_private_dns_zone" "postgres" {
  name                = "${var.name_prefix}-${var.environment}.postgres.database.azure.com"
  resource_group_name = var.resource_group_name

  tags = {
    environment = var.environment
    project     = var.name_prefix
    managed_by  = "terraform"
  }
}

resource "azurerm_private_dns_zone_virtual_network_link" "postgres" {
  name                  = "${var.name_prefix}-dns-link-${var.environment}"
  private_dns_zone_name = azurerm_private_dns_zone.postgres.name
  virtual_network_id    = azurerm_virtual_network.this.id
  resource_group_name   = var.resource_group_name
}
