import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database");

  // Create Bands
  const associateBand = await prisma.band.create({
    data: { bandName: "Associate" },
  });

  const seniorAssociateBand = await prisma.band.create({
    data: { bandName: "Senior Associate" },
  });

  const consultantBand = await prisma.band.create({
    data: { bandName: "Consultant" },
  });

  // Create Capabilities
  const engineeringCapability = await prisma.capability.create({
    data: { capabilityName: "Engineering" },
  });

  const dataAndAICapability = await prisma.capability.create({
    data: { capabilityName: "Data & AI" },
  });

  const platformsCapability = await prisma.capability.create({
    data: { capabilityName: "Platforms" },
  });

  // Create Job Roles
  await prisma.jobRole.create({
    data: {
      roleName: "Software Engineer",
      jobLocation: "London",
      capabilityId: engineeringCapability.capabilityId,
      bandId: associateBand.bandId,
      closingDate: new Date("2026-03-31"),
    },
  });

  await prisma.jobRole.create({
    data: {
      roleName: "Senior Software Engineer",
      jobLocation: "Manchester",
      capabilityId: engineeringCapability.capabilityId,
      bandId: seniorAssociateBand.bandId,
      closingDate: new Date("2026-04-15"),
    },
  });

  await prisma.jobRole.create({
    data: {
      roleName: "Data Scientist",
      jobLocation: "Belfast",
      capabilityId: dataAndAICapability.capabilityId,
      bandId: seniorAssociateBand.bandId,
      closingDate: new Date("2026-03-20"),
    },
  });

  await prisma.jobRole.create({
    data: {
      roleName: "Platform Engineer",
      jobLocation: "Edinburgh",
      capabilityId: platformsCapability.capabilityId,
      bandId: consultantBand.bandId,
      closingDate: new Date("2026-04-01"),
    },
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
