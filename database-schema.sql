-- Database Schema for Job Roles Application

-- Create Band table
CREATE TABLE Band (
    bandId INT PRIMARY KEY AUTO_INCREMENT,
    bandName VARCHAR(100) NOT NULL
);

-- Create Capability table
CREATE TABLE Capability (
    capabilityId INT PRIMARY KEY AUTO_INCREMENT,
    capabilityName VARCHAR(100) NOT NULL
);

-- Create Job-roles table
CREATE TABLE JobRoles (
    jobRoleId INT PRIMARY KEY AUTO_INCREMENT,
    roleName VARCHAR(200) NOT NULL,
    location VARCHAR(100) NOT NULL,
    capabilityId INT NOT NULL,
    bandId INT NOT NULL,
    closingDate DATE NOT NULL,
    FOREIGN KEY (capabilityId) REFERENCES Capability(capabilityId),
    FOREIGN KEY (bandId) REFERENCES Band(bandId)
);
