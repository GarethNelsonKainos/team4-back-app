/*
  Warnings:

  - You are about to drop the `Band` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Capability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JobRoles" DROP CONSTRAINT "JobRoles_bandId_fkey";

-- DropForeignKey
ALTER TABLE "JobRoles" DROP CONSTRAINT "JobRoles_capabilityId_fkey";

-- DropTable
DROP TABLE "Band";

-- DropTable
DROP TABLE "Capability";

-- DropTable
DROP TABLE "JobRoles";

-- CreateTable
CREATE TABLE "band" (
    "bandid" SERIAL NOT NULL,
    "bandname" VARCHAR(100),

    CONSTRAINT "band_pkey" PRIMARY KEY ("bandid")
);

-- CreateTable
CREATE TABLE "capability" (
    "capabilityid" SERIAL NOT NULL,
    "capabilityname" VARCHAR(100),

    CONSTRAINT "capability_pkey" PRIMARY KEY ("capabilityid")
);

-- CreateTable
CREATE TABLE "jobroles" (
    "jobroleid" SERIAL NOT NULL,
    "rolename" VARCHAR(200),
    "joblocation" VARCHAR(100),
    "capabilityid" INTEGER NOT NULL,
    "bandid" INTEGER NOT NULL,
    "closingdate" DATE,

    CONSTRAINT "jobroles_pkey" PRIMARY KEY ("jobroleid")
);

-- AddForeignKey
ALTER TABLE "jobroles" ADD CONSTRAINT "jobroles_capabilityid_fkey" FOREIGN KEY ("capabilityid") REFERENCES "capability"("capabilityid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobroles" ADD CONSTRAINT "jobroles_bandid_fkey" FOREIGN KEY ("bandid") REFERENCES "band"("bandid") ON DELETE RESTRICT ON UPDATE CASCADE;
