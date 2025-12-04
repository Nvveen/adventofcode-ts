import { Command } from "@effect/cli";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Console, Effect } from "effect";

const command = Command.make("aoc2025", {}, () => Console.log("Hello, world"));

const cli = Command.run(command, {
  name: "aoc2025",
  version: "v1.0.0",
});

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
