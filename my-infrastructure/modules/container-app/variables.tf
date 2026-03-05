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

variable "acr_login_server" {
  description = "ACR login server URL"
  type        = string
}

variable "acr_admin_username" {
  description = "ACR admin username"
  type        = string
}

variable "acr_admin_password" {
  description = "ACR admin password"
  type        = string
  sensitive   = true
}

variable "database_url" {
  description = "Full PostgreSQL connection string"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret for the backend application"
  type        = string
  sensitive   = true
}

variable "infrastructure_subnet_id" {
  description = "ID of the subnet for the container app environment"
  type        = string
}
