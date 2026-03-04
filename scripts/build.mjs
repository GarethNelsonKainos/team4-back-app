#!/usr/bin/env node

/**
 * Build script: Compiles TypeScript to JavaScript
 */

import { execSync } from "child_process";

try {
	console.log("🔨 Building TypeScript...");
	execSync("npx tsc", { stdio: "inherit" });
	console.log("✅ Build completed successfully");
	process.exit(0);
} catch (error) {
	console.error("❌ Build failed:", error.message);
	process.exit(1);
}
