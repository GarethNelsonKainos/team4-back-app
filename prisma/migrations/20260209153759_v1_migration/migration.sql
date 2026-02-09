-- CreateTable
CREATE TABLE "Band" (
    "bandId" SERIAL NOT NULL,
    "bandName" VARCHAR(100),

    CONSTRAINT "Band_pkey" PRIMARY KEY ("bandId")
);

-- CreateTable
CREATE TABLE "Capability" (
    "capabilityId" SERIAL NOT NULL,
    "capabilityName" VARCHAR(100),

    CONSTRAINT "Capability_pkey" PRIMARY KEY ("capabilityId")
);

-- CreateTable
CREATE TABLE "JobRoles" (
    "jobRoleId" SERIAL NOT NULL,
    "roleName" VARCHAR(200),
    "jobLocation" VARCHAR(100),
    "capabilityId" INTEGER NOT NULL,
    "bandId" INTEGER NOT NULL,
    "closingDate" DATE,

    CONSTRAINT "JobRoles_pkey" PRIMARY KEY ("jobRoleId")
);

-- AddForeignKey
ALTER TABLE "JobRoles" ADD CONSTRAINT "JobRoles_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability"("capabilityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRoles" ADD CONSTRAINT "JobRoles_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("bandId") ON DELETE RESTRICT ON UPDATE CASCADE;
