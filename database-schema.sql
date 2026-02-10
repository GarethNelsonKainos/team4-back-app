-- Database Schema for Job Roles Application (PostgreSQL)

-- Create band table
CREATE TABLE band (
    bandid SERIAL PRIMARY KEY,
    bandname VARCHAR(100)
);

-- Create capability table
CREATE TABLE capability (
    capabilityid SERIAL PRIMARY KEY,
    capabilityname VARCHAR(100)
);

-- Create job roles table
CREATE TABLE jobroles (
    jobroleid SERIAL PRIMARY KEY,
    rolename VARCHAR(200),
    joblocation VARCHAR(100),
    capabilityid INT NOT NULL,
    bandid INT NOT NULL,
    closingdate DATE,
    FOREIGN KEY (capabilityid) REFERENCES capability(capabilityid),
    FOREIGN KEY (bandid) REFERENCES band(bandid)
);
