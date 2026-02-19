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

	// Create User Roles
	const adminRole = await prisma.userRole.upsert({
		where: { roleName: "ADMIN" },
		update: {},
		create: { roleName: "ADMIN" },
	});

	const applicantRole = await prisma.userRole.upsert({
		where: { roleName: "APPLICANT" },
		update: {},
		create: { roleName: "APPLICANT" },
	});

	// Create Bands
	const _apprenticeBand = await prisma.band.findFirst({
		where: { bandName: "Apprentice" },
	}) ?? await prisma.band.create({
		data: { bandName: "Apprentice" },
	});

	const _traineeBand = await prisma.band.findFirst({
		where: { bandName: "Trainee" },
	}) ?? await prisma.band.create({
		data: { bandName: "Trainee" },
	});

	const _associateBand = await prisma.band.findFirst({
		where: { bandName: "Associate" },
	}) ?? await prisma.band.create({
		data: { bandName: "Associate" },
	});

	const _seniorAssociateBand = await prisma.band.findFirst({
		where: { bandName: "Senior Associate" },
	}) ?? await prisma.band.create({
		data: { bandName: "Senior Associate" },
	});

	const consultantBand = await prisma.band.findFirst({
		where: { bandName: "Consultant" },
	}) ?? await prisma.band.create({
		data: { bandName: "Consultant" },
	});

	const managerBand = await prisma.band.findFirst({
		where: { bandName: "Manager" },
	}) ?? await prisma.band.create({
		data: { bandName: "Manager" },
	});

	const principalBand = await prisma.band.findFirst({
		where: { bandName: "Principal" },
	}) ?? await prisma.band.create({
		data: { bandName: "Principal" },
	});

	const leadershipCommunityBand = await prisma.band.findFirst({
		where: { bandName: "Leadership Community" },
	}) ?? await prisma.band.create({
		data: { bandName: "Leadership Community" },
	});

	// Create Capabilities
	const engineeringCapability = await prisma.capability.findFirst({
		where: { capabilityName: "Engineering" },
	}) ?? await prisma.capability.create({
		data: { capabilityName: "Engineering" },
	});

	const strategyAndPlanningCapability = await prisma.capability.findFirst({
		where: { capabilityName: "Strategy and Planning" },
	}) ?? await prisma.capability.create({
		data: { capabilityName: "Strategy and Planning" },
	});

	const architectureCapability = await prisma.capability.findFirst({
		where: { capabilityName: "Architecture" },
	}) ?? await prisma.capability.create({
		data: { capabilityName: "Architecture" },
	});

	const testingAndQualityAssuranceCapability = await prisma.capability.findFirst({
		where: { capabilityName: "Testing and Quality Assurance" },
	}) ?? await prisma.capability.create({
		data: { capabilityName: "Testing and Quality Assurance" },
	});

	const productSpecialistCapability = await prisma.capability.findFirst({
		where: { capabilityName: "Product Specialist" },
	}) ?? await prisma.capability.create({
		data: { capabilityName: "Product Specialist" },
	});

	const lowCodeEngineeringCapability = await prisma.capability.findFirst({
		where: { capabilityName: "Low Code Engineering" },
	}) ?? await prisma.capability.create({
		data: { capabilityName: "Low Code Engineering" },
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
		},
		create: {
			userEmail: adminEmail,
			userPassword: adminHashedPassword,
			userRoleId: adminRole.roleId,
		},
	});

	await prisma.user.upsert({
		where: { userEmail: applicantEmail },
		update: {
			userPassword: applicantHashedPassword,
		},
		create: {
			userEmail: applicantEmail,
			userPassword: applicantHashedPassword,
			userRoleId: applicantRole.roleId,
		},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Intelligent Automation Solution Architect" },
		create: {
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
		update: {
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

	await prisma.jobRole.upsert({
		where: { roleName: "Technology Leader" },
	create: {
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
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Principal Architect" },
	create: {
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
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Principal Test Architect" },
	create: {
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
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Low Code Principal Architect" },
	create: {
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
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Dynamics 365 / Power Platform Solution Architect" },
	create: {
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
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Low Code Solution Architect" },
	create: {
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
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Innovation Lead" },
	create: {
			roleName: "Innovation Lead",
			jobLocation: "Belfast",
			capabilityId: engineeringCapability.capabilityId,
			bandId: consultantBand.bandId,
			closingDate: new Date("2026-08-31"),
			description:
				"As an Innovation Lead (Consultant) in Kainos, you'll be responsible for leading efforts in providing advice and identifying new ways to use technology to solve customer problems. This is a dynamic and hands-on role which will involve leading the team, implementing and shaping Kainos' innovation strategy and effectively communicating the exciting work we undertake both internally and within the wider technology community.",
			responsibilities:
				"MAIN PURPOSE OF THE ROLE & RESPONSIBILITIES IN THE BUSINESS:\nAs an Innovation Lead (Consultant) in Kainos, you'll be responsible for leading efforts in providing advice and identifying new ways to use technology to solve customer problems. This is a dynamic and hands-on role which will involve leading the team, implementing and shaping Kainos' innovation strategy and effectively communicating the exciting work we undertake both internally and within the wider technology community.\n\nYour key responsibilities will include:\n• Collaborate with the Innovation Lead and Director of Innovation to shape the company's strategy for innovation and connect strategy with tactical implementation.\n• Assume a leadership position in driving the approaches and tooling required for dynamic R&D projects.\n• Active engagement with the wider technology community, including conferences, meetups and events to continue to demonstrate thought leadership in public forums.\n• Identifying and implementing process improvements to improve the effectiveness of the innovation team.\n• Taking responsibility for the Innovation Team's internal and external communications strategy to share knowledge and demonstrate leadership both internally and in the public domain.\n• Coordinating with other parts of the business, including presenting to internal and external customers.\n• You'll manage, coach and develop a number of staff, with a focus on managing employee performance and assisting in their career development.\n\nMINIMUM (ESSENTIAL) REQUIREMENTS:\n• Experience of translating business problems into technical solutions, decomposing complex problems into smaller parts, and communicating this analysis to the team.\n• Experience of working with internal or external stakeholders to deliver multiple proofs of concept or prototypes which demonstrate feasibility or business value.\n• Experience of presenting results to customer stakeholders.\n• Experience leading by example in building an internal team culture of sharing, collaboration and fostering the importance of non-technical qualities.\n• Good communication skills, including experience of communicating technical matters to non-technical audiences and modifying your communication appropriately.\n• We are passionate about developing people – a demonstrated ability in managing, coaching and developing people in your team and the wider community.\n\nDESIRABLE:\n• Experience in software design and development across all layers of an application\n• Active participation in knowledge sharing activities, both within the team and at a wider capability level and externally where appropriate\n• Knowledge of modern software development practices and public cloud platforms, such as AWS and Azure and SaaS and PaaS offerings",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Innovation%20Lead%20(Consultant).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Lead Software Engineer" },
	create: {
			roleName: "Lead Software Engineer",
			jobLocation: "Belfast",
			capabilityId: engineeringCapability.capabilityId,
			bandId: consultantBand.bandId,
			closingDate: new Date("2026-09-15"),
			description:
				"As a Lead Software Engineer (Consultant) in Kainos, you'll be responsible for leading teams and developing high quality solutions which delight our customers and impact the lives of users worldwide. It's a fast-paced environment so it is important for you to make sound, reasoned decisions. You'll do this whilst learning about new technologies and approaches, with talented colleagues that will help you to learn, develop and grow.",
			responsibilities:
				"MAIN PURPOSE OF THE ROLE & RESPONSIBILITIES IN THE BUSINESS:\nAs a Lead Software Engineer (Consultant) in Kainos, you'll be responsible for leading teams and developing high quality solutions which delight our customers and impact the lives of users worldwide. It's a fast-paced environment so it is important for you to make sound, reasoned decisions. You'll do this whilst learning about new technologies and approaches, with talented colleagues that will help you to learn, develop and grow.\n\nYou'll manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development. You'll also provide direction and leadership for your team as you solve challenging problems together. As the technical leader in the team, you will also interact with customers, share knowledge and mentor those around you.\n\nMINIMUM (ESSENTIAL) REQUIREMENTS:\n• Expertise in designing, building, testing and maintaining modern software applications\n• Technical leadership of teams building and testing modern, scalable, secure, performant applications in line with software development principles, practices and patterns e.g. XP, TDD\n• Experience of technical ownership for a product/software project, including architecture, estimation, product planning and user story/requirement creation\n• Expertise in software design and development across all layers of an application\n• We are passionate about developing people – a demonstrated ability in managing, coaching and developing junior members of your team and wider community.\n• Experience with the latest Continuous Integration and Continuous Delivery techniques\n\nDESIRABLE:\n• Good communication skills, with the ability to communicate issues to technical and non-technical people.\n• Active participation in knowledge sharing activities, both within the team and at a wider capability level and externally where appropriate.\n• Experience of debugging and troubleshooting live applications\n• Experience of multiple programming languages and data storage technologies\n• Knowledge of public cloud platforms, such as AWS and Azure, including SaaS and PaaS offerings",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Lead%20Software%20Engineer%20(Consultant).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 2,
		},
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Lead Managed Services Engineer" },
	create: {
			roleName: "Lead Managed Services Engineer",
			jobLocation: "Belfast",
			capabilityId: engineeringCapability.capabilityId,
			bandId: consultantBand.bandId,
			closingDate: new Date("2026-09-30"),
			description:
				"As a Lead Managed Services Engineer (Consultant) in Kainos, you'll be responsible for leading teams, contributing to pre-sales responses, providing high quality support and continuous improvement solutions for existing Live services, which delight our customers and impact the lives of users worldwide. It's a fast-paced environment so it is important for you to make sound, reasoned decisions. You'll do this whilst working with a wide range of technologies and approaches, with talented colleagues that will help you to learn, develop and grow.",
			responsibilities:
				"As a Lead Managed Services Engineer (Consultant) in Kainos, you'll be responsible for leading teams, contributing to pre-sales responses, providing high quality support and continuous improvement solutions for existing Live services, which delight our customers and impact the lives of users worldwide. It's a fast-paced environment so it is important for you to make sound, reasoned decisions. You'll do this whilst working with a wide range of technologies and approaches, with talented colleagues that will help you to learn, develop and grow. You'll manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development. You will help shape the Managed Services technical landscape and ensure a consistent level of quality across all Managed Services projects.\n\nMINIMUM (ESSENTIAL) REQUIREMENTS:\n• Expertise in understanding client needs, translating these to deliverable plans and identifying additional opportunities to deliver value to clients.\n• Strong commercial awareness, demonstrating the ability to deliver on customer needs in a financially viable way for Kainos while managing customer relationships.\n• Experience of technical ownership for a project or large change request, including architecture, estimation and user story/requirement creation.\n• Understands non-functional concerns for customers including SLAs and has experience incorporating these into the application design.\n• Able to simply and clearly communicate technical matters in conversation, documentation and presentations including with senior customer stakeholders.\n• Experience of debugging and troubleshooting live applications and in mitigating / dealing with escalations in key line of business applications.\n• Leads by example in software development and quality practices in a Managed Services environment\n\nDESIRABLE:\n• Strong skills in the latest technologies as well as the ability to pick up, support and introduce change to projects based on older technologies.\n• Has a strong understanding and track record of delivering within the ITIL processes implemented by Managed Services such as change, release and incident management.\n• Experience in transitioning services from development/project phase into a managed service solution.",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Lead%20Managed%20Services%20Engineer%20(C).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Technical Architect" },
	create: {
			roleName: "Technical Architect",
			jobLocation: "Belfast",
			capabilityId: architectureCapability.capabilityId,
			bandId: consultantBand.bandId,
			closingDate: new Date("2026-10-15"),
			description:
				"As a Technical Architect (Consultant) in Kainos, you'll be responsible for leading teams and developing high quality solutions which delight our customers and impact the lives of users worldwide. As a technical leader on a project, you'll work with customer architects to agree technical designs, advising on estimated effort and technical implications of user stories and user journeys. You'll manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development.",
			responsibilities:
				"MAIN PURPOSE OF THE ROLE & RESPONSIBILITIES IN THE BUSINESS:\nAs a Technical Architect (Consultant) in Kainos, you'll be responsible for leading teams and developing high quality solutions which delight our customers and impact the lives of users worldwide. As a technical leader on a project, you'll work with customer architects to agree technical designs, advising on estimated effort and technical implications of user stories and user journeys. You'll manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development. It's a fast-paced environment so it is important for you to make sound, reasoned decisions. You'll do this whilst learning about new technologies and approaches, with room to learn, develop and grow.\n\nMINIMUM (ESSENTIAL) REQUIREMENTS:\n• Experience delivering software designs for multi-tiered modern software applications.\n• Experience of technical ownership for a product/software project, including architecture, estimation, product planning and user story/requirement creation.\n• Understands non-functional concerns for customers and has experience incorporating these into the application design.\n• Has experience with public cloud platforms, such as AWS and Azure, including SaaS and PaaS offerings.\n• Able to simply and clearly communicate technical design in conversation, documentation and presentations.\n• Able to make effective decisions within fast-moving delivery.\n• We are passionate about developing people – a demonstrated ability in managing, coaching and developing junior members of your team and wider community.\n\nDESIRABLE:\n• Good communication skills, with the ability to communicate issues to technical and non-technical people.\n• Experience of multiple programming languages and data storage technologies.\n• Experience in managing others, setting objectives, giving feedback and leading performance reviews.\n• Active participation in knowledge sharing activities, both within the team and at a wider capability level and externally where appropriate.\n• Has participated in technology communities.",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Technical%20Architect%20(Consultant).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 2,
		},
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Lead Test Engineer" },
	create: {
			roleName: "Lead Test Engineer",
			jobLocation: "Belfast",
			capabilityId: testingAndQualityAssuranceCapability.capabilityId,
			bandId: consultantBand.bandId,
			closingDate: new Date("2026-10-31"),
			description:
				"As a Lead Test Engineer (Consultant) in Kainos, you'll be a technical leader and innovator in software testing, providing strong test leadership and direction within a multi-skilled agile team. Taking responsibility for the strategy, design and development of automated, manual, and non-functional tests, you'll help the team to deliver working application software that meets user needs and is of sufficient quality for promotion to users.",
			responsibilities:
				"MAIN PURPOSE OF THE ROLE & RESPONSIBILITIES IN THE BUSINESS:\nAs a Lead Test Engineer (Consultant) in Kainos, you'll be a technical leader and innovator in software testing, providing strong test leadership and direction within a multi-skilled agile team. Taking responsibility for the strategy, design and development of automated, manual, and non-functional tests, you'll help the team to deliver working application software that meets user needs and is of sufficient quality for promotion to users. It's a fast-paced environment so it is important for you to make sound, reasoned decisions. You'll do this whilst learning about new technologies and approaches, with talented colleagues who will help you learn, develop and grow.\n\nYou'll manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development. You'll also provide direction and leadership for your team as you solve challenging problems together. As a technical leader in the team, you will also interact with customers, share knowledge and mentor those around you.\n\nMINIMUM (ESSENTIAL) REQUIREMENTS:\n• Experience of ensuring testing layers have adequate coverage in line with software testing principles and practices.\n• Expertise in designing, creating and maintaining tests scripts and test approaches, including manual and automated testing across all layers of an application including non-functional test coverage.\n• Experience using Test Automation open-source technologies (e.g. one of the following Selenium, JUnit,TestNG, Cucumber, Cypress), and configuring tools for testing such as Jenkins and/or TeamCity, within a continuous integration environment.\n• Practical knowledge of at least one object-oriented programming language (e.g. Java.)\n• A high level of technical awareness and a sound understanding of software architectures.\n• We are passionate about developing people – experience in managing others, setting objectives, giving feedback and leading performance reviews.\n• Passionate technologist, keen to expand knowledge of latest QA tools, tech and methodologies.\n\nDESIRABLE:\n• Operating within a Test Lead role (or similar) on a medium-large sized Agile project\n• Experience in managing others, setting objectives, giving feedback and leading performance reviews.\n• Demonstrable experience of effective stakeholder management and commercial awareness.",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Lead%20Test%20Engineer%20(Consultant).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Lead NFT Engineer" },
	create: {
			roleName: "Lead NFT Engineer",
			jobLocation: "Belfast",
			capabilityId: testingAndQualityAssuranceCapability.capabilityId,
			bandId: consultantBand.bandId,
			closingDate: new Date("2026-11-15"),
			description:
				"As a Lead NFT Engineer (Consultant) in Kainos, you'll be a technical leader and innovator in Non-Functional Testing, providing strong test leadership and direction within a multi-skilled agile team. Taking responsibility for the strategy, design and development of non-functional requirements & tests, you'll help the team to deliver working application software that is scalable and performant for the users.",
			responsibilities:
				"MAIN PURPOSE OF THE ROLE & RESPONSIBILITIES IN THE BUSINESS:\nAs a Lead NFT Engineer (Consultant) in Kainos, you'll be a technical leader and innovator in Non-Functional Testing, providing strong test leadership and direction within a multi-skilled agile team. Taking responsibility for the strategy, design and development of non-functional requirements & tests, you'll help the team to deliver working application software that is scalable and performant for the users. It's a fast-paced environment so it is important for you to make sound, reasoned decisions. You'll do this whilst learning about new technologies and approaches, with talented colleagues who will help you learn, develop and grow.\n\nYou'll manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development. You'll also provide direction and leadership for your team as you solve challenging problems together. As a technical leader in the team, you will also interact with customers, share knowledge and mentor those around you.\n\nMINIMUM (ESSENTIAL) REQUIREMENTS:\n• Proven test leadership in testing modern, scalable, secure, performant applications in line with software testing principles and practices.\n• Expertise in performance engineering and analysis, designing performance tests around load, stress and soak testing.\n• Experience using JMeter or similar to create and maintain NFT scripts.\n• Experience devising efficient Non-Functional Testing strategies for large scale projects.\n• Strong use of CI tools such as Jenkins and GitHub.\n• Knowledge of Azure and strong working knowledge of monitoring tools such as Dynatrace, Kibana and Zabbix.\n• Experience in analysing server logs for fault detection.\n• Expertise in effective defect management and triage strategies.\n• A high level of technical awareness and a sound understanding of software architectures.\n• Working knowledge of API testing.\n• Ability to understand NFRs and liaise closely with Architects and Product Owners to ensure these are well defined, understood and testable.\n• We all work in teams here in Kainos – a proven ability of strong team skills, including working in a multi-disciplinary team is crucial\n• We are passionate about developing people – a demonstrated ability in managing, mentoring and coaching members of your team and wider community is important.\n\nDESIRABLE:\n• Operating within a NFT Lead role (or similar) on a medium-large sized Agile project\n• Experience in managing others, setting objectives, giving feedback and leading performance reviews.\n• Setting-up and maintaining NFT infrastructure, advising on specific test approaches.\n• Good verbal and written communication skills, with the ability to communicate to other technical, and sometimes to non-technical people.\n• Active participation in knowledge sharing activities, both within the team and at a wider capability level and externally where appropriate.",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Lead%20NFT%20Engineer%20(Consultant).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Test Manager" },
	create: {
			roleName: "Test Manager",
			jobLocation: "Belfast",
			capabilityId: testingAndQualityAssuranceCapability.capabilityId,
			bandId: consultantBand.bandId,
			closingDate: new Date("2026-11-30"),
			description:
				"As a Test Manager in Kainos, you'll be responsible for ensuring we deliver high quality solutions which delight our customers and impact the lives of users worldwide. As an experienced test practitioner, you'll lead our clients and the wider market on better testing and quality, whilst working with client stakeholders to agree a strategy for testing that addresses the needs of fast-changing digital services.",
			responsibilities:
				"MAIN PURPOSE OF THE ROLE & RESPONSIBILITIES IN THE BUSINESS:\nAs a Test Manager in Kainos, you'll be responsible for ensuring we deliver high quality solutions which delight our customers and impact the lives of users worldwide. As an experienced test practitioner, you'll lead our clients and the wider market on better testing and quality, whilst working with client stakeholders to agree a strategy for testing that addresses the needs of fast-changing digital services.\n\nYou'll do this whilst advising Kainos about new tools and approaches, working with your peers to develop policy and standards, share knowledge and mentor those around you, with room to learn, develop and grow. You'll manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development. As a Testing & QA leader in the team, you will also interact with customers, share knowledge and mentor those around you. You'll also provide direction and leadership for your team as you solve challenging problems together.\n\nMINIMUM (ESSENTIAL) REQUIREMENTS:\n• Experience as a multifaceted agile test practitioner that understands the roles and responsibilities of testers in an iterative project lifecycle.\n• Has successfully designed and overseen the implementation of a test strategy for multi-tiered modern software applications.\n• Understands whole solution architecture concepts and how they impact and influence a test strategy and end-to-end test plans.\n• ISTQB Foundation in Software Testing.\n• Can prioritise non-functional concerns for customers and has experience incorporating these into the end-to-end testing lifecycle.\n• Can design and make decisions around testing and quality within a fast-moving agile delivery environment.\n• Experience mentoring and coaching members of your team and wider community.\n• Active participation in knowledge sharing activities, both within the team and at a wider capability level and externally where appropriate.\n• We all work in teams here in Kainos – a proven ability of strong team skills, including working in a multi-disciplinary team is crucial\n• We are passionate about developing people – a demonstrated ability in managing, mentoring and coaching members of your team and wider community is important\n• Good verbal and written communication skills, with the ability to communicate test design and strategy in conversation, documentation and presentations to other technical, and sometimes to non-technical people.\n\nDESIRABLE:\n• Experience in managing others, setting objectives, giving feedback and leading performance reviews.\n• Actively shares their thoughts and views on test tools, frameworks and approaches.\n• Has participated in software testing communities.",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Test%20Manager%20(Consultant).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Lead Product Specialist" },
	create: {
			roleName: "Lead Product Specialist",
			jobLocation: "Belfast",
			capabilityId: productSpecialistCapability.capabilityId,
			bandId: consultantBand.bandId,
			closingDate: new Date("2026-12-15"),
			description:
				"As a Lead Product Specialist at Kainos you will be responsible for leading teams and delivering high quality solutions which delight our customers and impact the lives of users worldwide. It's a fast-paced environment so it is important for you to make sound, reasoned decisions. You'll do this whilst learning about new technologies and approaches, with talented colleagues that will help you to learn, develop and grow as you, in turn, mentor those around you.",
			responsibilities:
				"MAIN PURPOSE OF THE ROLE & RESPONSIBILITIES IN THE BUSINESS:\nAs a Lead Product Specialist at Kainos you will be responsible for leading teams and delivering high quality solutions which delight our customers and impact the lives of users worldwide. It's a fast-paced environment so it is important for you to make sound, reasoned decisions. You'll do this whilst learning about new technologies and approaches, with talented colleagues that will help you to learn, develop and grow as you, in turn, mentor those around you.\n\nYou'll be responsible for capturing and mapping customer needs to product capabilities, supporting clients throughout their implementation lifecycle and business processes changes as well as providing information to relevant engineering teams on improvements of fixes required in the products. You'll manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development. You'll also provide direction and leadership for your team as you solve challenging problems together. As the technical leader in the team, you will also interact with customers, share knowledge and mentor those around you.\n\nMINIMUM (ESSENTIAL) REQUIREMENTS:\n• In depth knowledge of the product's capabilities and limitations having delivered successful implementations to clients\n• Expertise in understanding client's needs, translating these to deliverable plans and identifying additional opportunities to deliver value to clients\n• Liasing with client, product development and product support representatives to define scope and impact of key product decisions or changes\n• Providing feasible estimates and plans for product delivery\n• Actively maintains a knowledge of competitor landscape including alternative products and their relative strengths and weaknesses\n• Able to quickly get up to speed with new products / features and communicate these to appropriate internal and external audiences\n• Able to simply, clearly and effectively communicate technical design and solution concepts in conversation, documentation and presentations.\n• Strong commercial awareness, demonstrating the ability to deliver on customer needs in a financially viable way for Kainos\n• Has extensive proven track record of successful product feature design, development and escalation management.\n• Experience of technical ownership for a product implementation project, including architecture, estimation, product planning and user story/requirement creation.\n• Understands non-functional concerns for customers and has experience incorporating these into the application design.\n• Able to make effective decisions within fast-moving delivery.\n• We are passionate about developing people – a demonstrated ability in managing, coaching and developing junior members of your team and wider community.\n\nDESIRABLE:\n• Active participation in knowledge sharing activities, both within the team and at a wider capability level and externally where appropriate.\n• Acting as a technical escalation point for key decisions and issues across multiple customer engagements\n• Lead or delivered continuous improvements to Product / Product configuration, applying previous knowledge, experience and industry best practice\n• Continuously looks for ways to improve working practices and technical solutions/techniques and proactively communicates these.",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Lead%20Product%20Specialist%20(C).pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Low Code Technical Architect" },
	create: {
			roleName: "Low Code Technical Architect",
			jobLocation: "Belfast",
			capabilityId: lowCodeEngineeringCapability.capabilityId,
			bandId: consultantBand.bandId,
			closingDate: new Date("2026-12-31"),
			description:
				"As a Low Code Technical Architect (Consultant) in Kainos, you'll be responsible for leading teams and developing high quality Low Code solutions which delight our customers and impact the lives of users worldwide. You'll also provide direction for your team as you solve problems together. With your technical expertise on a project, you'll work with customer architects to agree technical designs, advising on estimated effort and technical implications of user stories and user journeys.",
			responsibilities:
				"MAIN PURPOSE OF ROLE & LEVEL IN THE BUSINESS:\nAs a Low Code Technical Architect (Consultant) in Kainos, you'll be responsible for leading teams and developing high quality Low Code solutions which delight our customers and impact the lives of users worldwide. You'll also provide direction for your team as you solve problems together.\n\nWith your technical expertise on a project, you'll work with customer architects to agree technical designs, advising on estimated effort and technical implications of user stories and user journeys. You'll manage, coach and develop a small number of people, with a focus on managing employee performance and assisting in their career development. It's a fast-paced environment so it is important for you to make sound, reasoned decisions. You'll do this whilst learning about new technologies and approaches, with room to learn, develop and grow.\n\nMINIMUM (ESSENTIAL) REQUIREMENTS:\n• Experience in delivering Low Code designs and architectures.\n• Experience of technical ownership for a Low Code project, including architecture, estimation, product planning and user story/requirement creation\n• Experience of balancing technical decisions with user needs and commercial constraints\n• Understands non-functional concerns for customers and has experience incorporating these into the application design.\n• Able to simply and clearly communicate technical design in conversation, documentation and presentations.\n• Able to make effective decisions within fast-moving delivery.\n• Expertise in Low Code concepts and products, including at least one of:\n  o Microsoft Power Platform\n  o Microsoft Dynamics 365\n• Knowledge of public cloud platforms, such as AWS and Azure, including SaaS and PaaS offerings",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Low%20Code%20Technical%20Architect%20(C)%20-%20Low%20Code.pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
		update: {},
	});

	await prisma.jobRole.upsert({
		where: { roleName: "Lead Low Code Engineer" },
	create: {
			roleName: "Lead Low Code Engineer",
			jobLocation: "Belfast",
			capabilityId: lowCodeEngineeringCapability.capabilityId,
			bandId: consultantBand.bandId,
			closingDate: new Date("2027-01-15"),
			description:
				"As a Lead Low Code Engineer (Consultant) in Kainos, you'll be responsible for managing teams and developing high quality Low Code solutions which delight our customers and impact the lives of users worldwide. It's a fast-paced environment so it's important for you to make sound, reasoned decisions. You'll do this whilst learning about new technologies and approaches, with talented colleagues that will help you to learn, develop and grow.",
			responsibilities:
				"MAIN PURPOSE OF ROLE & LEVEL IN THE BUSINESS:\nAs a Lead Low Code Engineer (Consultant) in Kainos, you'll be responsible for managing teams and developing high quality Low Code solutions which delight our customers and impact the lives of users worldwide. It's a fast-paced environment so it's important for you to make sound, reasoned decisions.\n\nYou'll do this whilst learning about new technologies and approaches, with talented colleagues that will help you to learn, develop and grow. You'll manage, coach and develop a small number of people, with a focus on managing employee performance and assisting in their career development. You'll also provide direction for your team as you solve problems together. With your technical knowledge, you will also interact with customers, share knowledge and mentor those around you.\n\nMINIMUM (ESSENTIAL) REQUIREMENTS:\n• Expertise in designing, building, testing and maintaining modern software applications including Low Code solutions\n• Technical management of teams building and testing modern, scalable, secure, performant applications in line with software development rules, practices and patterns e.g. XP, TDD\n• Experience of technical ownership for a Low Code project, including architecture, estimation, product planning and user story/requirement creation\n• Experience of balancing technical decisions with user needs and commercial constraints\n• Expertise in Low Code software design and development across all layers of a solution\n• Experience with the latest Continuous Integration and Continuous Delivery techniques\n• Expertise in Low Code concepts and products, including at least one of:\n  o Microsoft Power Platform\n  o Microsoft Dynamics 365\n• Knowledge of public cloud platforms, such as AWS and Azure, including SaaS and PaaS offerings",
			sharepointUrl:
				"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20Profile%20-%20Lead%20Low%20Code%20Engineer%20(C)%20-%20Low%20Code.pdf",
			statusId: openStatus.statusId,
			numberOfOpenPositions: 1,
		},
		update: {},
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
