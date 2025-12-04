import { Args, Command } from "@effect/cli";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect, Schema, String } from "effect";

const dayNr = Args.integer({ name: "day number" }).pipe(
  Args.withDescription("The day number to run"),
  Args.withSchema(Schema.Number.pipe(Schema.greaterThan(0), Schema.lessThanOrEqualTo(25))),
);
const day = Command.make("day", { dayNr }, (config) =>
  Effect.gen(function* () {
    const srcFileName = `./days/day${String.padStart(2, "0")(config.dayNr.toString())}`;
    yield* Effect.tryPromise(() => import(srcFileName)).pipe(
      Effect.flatMap((module) =>
        module.default
          ? (module.default as Effect.Effect<void>)
          : Effect.fail(new Error(`No default export found in module ${srcFileName}`)),
      ),
    );
  }),
);

const command = Command.make("aoc2025", {}, () => Effect.fail("Please specify a subcommand")).pipe(
  Command.withSubcommands([day]),
);

const cli = Command.run(command, {
  name: "aoc2025",
  version: "v1.0.0",
});

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
