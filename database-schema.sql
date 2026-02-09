-- Database Schema for Job Roles Application (PostgreSQL)

-- Create Band table
CREATE TABLE Band (
    bandId SERIAL PRIMARY KEY,
    bandName VARCHAR(100)
);

-- Create Capability table
CREATE TABLE Capability (
    capabilityId SERIAL PRIMARY KEY,
    capabilityName VARCHAR(100)
);

-- Create Job-roles table
CREATE TABLE JobRoles (
    jobRoleId SERIAL PRIMARY KEY,
    roleName VARCHAR(200),
    jobLocation VARCHAR(100),
    capabilityId INT NOT NULL,
    bandId INT NOT NULL,
    closingDate DATE,
    FOREIGN KEY (capabilityId) REFERENCES Capability(capabilityId),
    FOREIGN KEY (bandId) REFERENCES Band(bandId)
);
