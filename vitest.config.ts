import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/test/**/*.test.ts"],
		exclude: ["tests/**", "dist/**", "node_modules/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			exclude: ["src/generated/**"],
		},
	},
});
