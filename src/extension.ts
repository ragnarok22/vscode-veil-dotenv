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
			// Specific handling based on type to ensure we capture the correct value group
			// Current implementation assumes:
			// Group 1: Prefix (key + separators)
			// Group 2: Value to mask
			// Group 3: Suffix (optional, e.g. closing quote)

			const value = match[2];

			// Skip empty values
			if (!value || value.trim() === '') {
				continue;
			}

			// Calculate range for the VALUE part
			// match.index is the start of the whole match
			// match[1] is the prefix
			const prefixLength = match[1].length;
			const startOffset = match.index + prefixLength;
			const endOffset = startOffset + value.length;

			const startPos = editor.document.positionAt(startOffset);
			const endPos = editor.document.positionAt(endOffset);

			// Handle quotes if present (mask content inside quotes) for ENV/YAML simple cases where regex captured quotes
			// JSON regex already handles quotes by excluding them from Group 2, so we don't need to strip them there.
			// But for ENV/YAML, our regex might capture quotes if they are part of the value group (standard lazy matching).

			// Actually patternProvider regex for JSON captures the content *inside* quotes as group 2.
			// PatternProvider for ENV captures everything after '=' as group 2.
			// PatternProvider for YAML captures everything after ':' as group 2.

			let range = new vscode.Range(startPos, endPos);

			if (pattern.type === 'env' || pattern.type === 'yaml') {
				if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
					if (value.length > 2) {
						// Mask inside quotes
						range = new vscode.Range(startPos.translate(0, 1), endPos.translate(0, -1));
						rangesToMask.push(range);
					}
				} else {
					// Mask entire value
					rangesToMask.push(range);
				}
			} else {
				// For JSON, we already captured the inner value
				rangesToMask.push(range);
			}
		}
	}

	editor.setDecorations(maskDecorationType, rangesToMask);
}

export function deactivate() {}
