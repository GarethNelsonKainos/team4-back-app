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
	const apprenticeBand = await prisma.band.create({
		data: { bandName: "Apprentice" },
	});

	const traineeBand = await prisma.band.create({
		data: { bandName: "Trainee" },
	});

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

	const principalBand = await prisma.band.create({
		data: { bandName: "Principal" },
	});

	const leadershipCommunityBand = await prisma.band.create({
		data: { bandName: "Leadership Community" },
	});

	// Create Capabilities
	const engineeringCapability = await prisma.capability.create({
		data: { capabilityName: "Engineering" },
	});

	const strategyAndPlanningCapability = await prisma.capability.create({
		data: { capabilityName: "Strategy and Planning" },
	});

	const architectureCapability = await prisma.capability.create({
		data: { capabilityName: "Architecture" },
	});

	const testingAndQualityAssuranceCapability = await prisma.capability.create({
		data: { capabilityName: "Testing and Quality Assurance" },
	});

	const productSpecialistCapability = await prisma.capability.create({
		data: { capabilityName: "Product Specialist" },
	});

	const lowCodeEngineeringCapability = await prisma.capability.create({
		data: { capabilityName: "Low Code Engineering" },
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
			capabilityId: engineeringCapability.capabilityId,
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
			capabilityId: architectureCapability.capabilityId,
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
				"MINIMUM (ESSENTIAL) REQUIREMENTS:\n• Experience delivering software designs for multi-tiered modern software applications including significant Intelligent Automation components\n• Experience of technical ownership for IA areas, including integrations, architecture, estimation, product planning and user story/requirement creation\n• Experience in communicating and negotiating whole solution architecture concepts with customer stakeholders\n• Experience prioritising non-functional concerns for customers and has experience incorporating these into the application design\n• Experience with public cloud platforms, such as AWS and Azure, including SaaS and PaaS offerings\n• Understanding of RPA concepts and product landscape including expertise in at least one of: UiPath, MS Power Platform\n• Able to simply and clearly communicate technical design in conversation, documentation and presentations including to senior technical and non-technical stakeholders\n• Able to make effective decisions within fast-moving delivery\n• Experience mentoring and coaching members of your team and wider community\n\nDESIRABLE:\n• Active participation in knowledge sharing activities, both within the team and at a wider capability level and externally where appropriate\n• Has pro-actively developed business across an account with sales and account managers\n• Experience producing estimates for implementation options as part of presales activity\n• Actively maintains a knowledge of competitor landscape including alternative products and their relative strengths and weaknesses\n• Professional level certification in at least one of: UiPath, MS Power Platform, Automation Anywhere, BluePrism\n• Experience of core business processes, including Hire to Retire, Order to Cash, Procure to Pay",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Intelligent%20Automation%20Solution%20Architect%20(M).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.create({
		data: {
			roleName: "Technology Leader",
			jobLocation: "Belfast",
			capabilityId: strategyAndPlanningCapability.capabilityId,
			bandId: leadershipCommunityBand.bandId,
			closingDate: new Date("2026-05-31"),
			description:
				"A technology leader is key strategic role within the business making executive technology decisions on behalf of the business, based upon the sector and practices' strategic direction and goals. The core responsibilities of a technology leader in Kainos include setting a Technology direction, a technical advisor to the business and C-level clients, maintaining a commercial edge over other technology services providers, developing and nurturing technical talent across the organisation and representing Kainos as a technology evangelist.",
			responsibilities:
				"People Development:\n• Identifying, mentoring and coaching talent within the technical capabilities, supporting a culture of wellbeing and inclusion\n• Developing future technology talent aligned with the needs of the business in terms of strategic development and succession planning\n• Creating environments for technical talent to thrive and achieve ambitious goals\n\nStrategy:\n• Conducting strategic analysis and make recommendations that could influence the business strategy over medium- and long-term horizons\n• Work with Innovation and business development teams to qualify and evidence strategic analysis\n• Managing the technology budget and making investments aligned to the business strategy\n• Review, question, and support development of Sector/Practice technology strategy\n\nBusiness Development:\n• Uses cross cutting Sector/ Practice insights to identify business development opportunities where existing or future technologies can assist in solving existing or future business or client's problems\n• Inspiring potential and existing clients and employees within Kainos markets and driving change where necessary\n• Engaging with senior clients as a senior technical adviser",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Technology%20Leader.pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.create({
		data: {
			roleName: "Principal Architect",
			jobLocation: "Belfast",
			capabilityId: architectureCapability.capabilityId,
			bandId: principalBand.bandId,
			closingDate: new Date("2026-06-15"),
			description:
				"As a Principal Architect (Principal) in Kainos, you'll be accountable for successful delivery of large-scale high-quality solutions which delight our customers and impact the lives of users worldwide. You will provide assurance and support to multi-skilled agile teams by understanding the outcomes the solution is trying to achieve, the technical implications and complexity surrounding you and your teams' designs and helping teams make the right decisions. You'll work with senior stakeholders to agree architectural principles, strategic direction and functional and non-functional designs.",
			responsibilities:
				"• Proven experience being accountable for different sizes and shapes of technology delivery challenges, e.g. services project, multi-team programme, packaged product\n• Able to simply and clearly communicate technical design in conversation, documentation and presentations\n• Able to prioritise their time across multiple major projects particularly when working to deadlines\n• Has successfully led & delivered software designs for multi-tiered modern software applications\n• Understands whole solution architecture concepts and can communicate and negotiate these with senior stakeholders\n• Can prioritise non-functional concerns for customers and has experience incorporating these into the application design\n• Has an engineering background, allowing effective communication with, assurance of and leadership of development teams\n• Is focused on improvement of process, people and use of technology\n• Has experience with public cloud platforms, such as AWS and Azure, including SaaS and PaaS offerings\n• Has pro-actively developed business across an account with sales and account managers\n• Can build credibility and communicate effectively with C-level stakeholders\n• Understands commercial implications of design decisions and has influenced the commercial success of a product\n• We are passionate about developing people – a demonstrated ability in managing, coaching, and developing junior members of your team and wider community",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Principal%20Architect%20(Principal).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.create({
		data: {
			roleName: "Principal Test Architect",
			jobLocation: "Belfast",
			capabilityId: testingAndQualityAssuranceCapability.capabilityId,
			bandId: principalBand.bandId,
			closingDate: new Date("2026-06-30"),
			description:
				"As a Principal Test Architect (Principal) in Kainos, you'll be responsible for ensuring we deliver high quality solutions which delight our customers and impact the lives of users worldwide. As an experienced test practitioner, you'll lead our clients and the wider market on better testing and quality, whilst working with client stakeholders to agree a strategy for testing that addresses the needs of fast-changing digital services.",
			responsibilities:
				"• Proven experience of leading the creation of a high-quality test strategy and delivery against it within challenging delivery environments (i.e. large scale solutions, fast moving, multi-team, multi-tiered solutions)\n• Experience of instilling a strong level of Test Assurance & Governance within the capability and with clients on key projects\n• Understands solution architecture concepts and how they impact and influence a test strategy and end-to-end test plans\n• Experienced in building and fostering relationships with stakeholders including at executive and C-level senior stakeholders, leading them and driving effective decision making\n• Experience of pre-sales; shaping engagements and leading potential customers\n• Demonstrable experience of leading improvement of techniques and ways of working in the testing space\n• We are passionate about developing people – a demonstrated ability in managing, coaching and developing members of your team and wider community",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Principal%20Test%20Architect%20(P).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.create({
		data: {
			roleName: "Low Code Principal Architect",
			jobLocation: "Belfast",
			capabilityId: lowCodeEngineeringCapability.capabilityId,
			bandId: principalBand.bandId,
			closingDate: new Date("2026-07-15"),
			description:
				"As a Low Code Principal Architect (Principal) in Kainos, you'll be accountable for successful delivery of large-scale high-quality Low Code solutions which delight our customers and impact the lives of users worldwide. You will provide assurance and support to multi-skilled delivery teams by understanding the outcomes the solution is trying to achieve, the technical implications and complexity surrounding you and your teams' designs and helping teams make the right decisions.",
			responsibilities:
				"• Proven experience being accountable for different sizes and shapes of technology delivery challenges, e.g. services project, multi-team programme, multi-product automation solutions\n• Expert in Low Code concepts, products and technical delivery for Power Platform and Microsoft Business Applications\n• Able to simply and clearly communicate technical design in conversation, documentation and presentations\n• Able to prioritise their time across multiple major projects particularly when working to deadlines\n• Has successfully led & delivered Low Code designs and implementations\n• Understands whole solution architecture concepts and can communicate and negotiate these with senior stakeholders\n• Can prioritise non-functional concerns for customers and has experience incorporating these into the intelligent automation solution design\n• Has an engineering background, allowing effective communication with, assurance of and leadership of development teams\n• Is focused on improvement of process, people and use of technology\n• Has experience with public cloud platforms, such as AWS and Azure, including SaaS and PaaS offerings\n• Has pro-actively developed business across an account with sales and account managers",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Low%20Code%20Principal%20Architect%20(P)%20-%20Low%20Code.pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.create({
		data: {
			roleName: "Dynamics 365 / Power Platform Solution Architect",
			jobLocation: "Belfast",
			capabilityId: productSpecialistCapability.capabilityId,
			bandId: managerBand.bandId,
			closingDate: new Date("2026-07-31"),
			description:
				"As a Dynamics 365/Power Platform Solution Architect at Kainos you will lead the architecture on product-based projects, analyse the gap between product offering and customer needs, design technical solutions with the right blend of configuration, customisation, integration and bespoke development needed to deliver a working end to end system. You'll lead multi-skilled agile teams to combine configuration and custom development to deliver high quality solutions.",
			responsibilities:
				"• Has successfully delivered software designs for modern software applications including significant Dynamics 365 CE and Power Platform components (Portals, Flows, Model-Driven/Canvas Apps)\n• Experience of technical ownership for D365/PP areas, including data & security model, integrations, architecture, estimation, product planning and user story/requirement creation\n• Experience in communicating and negotiating whole solution architecture concepts with customer stakeholders\n• Experience prioritising non-functional concerns for customers and has experience incorporating these into the application design\n• Experience in trading off the differences between configuring the product, extending the product with custom plugins, and handing off to bespoke developed application components\n• Experience integrating D365/PP solutions with bespoke developed components deployed in either AWS or Azure\n• Able to simply and clearly communicate technical design in conversation, documentation and presentations including to senior technical and non-technical stakeholders\n• Able to make effective decisions within fast-moving delivery\n• We are passionate about developing people – a demonstrated ability in managing, coaching and developing junior members of your team and wider community",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Dynamics%20365%20PP%20Solution%20Architect%20(M).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.create({
		data: {
			roleName: "Low Code Solution Architect",
			jobLocation: "Belfast",
			capabilityId: lowCodeEngineeringCapability.capabilityId,
			bandId: managerBand.bandId,
			closingDate: new Date("2026-08-15"),
			description:
				"As a Low Code Solution Architect (Manager) in Kainos, you'll be responsible for managing multi-skilled delivery teams to design and deliver high Low Code solutions which delight our customers and impact the lives of users worldwide. You'll work with customer architects to agree functional and non-functional designs, advising customers and managers on the estimated effort, technical implications and complexity surrounding your designs.",
			responsibilities:
				"• Has successfully delivered Low Code designs and architectures\n• Understands whole solution architecture concepts and can communicate and negotiate these with customer architects\n• Can prioritise non-functional concerns for customers and has experience incorporating these into the application design\n• Demonstratable experience of technical ownership for intelligent automation projects, including architecture, estimation, product planning and user story/requirement creation\n• Able to simply and clearly communicate solution design in conversation, documentation and presentations\n• Able to make effective decisions within fast-moving delivery\n• Expertise in Low Code concepts and products, including at least one of: Microsoft Power Platform, Microsoft Dynamics 365\n• Has experience with public cloud platforms, such as AWS and Azure, including SaaS and PaaS offerings\n• A demonstrated ability in managing, coaching and developing members of your team and wider community",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Low%20Code%20Solution%20Architect%20(M)%20.pdf",
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
