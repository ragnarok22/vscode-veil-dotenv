import * as vscode from 'vscode';
import * as path from 'path';

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
	}
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
	vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			updateDecorations(editor);
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
			updateDecorations(vscode.window.activeTextEditor);
		}
	}, null, context.subscriptions);

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

	const filename = path.basename(editor.document.fileName);
	// Support .env, .env.local, .env.production, etc.
	if (!filename.startsWith('.env')) {
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

	// Regex to match KEY=VALUE
	const envRegex = /^([\w_.-]+)\s*=\s*(.*)$/gm;
	let match;
	while ((match = envRegex.exec(text))) {
		const key = match[1];
		const value = match[2];

		// Skip empty values
		if (!value || value.trim() === '') {
			continue;
		}

		// Calculate range for the VALUE part
		const startPos = editor.document.positionAt(match.index + match[0].length - value.length);
		const endPos = editor.document.positionAt(match.index + match[0].length);

		// Handle quotes if present (mask content inside quotes)
		// Simple check for surrounding quotes
		let range = new vscode.Range(startPos, endPos);

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
	}

	editor.setDecorations(maskDecorationType, rangesToMask);
}

export function deactivate() { }

