import * as path from 'path';

export function shouldMaskFile(filename: string): boolean {
	const basename = path.basename(filename);
	const lowerBasename = basename.toLowerCase();

	// Exact matches
	const exactMatches = new Set(['.npmrc', '.pypirc', 'credentials.json', 'secrets.yaml', 'secrets.yml', '.secrets']);

	if (exactMatches.has(lowerBasename)) {
		return true;
	}

	// Pattern matches
	if (lowerBasename.startsWith('.env')) {
		return true;
	}

	return false;
}
