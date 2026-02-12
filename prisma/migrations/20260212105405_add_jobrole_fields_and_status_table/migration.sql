-- Step 1: Create Status table with unique constraint
CREATE TABLE "status" (
    "statusid" SERIAL NOT NULL,
    "statusname" VARCHAR(100) NOT NULL UNIQUE,

    CONSTRAINT "status_pkey" PRIMARY KEY ("statusid")
);

-- Step 2: Seed initial status values
INSERT INTO "status" ("statusname") VALUES ('Open');
INSERT INTO "status" ("statusname") VALUES ('Closed');

-- Step 3: Add new columns as NULLABLE first (safe for existing data)
ALTER TABLE "jobroles" ADD COLUMN "description" TEXT;
ALTER TABLE "jobroles" ADD COLUMN "responsibilities" TEXT;
ALTER TABLE "jobroles" ADD COLUMN "sharepointurl" VARCHAR(500);
ALTER TABLE "jobroles" ADD COLUMN "statusid" INTEGER;
ALTER TABLE "jobroles" ADD COLUMN "numberofopenpositions" INTEGER;

-- Step 4: Backfill existing rows with default values
UPDATE "jobroles" 
SET 
    "description" = 'Description to be added',
    "responsibilities" = 'Responsibilities to be added',
    "sharepointurl" = 'https://sharepoint.example.com/to-be-updated',
    "statusid" = (SELECT "statusid" FROM "status" WHERE "statusname" = 'Open' LIMIT 1),
    "numberofopenpositions" = 1
WHERE "description" IS NULL;

-- Step 5: Now make columns NOT NULL (safe because all rows have values)
ALTER TABLE "jobroles" ALTER COLUMN "description" SET NOT NULL;
ALTER TABLE "jobroles" ALTER COLUMN "responsibilities" SET NOT NULL;
ALTER TABLE "jobroles" ALTER COLUMN "sharepointurl" SET NOT NULL;
ALTER TABLE "jobroles" ALTER COLUMN "statusid" SET NOT NULL;
ALTER TABLE "jobroles" ALTER COLUMN "numberofopenpositions" SET NOT NULL;

-- Step 6: Add Foreign Key constraint (safe because all statusid values are valid)
ALTER TABLE "jobroles" ADD CONSTRAINT "jobroles_statusid_fkey" 
    FOREIGN KEY ("statusid") REFERENCES "status"("statusid") 
    ON DELETE RESTRICT ON UPDATE CASCADE;
