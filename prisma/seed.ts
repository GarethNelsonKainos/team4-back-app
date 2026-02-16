import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
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

	// Create Statuses first
	const openStatus = await prisma.status.create({
		data: { statusName: "Open" },
	});

	const _closedStatus = await prisma.status.create({
		data: { statusName: "Closed" },
	});

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

	const managerBand = await prisma.band.create({
		data: { bandName: "Manager" },
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

	const productSpecialistCapability = await prisma.capability.create({
		data: { capabilityName: "Product Specialist" },
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

	await prisma.jobRole.create({
		data: {
			roleName: "Intelligent Automation Solution Architect",
			jobLocation: "Belfast",
			capabilityId: productSpecialistCapability.capabilityId,
			bandId: managerBand.bandId,
			closingDate: new Date("2026-04-30"),
			description:
				"As an Intelligent Automation Solution Architect (Manager) in Kainos, you will lead multi-skilled delivery teams to design and deliver high quality Intelligent Automation solutions which delight our customers and impact the lives of users worldwide.",
			responsibilities:
				"• Working with customer architects to agree functional and non-functional designs, advising customers and managers on the estimated effort, technical implications and complexity surrounding your designs.\n• Managing, coaching and developing a small number of staff, with a focus on managing employee performance and assisting in their career development.\n• Directing and leading your team as you solve challenging problems together.\n• As a technical leader, you working with your peers to develop policy and standards, share knowledge and mentor those around you. You'll do this whilst advising about new technologies and approaches, with room to learn, develop and grow.",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Intelligent%20Automation%20Solution%20Architect%20(M).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
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
