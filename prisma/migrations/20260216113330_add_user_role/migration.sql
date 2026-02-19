-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'APPLICANT');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "userrole" "UserRole" NOT NULL DEFAULT 'APPLICANT';
