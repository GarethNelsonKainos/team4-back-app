import { Request, Response } from "express";
import { FeatureFlagsService, type FeatureFlags } from "../services/featureFlagsService";

export class FeatureFlagsController {
	private featureFlagsService: FeatureFlagsService;

	constructor(featureFlagsService: FeatureFlagsService) {
		this.featureFlagsService = featureFlagsService;
		this.getFeatureFlags = this.getFeatureFlags.bind(this);
	}

	/**
	 * GET /api/feature-flags
	 * Returns all feature flags as a JSON object
	 * Public endpoint - no authentication required
	 */
	getFeatureFlags(req: Request, res: Response): void {
		const flags: FeatureFlags = this.featureFlagsService.getFeatureFlags();
		res.status(200).json(flags);
	}
}
