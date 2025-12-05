import { Args, Command } from "@effect/cli";
import { FileSystem, Path } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import { Array, Effect, Order, pipe, Schema, String } from "effect";

const maxDay = await Effect.runPromise(
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    // read all directories in the days folder that match dayXX
    const entries = yield* fs.readDirectory("./src/days");
    const parse = Schema.NonEmptyArray(
      Schema.TemplateLiteralParser(Schema.Literal("day"), Schema.Int),
    ).pipe(Schema.decodeUnknown);

    const maxDay = yield* parse(entries).pipe(
      Effect.map((xs) =>
        pipe(
          Array.map(xs, (x) => x[1]),
          Array.max(Order.number),
        ),
      ),
    );

    return maxDay;
  }).pipe(Effect.provide(BunContext.layer)),
);

const dayNr = Args.integer({ name: "day number" }).pipe(
  Args.withDescription("The day number to run"),
  Args.withSchema(Schema.Number.pipe(Schema.greaterThan(0), Schema.lessThanOrEqualTo(maxDay))),
);
const day = Command.make("day", { dayNr }, (config) =>
  Effect.gen(function* () {
    const path = yield* Path.Path;

    const scriptDir = `./days/day${String.padStart(2, "0")(config.dayNr.toString())}`;
    const fullPath = path.resolve(path.join(__dirname, scriptDir));

    yield* Effect.log(`Day ${config.dayNr} of ${maxDay}`);

    // change working directory to the script directory
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
