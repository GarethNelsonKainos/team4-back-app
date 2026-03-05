variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "uksouth"
}

variable "environment" {
  description = "Deployment environment (dev, test, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "test", "prod"], var.environment)
    error_message = "environment must be one of: dev, test, prod."
  }
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "team4-back-app"
}

# Database variables (managed separately in Azure)
variable "database_url" {
  description = "PostgreSQL database connection URL"
  type        = string
  default     = ""
  sensitive   = true
}

# ACR variables
variable "acr_sku" {
  description = "ACR SKU"
  type        = string
  default     = "Standard"
}

variable "acr_admin_enabled" {
  description = "Enable ACR admin access"
  type        = bool
  default     = true
}

# Container Instance variables
variable "enable_container_instance" {
  description = "Enable deployment of container instance"
  type        = bool
  default     = false
}

variable "container_image" {
  description = "Container image URI"
  type        = string
  default     = ""
}

variable "container_port" {
  description = "Container port"
  type        = number
  default     = 8080
}

variable "container_cpu" {
  description = "Container CPU cores"
  type        = number
  default     = 1
}

variable "container_memory" {
  description = "Container memory in GB"
  type        = number
  default     = 1
}

variable "container_ip_address_type" {
  description = "IP address type (Public, Private)"
  type        = string
  default     = "Public"
}

variable "dns_name_label" {
  description = "DNS name label for container"
  type        = string
  default     = ""
}

# AWS S3 variables
variable "aws_region" {
  description = "AWS region for S3"
  type        = string
  default     = "us-east-1"
}

variable "aws_access_key_id" {
  description = "AWS access key ID"
  type        = string
  default     = ""
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS secret access key"
  type        = string
  default     = ""
  sensitive   = true
}

variable "s3_bucket_name" {
  description = "S3 bucket name for uploads"
  type        = string
  default     = ""
}
