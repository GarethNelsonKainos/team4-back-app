#!/usr/bin/env node

/**
 * Build script: Compiles TypeScript to JavaScript
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function build() {
	try {
		console.log("🔨 Building TypeScript...");
		const { stdout, stderr } = await execAsync("npx tsc");

		if (stdout) console.log(stdout);
		if (stderr) console.log(stderr);

		console.log("✅ Build completed successfully");
		process.exit(0);
	} catch (error) {
		console.error("❌ Build failed:", error);
		process.exit(1);
	}
}

build();
