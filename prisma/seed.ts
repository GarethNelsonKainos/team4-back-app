import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create Bands
  const band1 = await prisma.band.create({
    data: {
      bandName: "Associate",
    },
  });

  const band2 = await prisma.band.create({
    data: {
      bandName: "Senior Associate",
    },
  });

  const band3 = await prisma.band.create({
    data: {
      bandName: "Consultant",
    },
  });

  console.log("✅ Created bands");

  // Create Capabilities
  const capability1 = await prisma.capability.create({
    data: {
      capabilityName: "Engineering",
    },
  });

  const capability2 = await prisma.capability.create({
    data: {
      capabilityName: "Data & AI",
    },
  });

  const capability3 = await prisma.capability.create({
    data: {
      capabilityName: "Platforms",
    },
  });

  console.log("✅ Created capabilities");

  // Create Job Roles
  await prisma.jobRole.create({
    data: {
      roleName: "Software Engineer",
      jobLocation: "London",
      capabilityId: capability1.capabilityId,
      bandId: band1.bandId,
      closingDate: new Date("2026-03-31"),
    },
  });

  await prisma.jobRole.create({
    data: {
      roleName: "Senior Software Engineer",
      jobLocation: "Manchester",
      capabilityId: capability1.capabilityId,
      bandId: band2.bandId,
      closingDate: new Date("2026-04-15"),
    },
  });

  await prisma.jobRole.create({
    data: {
      roleName: "Data Scientist",
      jobLocation: "Belfast",
      capabilityId: capability2.capabilityId,
      bandId: band2.bandId,
      closingDate: new Date("2026-03-20"),
    },
  });

  await prisma.jobRole.create({
    data: {
      roleName: "Platform Engineer",
      jobLocation: "Edinburgh",
      capabilityId: capability3.capabilityId,
      bandId: band3.bandId,
      closingDate: new Date("2026-04-01"),
    },
  });

  console.log("✅ Created job roles");
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
