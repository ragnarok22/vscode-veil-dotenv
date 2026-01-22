import * as assert from 'assert';
import { getMaskingPatterns } from '../utils/patternProvider';

suite('Pattern Provider Test Suite', () => {
	test('Should return generic patterns for any file', () => {
		const patterns = getMaskingPatterns('anyfile.txt');
		assert.ok(patterns.length > 0);
		assert.strictEqual(patterns[0].type, 'generic');
	});

	test('Patterns should match standard KEY=VALUE', () => {
		const patterns = getMaskingPatterns('.env');
		const input = 'API_KEY=123456';
		let matched = false;

		for (const p of patterns) {
			p.regex.lastIndex = 0;
			const match = p.regex.exec(input);
			if (match) {
				matched = true;
				assert.strictEqual(match[2], '123456', 'Group 2 should be the value');
				break;
			}
		}
		assert.ok(matched, 'Should match API_KEY');
	});

	test('Patterns should match quoted values', () => {
		const patterns = getMaskingPatterns('.env');
		const input = 'AUTH_SECRET="super_secret"';
		let matched = false;

		for (const p of patterns) {
			p.regex.lastIndex = 0;
			const match = p.regex.exec(input);
			if (match) {
				matched = true;
				// Regex strips quotes in Group 1, so Group 2 is just the inner value
				assert.strictEqual(match[2], 'super_secret', 'Group 2 should be the value without quotes');
				break;
			}
		}
		assert.ok(matched, 'Should match AUTH_SECRET with quotes');
	});

	test('Patterns should match YAML keys', () => {
		const patterns = getMaskingPatterns('secrets.yaml');
		const input = 'db_password: mypassword';
		let matched = false;

		for (const p of patterns) {
			p.regex.lastIndex = 0;
			const match = p.regex.exec(input);
			if (match) {
				matched = true;
				// Regex consumes trailing space in Group 1 (\s*)
				assert.strictEqual(match[2], 'mypassword', 'Group 2 should be the value without leading space');
				break;
			}
		}
		assert.ok(matched, 'Should match db_password in YAML');
	});

	test('Patterns should match JSON keys', () => {
		const patterns = getMaskingPatterns('credentials.json');
		const input = '"aws_secret": "hidden"';
		let matched = false;

		for (const p of patterns) {
			p.regex.lastIndex = 0;
			const match = p.regex.exec(input);
			if (match) {
				matched = true;
				// Regex consumes quotes in Group 1, so Group 2 is just the inner value
				assert.strictEqual(match[2], 'hidden', 'Group 2 should be the value');
				break;
			}
		}
		assert.ok(matched, 'Should match aws_secret in JSON');
	});

	test('Should match all supported keys', () => {
		const patterns = getMaskingPatterns('.env');
		const keys = [
			'API_KEY',
			'MY_SECRET',
			'ACCESS_TOKEN',
			'DB_PASSWORD',
			'AUTH_SECRET',
			'DATABASE_URL',
			'REDIS_URL',
			'password',
			'secret',
			'token',
		];

		for (const key of keys) {
			const input = `${key}=value`;
			let matched = false;
			for (const p of patterns) {
				p.regex.lastIndex = 0;
				if (p.regex.test(input)) {
					matched = true;
					break;
				}
			}
			assert.ok(matched, `Should match key: ${key}`);
		}
	});
});
