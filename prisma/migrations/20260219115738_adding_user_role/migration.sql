-- CreateTable
CREATE TABLE "userrole" (
    "roleid" SERIAL NOT NULL,
    "rolename" VARCHAR(100) NOT NULL,

    CONSTRAINT "userrole_pkey" PRIMARY KEY ("roleid")
);

-- CreateIndex
CREATE UNIQUE INDEX "userrole_rolename_key" ON "userrole"("rolename");

-- Insert default roles
INSERT INTO "userrole" ("rolename") VALUES ('ADMIN');
INSERT INTO "userrole" ("rolename") VALUES ('APPLICANT');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "userroleid" INTEGER NOT NULL DEFAULT 2;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_userroleid_fkey" FOREIGN KEY ("userroleid") REFERENCES "userrole"("roleid") ON DELETE RESTRICT ON UPDATE CASCADE;
