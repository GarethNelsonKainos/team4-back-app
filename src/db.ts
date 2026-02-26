import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as prismaPkg from "./generated/client";

// Create a connection pool using the DATABASE_URL from .env
const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});

// Wrap the pool in Prisma's pg adapter
const adapter = new PrismaPg(pool);

// Create Prisma Client with the adapter (required in Prisma v7)
export const prisma = new prismaPkg.PrismaClient({ adapter });

// Graceful shutdown: disconnect Prisma when the process terminates
process.on("beforeExit", async () => {
	await prisma.$disconnect();
});
