-- CreateEnum
CREATE TYPE "application_status" AS ENUM ('in_progress', 'reviewing', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "applications" (
    "applicationid" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "jobroleid" INTEGER NOT NULL,
    "cvurl" VARCHAR NOT NULL,
    "applicationstatus" "application_status" NOT NULL DEFAULT 'in_progress',
    "appliedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("applicationid")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_userid_jobroleid_key" ON "applications"("userid", "jobroleid");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobroleid_fkey" FOREIGN KEY ("jobroleid") REFERENCES "jobroles"("jobroleid") ON DELETE RESTRICT ON UPDATE CASCADE;
