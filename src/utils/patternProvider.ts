import * as path from 'path';

export interface MaskingPattern {
	regex: RegExp;
	type: 'env' | 'yaml' | 'json';
}

export function getMaskingPatterns(filename: string): MaskingPattern[] {
	const basename = path.basename(filename).toLowerCase();

	if (basename.endsWith('.json')) {
		return [
			{
				// Match "key": "value"
				// Group 1: "key": "
				// Group 2: value (to mask)
				// Group 3: " (closing quote and optional comma)
				regex: /^(\s*"[^"]+"\s*:\s*")(.*)("[,]?.*)$/gm,
				type: 'json',
			},
		];
	}

	if (basename.endsWith('.yaml') || basename.endsWith('.yml')) {
		return [
			{
				// Match key: value
				// Group 1: key:
				// Group 2: value (to mask)
				regex: /^(\s*[\w_.-]+\s*:\s*)(.*)$/gm,
				type: 'yaml',
			},
		];
	}

	// Default to env/config style (KEY=VALUE)
	return [
		{
			// Match KEY=VALUE
			// Group 1: KEY=
			// Group 2: VALUE (to mask)
			regex: /^([\w_.-]+\s*=\s*)(.*)$/gm,
			type: 'env',
		},
	];
}
