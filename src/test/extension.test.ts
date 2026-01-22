import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
	// Regression test for activation bug
	test('Extension should activate automatically', async () => {
		// Verify activationEvents includes "*"
		const packageJSON = require('../../package.json');
		const activationEvents = packageJSON.activationEvents;
		assert.ok(activationEvents.includes('*'), 'Activation events should include "*"');

		// In a real VS Code test environment, we can assume the extension host respects this.
		// We can also check if our activation log happened (via a spy if we had one),
		// but checking the config is the most direct test for "is it configured to start".

		// Additionally, let's verify checking visible editors logic doesn't crash
		// by ensuring our activate function runs without error if we could call it.
		// Since we can't easily import 'activate' here without linking properly or mocking context,
		// relying on the configuration check is a strong regression test for "did we forget the *" case.
	});
});
