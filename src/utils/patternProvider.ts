export interface MaskingPattern {
	regex: RegExp;
	type: 'generic';
}

export function getMaskingPatterns(filename: string): MaskingPattern[] {
	// Generic patterns for any file (ENV, YAML, JSON supported via flexible regex)
	// Translating Lua patterns: (%w+_KEY%s*[=:]%s*[\"']?)([^\"'\n]+) -> JS: ((?:["']?)\w+_KEY(?:["']?)\s*[=:]\s*["']?)([^"'\n]+)

	const patterns = [
		// %w+_KEY
		/((?:["']?)\w+_KEY(?:["']?)\s*[=:]\s*["']?)([^"'\n]+)/g,
		// %w+_SECRET
		/((?:["']?)\w+_SECRET(?:["']?)\s*[=:]\s*["']?)([^"'\n]+)/g,
		// %w+_TOKEN
		/((?:["']?)\w+_TOKEN(?:["']?)\s*[=:]\s*["']?)([^"'\n]+)/g,
		// %w+_PASSWORD
		/((?:["']?)\w+_PASSWORD(?:["']?)\s*[=:]\s*["']?)([^"'\n]+)/g,
		// API_KEY
		/((?:["']?)API_KEY(?:["']?)\s*[=:]\s*["']?)([^"'\n]+)/g,
		// AUTH_SECRET
		/((?:["']?)AUTH_SECRET(?:["']?)\s*[=:]\s*["']?)([^"'\n]+)/g,
		// DATABASE_URL
		/((?:["']?)DATABASE_URL(?:["']?)\s*[=:]\s*["']?)([^"'\n]+)/g,
		// REDIS_URL
		/((?:["']?)REDIS_URL(?:["']?)\s*[=:]\s*["']?)([^"'\n]+)/g,
		// password (lower case specific)
		/((?:["']?)password(?:["']?)\s*[=:]\s*["']?)([^"'\n]+)/g,
		// secret (lower case specific)
		/((?:["']?)secret(?:["']?)\s*[=:]\s*["']?)([^"'\n]+)/g,
		// token (lower case specific)
		/((?:["']?)token(?:["']?)\s*[=:]\s*["']?)([^"'\n]+)/g,
	];

	return patterns.map((regex) => ({
		regex,
		type: 'generic',
	}));
}
