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
