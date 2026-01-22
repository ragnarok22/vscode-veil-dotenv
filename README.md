# Veil 🙈

Veil is a VS Code extension that automatically hides sensitive values in your configuration files to prevent shoulder surfing or accidental screen sharing leaks.

## Features

- **Automatic Masking**: Sensitive values are replaced with `*******` in the editor.
- **Secure**: The actual file content is **never modified**, only the visual representation.
- **Toggleable**: Quickly toggle masking on/off globally or per-file.

## Supported Files

Veil works out of the box with:

- `.env*` (e.g., `.env`, `.env.local`, `.env.production`)
- `.npmrc`, `.pypirc`
- `secrets.yaml`, `secrets.yml`, `.secrets`
- `credentials.json`

## Supported Patterns

Veil automatically identifies and masks values for keys matching these patterns (case-insensitive where applicable):

- `*_KEY`, `*_SECRET`, `*_TOKEN`, `*_PASSWORD`
- `API_KEY`, `AUTH_SECRET`
- `DATABASE_URL`, `REDIS_URL`
- `password`, `secret`, `token`

## Commands

- `Veil: Toggle Masking`: Enable or disable masking globally.

## File-Level Configuration

You can disable Veil for a specific file by adding a comment anywhere in the file:

```properties
# veil: off
```

To re-enable it, simply remove the comment.
