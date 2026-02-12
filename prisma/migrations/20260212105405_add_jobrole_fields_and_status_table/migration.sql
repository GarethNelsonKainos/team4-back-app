/*
  Warnings:

  - Added the required column `description` to the `jobroles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberofopenpositions` to the `jobroles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsibilities` to the `jobroles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sharepointurl` to the `jobroles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusid` to the `jobroles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jobroles" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "numberofopenpositions" INTEGER NOT NULL,
ADD COLUMN     "responsibilities" TEXT NOT NULL,
ADD COLUMN     "sharepointurl" VARCHAR(500) NOT NULL,
ADD COLUMN     "statusid" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "status" (
    "statusid" SERIAL NOT NULL,
    "statusname" VARCHAR(100) NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("statusid")
);

-- AddForeignKey
ALTER TABLE "jobroles" ADD CONSTRAINT "jobroles_statusid_fkey" FOREIGN KEY ("statusid") REFERENCES "status"("statusid") ON DELETE RESTRICT ON UPDATE CASCADE;
