import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { FeatureFlagsService } from "../services/featureFlagsService";
import { FeatureFlagsController } from "../controllers/featureFlagsController";
import { Request, Response } from "express";

describe("FeatureFlagsService", () => {
	let service: FeatureFlagsService;

	beforeEach(() => {
		service = new FeatureFlagsService();
	});

	it("should return feature flags with default values", () => {
		// Clear any environment variables
		delete process.env.FEATURE_FLAG_JOB_DETAIL_VIEW;
		delete process.env.FEATURE_FLAG_JOB_APPLY;

		const service = new FeatureFlagsService();
		const flags = service.getFeatureFlags();

		expect(flags.JOB_DETAIL_VIEW).toBe(true);
		expect(flags.JOB_APPLY).toBe(false);
	});

	it("should read feature flags from environment variables", () => {
		process.env.FEATURE_FLAG_JOB_DETAIL_VIEW = "false";
		process.env.FEATURE_FLAG_JOB_APPLY = "true";

		const service = new FeatureFlagsService();
		const flags = service.getFeatureFlags();

		expect(flags.JOB_DETAIL_VIEW).toBe(false);
		expect(flags.JOB_APPLY).toBe(true);
	});

	it("should parse various boolean string values", () => {
		process.env.FEATURE_FLAG_JOB_DETAIL_VIEW = "yes";
		process.env.FEATURE_FLAG_JOB_APPLY = "1";

		const service = new FeatureFlagsService();
		const flags = service.getFeatureFlags();

		expect(flags.JOB_DETAIL_VIEW).toBe(true);
		expect(flags.JOB_APPLY).toBe(true);
	});

	it("should treat invalid values as false", () => {
		process.env.FEATURE_FLAG_JOB_DETAIL_VIEW = "maybe";
		process.env.FEATURE_FLAG_JOB_APPLY = "nope";

		const service = new FeatureFlagsService();
		const flags = service.getFeatureFlags();

		expect(flags.JOB_DETAIL_VIEW).toBe(false);
		expect(flags.JOB_APPLY).toBe(false);
	});

	afterEach(() => {
		delete process.env.FEATURE_FLAG_JOB_DETAIL_VIEW;
		delete process.env.FEATURE_FLAG_JOB_APPLY;
	});
});

describe("FeatureFlagsController", () => {
	let controller: FeatureFlagsController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;

	beforeEach(() => {
		// Clear environment variables
		delete process.env.FEATURE_FLAG_JOB_DETAIL_VIEW;
		delete process.env.FEATURE_FLAG_JOB_APPLY;

		const service = new FeatureFlagsService();
		controller = new FeatureFlagsController(service);

		mockRequest = {};
		mockResponse = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		};
	});

	it("should return feature flags as JSON", () => {
		controller.getFeatureFlags(
			mockRequest as Request,
			mockResponse as Response,
		);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({
			JOB_DETAIL_VIEW: true,
			JOB_APPLY: false,
		});
	});

	it("should return flags from environment variables", () => {
		process.env.FEATURE_FLAG_JOB_DETAIL_VIEW = "false";
		process.env.FEATURE_FLAG_JOB_APPLY = "true";

		const service = new FeatureFlagsService();
		const controller = new FeatureFlagsController(service);

		controller.getFeatureFlags(
			mockRequest as Request,
			mockResponse as Response,
		);

		expect(mockResponse.json).toHaveBeenCalledWith({
			JOB_DETAIL_VIEW: false,
			JOB_APPLY: true,
		});
	});

	afterEach(() => {
		delete process.env.FEATURE_FLAG_JOB_DETAIL_VIEW;
		delete process.env.FEATURE_FLAG_JOB_APPLY;
	});
});
