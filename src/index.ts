import { Args, Command } from "@effect/cli";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Console, Effect, Schema } from "effect";

const dayNr = Args.integer({ name: "day number" }).pipe(
  Args.withDescription("The day number to run"),
  Args.withSchema(Schema.Number.pipe(Schema.greaterThan(0))),
);
const day = Command.make("day", { dayNr }, () => Console.log("Specify a day to run"));

const command = Command.make("aoc2025", {}, () => Effect.fail("Please specify a subcommand")).pipe(
  Command.withSubcommands([day]),
);

const cli = Command.run(command, {
  name: "aoc2025",
  version: "v1.0.0",
});

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
