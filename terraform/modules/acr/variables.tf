variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region for ACR"
  type        = string
}

variable "registry_name" {
  description = "Azure Container Registry name (must be globally unique, lowercase)"
  type        = string
}

variable "sku" {
  description = "SKU (Basic, Standard, Premium)"
  type        = string
  default     = "Standard"
}

variable "admin_enabled" {
  description = "Enable admin access"
  type        = bool
  default     = false
}

variable "enable_pull_role" {
  description = "Enable role assignment for pull"
  type        = bool
  default     = false
}

variable "pull_principal_id" {
  description = "Principal ID for ACRPull role (e.g., managed identity)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags for resources"
  type        = map(string)
  default     = {}
}
