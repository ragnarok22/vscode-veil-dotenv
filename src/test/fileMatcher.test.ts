import * as assert from 'assert';
import { shouldMaskFile } from '../utils/fileMatcher';

suite('File Matcher Test Suite', () => {
	test('Should mask .env files', () => {
		assert.strictEqual(shouldMaskFile('.env'), true);
		assert.strictEqual(shouldMaskFile('.env.local'), true);
		assert.strictEqual(shouldMaskFile('.env.production'), true);
		assert.strictEqual(shouldMaskFile('path/to/.env'), true);
	});

	test('Should mask supported config files', () => {
		assert.strictEqual(shouldMaskFile('.npmrc'), true);
		assert.strictEqual(shouldMaskFile('.pypirc'), true);
		assert.strictEqual(shouldMaskFile('credentials.json'), true);
		assert.strictEqual(shouldMaskFile('secrets.yaml'), true);
		assert.strictEqual(shouldMaskFile('secrets.yml'), true);
		assert.strictEqual(shouldMaskFile('.secrets'), true);
	});

	test('Should not mask unsupported files', () => {
		assert.strictEqual(shouldMaskFile('package.json'), false);
		assert.strictEqual(shouldMaskFile('index.ts'), false);
		assert.strictEqual(shouldMaskFile('README.md'), false);
		assert.strictEqual(shouldMaskFile('config.xml'), false);
	});
});
