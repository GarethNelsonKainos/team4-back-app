module "resource_group" {
  source   = "./modules/resource-group"
  name     = "${var.project_name}-${var.environment}-rg"
  location = var.location
}

locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}
