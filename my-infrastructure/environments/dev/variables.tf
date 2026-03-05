variable "environment" {
  description = "The deployment environment (dev, staging, prod)"
  type        = string
}

variable "location" {
  description = "The Azure region to deploy resources to"
  type        = string
  default     = "uksouth"
}

variable "name_prefix" {
  description = "Prefix used for naming all resources"
  type        = string
  default     = "team4"
}

variable "db_admin_username" {
  description = "Administrator username for the PostgreSQL database"
  type        = string
  default     = "adminuser"
}

variable "db_admin_password" {
  description = "Administrator password for the PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret used by the backend application"
  type        = string
  sensitive   = true
}
