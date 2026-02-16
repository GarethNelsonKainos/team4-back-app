export interface FeatureFlags {
	[key: string]: boolean;
}

export class FeatureFlagsService {
	/**
	 * Get all feature flags from environment variables
	 * Environment variables should be prefixed with FEATURE_FLAG_
	 * Example: FEATURE_FLAG_JOB_DETAIL_VIEW=true
	 */
	getFeatureFlags(): FeatureFlags {
		const flags: FeatureFlags = {
			JOB_DETAIL_VIEW: this.parseEnvBoolean(
				process.env.FEATURE_FLAG_JOB_DETAIL_VIEW,
				false,
			),
			JOB_APPLY: this.parseEnvBoolean(
				process.env.FEATURE_FLAG_JOB_APPLY,
				false,
			),
		};

		return flags;
	}

	/**
	 * Parse environment variable as boolean
	 * Supports: "true", "1", "yes" as true values
	 * Everything else is false
	 */
	private parseEnvBoolean(
		value: string | undefined,
		defaultValue: boolean,
	): boolean {
		if (value === undefined) {
			return defaultValue;
		}

		return ["true", "1", "yes"].includes(value.toLowerCase());
	}
}
