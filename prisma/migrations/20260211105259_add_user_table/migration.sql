-- CreateTable
CREATE TABLE "user" (
    "userid" SERIAL NOT NULL,
    "useremail" VARCHAR(200) NOT NULL,
    "userpassword" VARCHAR(255) NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_useremail_key" ON "user"("useremail");
