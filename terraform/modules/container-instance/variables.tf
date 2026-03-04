variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region for container instance"
  type        = string
}

variable "container_group_name" {
  description = "Name of the container group"
  type        = string
}

variable "container_name" {
  description = "Name of the container"
  type        = string
}

variable "container_image" {
  description = "Container image (e.g., registry.azurecr.io/repo:tag)"
  type        = string
}

variable "container_port" {
  description = "Port exposed by container"
  type        = number
  default     = 8080
}

variable "cpu" {
  description = "CPU cores allocated"
  type        = number
  default     = 1
}

variable "memory" {
  description = "Memory in GB allocated"
  type        = number
  default     = 1
}

variable "environment_variables" {
  description = "Environment variables"
  type        = map(string)
  default     = {}
}

variable "secure_environment_variables" {
  description = "Secure environment variables (secrets)"
  type        = map(string)
  default     = {}
  sensitive   = true
}

variable "image_registry_server" {
  description = "Container registry login server"
  type        = string
}

variable "image_registry_username" {
  description = "Container registry username"
  type        = string
}

variable "image_registry_password" {
  description = "Container registry password"
  type        = string
  sensitive   = true
}

variable "ip_address_type" {
  description = "IP address type (Public or Private)"
  type        = string
  default     = "Public"
}

variable "dns_name_label" {
  description = "DNS name label (optional, creates FQDN)"
  type        = string
  default     = null
}

variable "restart_policy" {
  description = "Restart policy (Always, OnFailure, Never)"
  type        = string
  default     = "Always"
}

variable "tags" {
  description = "Tags for resources"
  type        = map(string)
  default     = {}
}
