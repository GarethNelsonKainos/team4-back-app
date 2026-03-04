variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region for database"
  type        = string
}

variable "server_name" {
  description = "PostgreSQL server name (must be globally unique)"
  type        = string
}

variable "admin_username" {
  description = "PostgreSQL administrator username"
  type        = string
  default     = "psqladmin"
  sensitive   = true
}

variable "admin_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}

variable "database_name" {
  description = "PostgreSQL database name"
  type        = string
}

variable "sku_name" {
  description = "SKU name (e.g., B_Gen5_1, GP_Gen5_2)"
  type        = string
  default     = "B_Gen5_1"
}

variable "postgres_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "11"
}

variable "storage_mb" {
  description = "Storage size in MB"
  type        = number
  default     = 51200 # 50GB
}

variable "backup_retention_days" {
  description = "Backup retention in days"
  type        = number
  default     = 7
}

variable "geo_redundant_backup_enabled" {
  description = "Enable geo-redundant backups"
  type        = bool
  default     = false
}

variable "auto_grow_enabled" {
  description = "Enable automatic storage growth"
  type        = bool
  default     = true
}

variable "developer_ip" {
  description = "Developer IP for firewall rule (optional)"
  type        = string
  default     = null
}

variable "tags" {
  description = "Tags for resources"
  type        = map(string)
  default     = {}
}
