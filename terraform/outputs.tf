output "resource_group_name" {
  description = "Resource group name"
  value       = module.resource_group.name
}

output "resource_group_id" {
  description = "Resource group id"
  value       = module.resource_group.id
}

output "resource_group_location" {
  description = "Resource group location"
  value       = module.resource_group.location
}
