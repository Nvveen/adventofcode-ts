import { FileSystem } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import { Console, Effect } from "effect";

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const input = yield* fs.readFileString("./input.txt");
  console.log(input);
  yield* Console.log("Hello World from Day 1!");
});

const main = program.pipe(Effect.provide(BunContext.layer));

export default main;
