# Dot Veil 🙈

Dot Veil (formerly Veil) is a VS Code extension that automatically hides sensitive values in your configuration files to prevent shoulder surfing or accidental screen sharing leaks.

## Features

- **Automatic Masking**: Sensitive values are replaced with `*******` in the editor.
- **Secure**: The actual file content is **never modified**, only the visual representation.
- **Toggleable**: Quickly toggle masking on/off globally or per-file.

## Supported Files

Dot Veil works out of the box with:

- `.env*` (e.g., `.env`, `.env.local`, `.env.production`)
- `.npmrc`, `.pypirc`
- `secrets.yaml`, `secrets.yml`, `.secrets`
- `credentials.json`

## Supported Patterns

Dot Veil automatically identifies and masks values for keys matching these patterns (case-insensitive where applicable):

- `*_KEY`, `*_SECRET`, `*_TOKEN`, `*_PASSWORD`
- `API_KEY`, `AUTH_SECRET`
- `DATABASE_URL`, `REDIS_URL`
- `password`, `secret`, `token`

## Commands

- `Dot Veil: Toggle Masking`: Enable or disable masking globally.

## File-Level Configuration

You can disable Dot Veil for a specific file by adding a comment anywhere in the file:

```properties
# dot-veil: off
```

To re-enable it, simply remove the comment.

## Development

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)

### Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/ragnarok22/vscode-veil-dotenv.git
    cd vscode-veil-dotenv
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Running the Extension

1.  Open the project in VS Code:
    ```bash
    code .
    ```
2.  Press `F5` to start the Extension Development Host.

### Running Tests

```bash
pnpm test
```

### Building the VSIX Package

To build the extension package (`.vsix`) for distribution:

```bash
npx @vscode/vsce package --no-dependencies
```

> **Note**: The `--no-dependencies` flag is required because we bundle dependencies using `esbuild`.
