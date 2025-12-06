# Advent of Code 🎄

Solutions for [Advent of Code](https://adventofcode.com/) using **Bun** and **Effect-TS**.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Nvveen/adventofcode2025)

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Language**: TypeScript (bleeding edge)
- **Framework**: [Effect-TS](https://effect.website/) - Functional programming library
- **Linting/Formatting**: [Biome](https://biomejs.dev/) - Fast, modern linter and formatter
- **Editor**: VS Code with DevContainer/Codespaces support

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed, or
- [VS Code](https://code.visualstudio.com/) with [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension, or
- A GitHub account (for Codespaces)

### Using GitHub Codespaces (Easiest)

1. Click the "Open in GitHub Codespaces" badge above, or
2. Go to the repository on GitHub and click "Code" → "Codespaces" → "Create codespace on main"
3. Wait for the codespace to start - dependencies will be installed automatically

### Using DevContainer (Local)

1. Open this repository in VS Code
2. Press `F1` and select "Dev Containers: Reopen in Container"
3. Wait for the container to build and dependencies to install

### Local Setup

```bash
# Install dependencies
bun install

# Run a specific day (e.g., 2025 day 1)
bun run src/bin.ts run 2025 1
```

## Scripts

```bash
# Run specific day
bun run src/bin.ts run <year> <day>

# Example: Run 2025 day 1
bun run src/bin.ts run 2025 1

# Linting
bun run lint        # Check for lint errors
bun run lint:fix    # Fix lint errors

# Formatting
bun run format       # Format code
bun run format:check # Check formatting

# Type checking
bun run typecheck

# All checks
bun run check       # Run all checks
bun run check:fix   # Fix all auto-fixable issues
```

## Project Structure

```
src/
├── bin.ts             # Main entry point
├── Cli.ts             # CLI implementation
└── <year>/            # Year directories (e.g., 2025/)
    └── <day>/         # Day directories (e.g., 01/)
        ├── index.ts   # Day solution
        ├── index.test.ts # Tests
        └── input.txt  # Puzzle input
```

## VS Code Extensions

Required extensions will be automatically recommended when you open the project:

- **Effect VS Code** - Language support for Effect-TS
- **Biome** - Linting and formatting
- **Bun** - Bun runtime support

## License

MIT