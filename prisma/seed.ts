import "dotenv/config";
import { PrismaClient } from "../src/generated/client.js";
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
      bandname: "Associate",
    },
  });

  const band2 = await prisma.band.create({
    data: {
      bandname: "Senior Associate",
    },
  });

  const band3 = await prisma.band.create({
    data: {
      bandname: "Consultant",
    },
  });

  console.log("✅ Created bands");

  // Create Capabilities
  const capability1 = await prisma.capability.create({
    data: {
      capabilityname: "Engineering",
    },
  });

  const capability2 = await prisma.capability.create({
    data: {
      capabilityname: "Data & AI",
    },
  });

  const capability3 = await prisma.capability.create({
    data: {
      capabilityname: "Platforms",
    },
  });

  console.log("✅ Created capabilities");

  // Create Job Roles
  await prisma.jobroles.create({
    data: {
      rolename: "Software Engineer",
      joblocation: "London",
      capabilityid: capability1.capabilityid,
      bandid: band1.bandid,
      closingdate: new Date("2026-03-31"),
    },
  });

  await prisma.jobroles.create({
    data: {
      rolename: "Senior Software Engineer",
      joblocation: "Manchester",
      capabilityid: capability1.capabilityid,
      bandid: band2.bandid,
      closingdate: new Date("2026-04-15"),
    },
  });

  await prisma.jobroles.create({
    data: {
      rolename: "Data Scientist",
      joblocation: "Belfast",
      capabilityid: capability2.capabilityid,
      bandid: band2.bandid,
      closingdate: new Date("2026-03-20"),
    },
  });

  await prisma.jobroles.create({
    data: {
      rolename: "Platform Engineer",
      joblocation: "Edinburgh",
      capabilityid: capability3.capabilityid,
      bandid: band3.bandid,
      closingdate: new Date("2026-04-01"),
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
