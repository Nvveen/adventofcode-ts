# Advent of Code 2025 🎄

Solutions for [Advent of Code 2025](https://adventofcode.com/2025) using **Bun** and **Effect-TS**.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Language**: TypeScript (bleeding edge)
- **Framework**: [Effect-TS](https://effect.website/) - Functional programming library
- **Linting/Formatting**: [Biome](https://biomejs.dev/) - Fast, modern linter and formatter
- **Editor**: VS Code with DevContainer support

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed, or
- [VS Code](https://code.visualstudio.com/) with [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension

### Using DevContainer (Recommended)

1. Open this repository in VS Code
2. Press `F1` and select "Dev Containers: Reopen in Container"
3. Wait for the container to build and dependencies to install

### Local Setup

```bash
# Install dependencies
bun install

# Run Day 1
bun run day01

# Or run directly
bun run src/days/day01/index.ts
```

## Scripts

```bash
# Run specific day
bun run day01

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
├── index.ts           # Main entry point
└── days/
    └── day01/
        └── index.ts   # Day 1 solution
```

## VS Code Extensions

Required extensions will be automatically recommended when you open the project:

- **Effect VS Code** - Language support for Effect-TS
- **Biome** - Linting and formatting
- **Bun** - Bun runtime support

## License

MIT