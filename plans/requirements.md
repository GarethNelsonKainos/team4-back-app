<UI requirements>
New JobRoleController with GET /job-roles route to render list of job roles
New JobRoleService with axios call to GET /job-roles API endpoint
New job-role-list.html view
<API requirements>
New JobRoleController with GET /job-roles route to return list of job roles
New JobRoleService which returns list of JobRoleResponse
New JobRoleDao which queries job-role database table and returns list of JobRole
New JobRoleResponse model
New JobRole model
New JobRoleMapper which maps JobRole to JobRoleResponse
<Database requirements>
New job-roles table with jobRoleId, roleName, location, capabilityId, bandId, closingDate
New capability table with capabilityId, capabilityName
New band table with nameId, bandName