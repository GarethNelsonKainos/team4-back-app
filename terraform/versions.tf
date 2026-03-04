terraform {
  required_version = ">= 1.5.0"

  backend "azurerm" {
    resource_group_name  = "team4-back-app-dev-rg"
    storage_account_name = "t4backappstate632722"
    container_name       = "tfstate"
    key                  = "team4-back-app.tfstate"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
  }
}
