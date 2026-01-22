import * as vscode from 'vscode';
import * as path from 'path';
import { shouldMaskFile } from './utils/fileMatcher';
import { getMaskingPatterns } from './utils/patternProvider';

let isVeilEnabled = true;

// Decoration type: Hides the text and adds asterisks overlay
const maskDecorationType = vscode.window.createTextEditorDecorationType({
	backgroundColor: new vscode.ThemeColor('editor.background'), // Match background to cover text
	color: 'transparent', // Make original text transparent
	textDecoration: 'none; display: inline-block;', // Ensure it takes up space but isn't visible
	before: {
		contentText: '*******',
		color: new vscode.ThemeColor('editor.foreground'), // Visible asterisks
		fontWeight: 'bold',
	},
});

export function activate(context: vscode.ExtensionContext) {
	console.log('Veil is active');

	// Command to toggle masking globally
	const toggleCommand = vscode.commands.registerCommand('veil.toggle', () => {
		isVeilEnabled = !isVeilEnabled;
		vscode.window.showInformationMessage(`Veil is now ${isVeilEnabled ? 'enabled' : 'disabled'}`);
		triggerUpdateDecorations();
	});

	context.subscriptions.push(toggleCommand);

	// Event listeners
	vscode.window.onDidChangeActiveTextEditor(
		(editor) => {
			if (editor) {
				updateDecorations(editor);
			}
		},
		null,
		context.subscriptions,
	);

	vscode.workspace.onDidChangeTextDocument(
		(event) => {
			if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
				updateDecorations(vscode.window.activeTextEditor);
			}
		},
		null,
		context.subscriptions,
	);

	// Initial update
	if (vscode.window.activeTextEditor) {
		updateDecorations(vscode.window.activeTextEditor);
	}
	// Also check all visible editors in case of split views
	vscode.window.visibleTextEditors.forEach((editor) => {
		updateDecorations(editor);
	});
}

function triggerUpdateDecorations() {
	if (vscode.window.activeTextEditor) {
		updateDecorations(vscode.window.activeTextEditor);
	}
}

function updateDecorations(editor: vscode.TextEditor) {
	if (!editor) {
		return;
	}

	const filename = editor.document.fileName;

	if (!shouldMaskFile(filename)) {
		return;
	}

	const text = editor.document.getText();
	const rangesToMask: vscode.Range[] = [];

	// Check for file-level toggle comment: # veil: off
	const lines = text.split(/\r?\n/);
	for (const line of lines) {
		if (line.trim().match(/^#\s*veil:\s*off$/i)) {
			// File specific disable
			editor.setDecorations(maskDecorationType, []);
			return;
		}
	}

	if (!isVeilEnabled) {
		editor.setDecorations(maskDecorationType, []);
		return;
	}

	const patterns = getMaskingPatterns(filename);

	for (const pattern of patterns) {
		let match;
		// Reset regex state just in case
		pattern.regex.lastIndex = 0;
		while ((match = pattern.regex.exec(text))) {
			// Generic logic for all patterns from user list:
			// Group 1: Prefix (Key + Separator + Quote)
			// Group 2: Value to mask

			const value = match[2];

			// Skip empty values
			if (!value || value.trim() === '') {
				continue;
			}

			// Value is group 2.
			// Start offset = match index + length of group 1
			const prefixLength = match[1].length;
			const startOffset = match.index + prefixLength;
			const endOffset = startOffset + value.length;

			const startPos = editor.document.positionAt(startOffset);
			const endPos = editor.document.positionAt(endOffset);

			const range = new vscode.Range(startPos, endPos);
			rangesToMask.push(range);
		}
	}

	editor.setDecorations(maskDecorationType, rangesToMask);
}

export function deactivate() {}
