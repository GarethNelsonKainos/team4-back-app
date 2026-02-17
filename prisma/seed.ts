import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import pg from "pg";
import * as prismaPkg from "../src/generated/client";

// Create a connection pool using the DATABASE_URL
const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});

// Wrap the pool in Prisma's pg adapter (required in Prisma v7)
const adapter = new PrismaPg(pool);

// Create Prisma Client with the adapter
const prisma = new prismaPkg.PrismaClient({ adapter });

async function main() {
	console.log("Seeding database");

	const saltRounds = Number(process.env.SALT_ROUNDS || 10);
	const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
	const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
	const applicantEmail =
		process.env.SEED_APPLICANT_EMAIL || "applicant@example.com";
	const applicantPassword =
		process.env.SEED_APPLICANT_PASSWORD || "ChangeMe123!";

	// Create Statuses first
	const openStatus = await prisma.status.upsert({
		where: { statusName: "Open" },
		update: {},
		create: { statusName: "Open" },
	});

	const _closedStatus = await prisma.status.upsert({
		where: { statusName: "Closed" },
		update: {},
		create: { statusName: "Closed" },
	});

	// Create Bands
	const associateBand = await prisma.band.upsert({
		where: { bandName: "Associate" },
		update: {},
		create: { bandName: "Associate" },
	});

	const seniorAssociateBand = await prisma.band.upsert({
		where: { bandName: "Senior Associate" },
		update: {},
		create: { bandName: "Senior Associate" },
	});

	const consultantBand = await prisma.band.upsert({
		where: { bandName: "Consultant" },
		update: {},
		create: { bandName: "Consultant" },
	});

	// Create Capabilities
	const engineeringCapability = await prisma.capability.upsert({
		where: { capabilityName: "Engineering" },
		update: {},
		create: { capabilityName: "Engineering" },
	});

	const dataAndAICapability = await prisma.capability.upsert({
		where: { capabilityName: "Data & AI" },
		update: {},
		create: { capabilityName: "Data & AI" },
	});

	const platformsCapability = await prisma.capability.upsert({
		where: { capabilityName: "Platforms" },
		update: {},
		create: { capabilityName: "Platforms" },
	});

	// Create Job Roles with all required fields
	await prisma.jobRole.create({
		data: {
			roleName: "Software Engineer",
			jobLocation: "London",
			capabilityId: engineeringCapability.capabilityId,
			bandId: associateBand.bandId,
			closingDate: new Date("2026-03-31"),
			description: "Join our Engineering team as a Software Engineer...",
			responsibilities: "Design and develop software solutions...",
			sharepointUrl:
				"https://kainos.sharepoint.com/sites/careers/software-engineer",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 3,
		},
	});

	await prisma.jobRole.create({
		data: {
			roleName: "Senior Software Engineer",
			jobLocation: "Manchester",
			capabilityId: engineeringCapability.capabilityId,
			bandId: seniorAssociateBand.bandId,
			closingDate: new Date("2026-04-15"),
			description: "Lead technical projects as a Senior Software Engineer...",
			responsibilities:
				"Lead development teams and mentor junior developers...",
			sharepointUrl:
				"https://kainos.sharepoint.com/sites/careers/senior-software-engineer",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 2,
		},
	});

	await prisma.jobRole.create({
		data: {
			roleName: "Data Scientist",
			jobLocation: "Belfast",
			capabilityId: dataAndAICapability.capabilityId,
			bandId: seniorAssociateBand.bandId,
			closingDate: new Date("2026-03-20"),
			description:
				"Apply advanced analytics and machine learning techniques...",
			responsibilities:
				"Develop predictive models and analyze large datasets...",
			sharepointUrl:
				"https://kainos.sharepoint.com/sites/careers/data-scientist",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.create({
		data: {
			roleName: "Platform Engineer",
			jobLocation: "Edinburgh",
			capabilityId: platformsCapability.capabilityId,
			bandId: consultantBand.bandId,
			closingDate: new Date("2026-04-01"),
			description:
				"Build and maintain cloud infrastructure and deployment pipelines...",
			responsibilities:
				"Design scalable cloud architectures and automate deployments...",
			sharepointUrl:
				"https://kainos.sharepoint.com/sites/careers/platform-engineer",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 2,
		},
	});

	const adminHashedPassword = await bcrypt.hash(adminPassword, saltRounds);
	const applicantHashedPassword = await bcrypt.hash(
		applicantPassword,
		saltRounds,
	);

	await prisma.user.upsert({
		where: { userEmail: adminEmail },
		update: {
			userPassword: adminHashedPassword,
			userRole: prismaPkg.UserRole.ADMIN,
		},
		create: {
			userEmail: adminEmail,
			userPassword: adminHashedPassword,
			userRole: prismaPkg.UserRole.ADMIN,
		},
	});

	await prisma.user.upsert({
		where: { userEmail: applicantEmail },
		update: {
			userPassword: applicantHashedPassword,
			userRole: prismaPkg.UserRole.APPLICANT,
		},
		create: {
			userEmail: applicantEmail,
			userPassword: applicantHashedPassword,
			userRole: prismaPkg.UserRole.APPLICANT,
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
		await pool.end();
	});
