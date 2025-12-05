import { Args, Command } from "@effect/cli";
import { Path } from "@effect/platform";
import { Effect, Schema, String } from "effect";

const dayNr = Args.integer({ name: "day number" }).pipe(
  Args.withDescription("The day number to run"),
  Args.withSchema(Schema.Number.pipe(Schema.greaterThan(0), Schema.lessThanOrEqualTo(25))),
);
const day = Command.make("day", { dayNr }, (config) =>
  Effect.gen(function* () {
    const path = yield* Path.Path;
    const scriptDir = `./days/day${String.padStart(2, "0")(config.dayNr.toString())}`;
    // change working directory to the script directory
    const fullPath = path.resolve(path.join(__dirname, scriptDir));
    process.chdir(fullPath);
    // import and run the default export
    yield* Effect.tryPromise(() => import(scriptDir)).pipe(
      Effect.flatMap((module) =>
        module.default
          ? (module.default as Effect.Effect<void>)
          : Effect.fail(new Error(`No default export found in module ${scriptDir}`)),
      ),
    );
  }),
);

const command = Command.make("aoc2025", {}, () => Effect.fail("Please specify a subcommand")).pipe(
  Command.withSubcommands([day]),
);

export const run = Command.run(command, {
  name: "aoc2025",
  version: "v1.0.0",
});
