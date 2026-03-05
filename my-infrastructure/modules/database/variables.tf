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

variable "db_admin_username" {
  description = "Database administrator username"
  type        = string
}

variable "db_admin_password" {
  description = "Database administrator password"
  type        = string
  sensitive   = true
}

variable "subnet_id" {
  description = "ID of the delegated subnet for the database"
  type        = string
}

variable "private_dns_zone_id" {
  description = "ID of the private DNS zone for PostgreSQL"
  type        = string
}
