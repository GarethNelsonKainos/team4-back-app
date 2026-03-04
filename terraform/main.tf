module "resource_group" {
  source   = "./modules/resource-group"
  name     = "${var.project_name}-${var.environment}-rg"
  location = var.location
}
