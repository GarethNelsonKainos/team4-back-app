resource "azurerm_container_group" "this" {
  name                = var.container_group_name
  location            = var.location
  resource_group_name = var.resource_group_name
  os_type             = "Linux"
  ip_address_type     = var.ip_address_type
  dns_name_label      = var.dns_name_label

  container {
    name   = var.container_name
    image  = var.container_image
    cpu    = var.cpu
    memory = var.memory

    ports {
      port     = var.container_port
      protocol = "TCP"
    }

    environment_variables = var.environment_variables

    secure_environment_variables = var.secure_environment_variables
  }

  image_registry_credential {
    server   = var.image_registry_server
    username = var.image_registry_username
    password = var.image_registry_password
  }

  restart_policy = var.restart_policy

  tags = var.tags
}
