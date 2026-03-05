variable "name_prefix" {
  description = "Prefix for resource naming"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "tenant_id" {
  description = "Azure Active Directory tenant ID"
  type        = string
}

variable "object_id" {
  description = "Object ID of the deploying principal (user/service principal)"
  type        = string
}

variable "db_admin_password" {
  description = "Database administrator password to store in Key Vault"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret to store in Key Vault"
  type        = string
  sensitive   = true
}
