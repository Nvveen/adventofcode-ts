// Advent of Code 2025 - Main Entry Point
// Run individual days with: bun run src/days/day01/index.ts

import { Effect, Console } from "effect";

const program = Effect.gen(function* () {
  yield* Console.log("🎄 Advent of Code 2025 🎄");
  yield* Console.log("Run individual days with: bun run src/days/day<XX>/index.ts");
});

Effect.runPromise(program).catch(console.error);
