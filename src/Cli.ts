import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Args, Command } from "@effect/cli";
import { FileSystem, Path } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import { Effect, Schema, String } from "effect";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const availableYears = await Effect.runPromise(
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    // read all year directories in src folder
    const srcPath = __dirname;
    const entries = yield* fs.readDirectory(srcPath);

    // Filter for 4-digit years and parse to integers
    const years = entries
      .filter((entry) => /^\d{4}$/.test(entry))
      .map((entry) => Number.parseInt(entry, 10));

    return years;
  }).pipe(Effect.provide(BunContext.layer)),
);

const yearNr = Args.integer({ name: "year" }).pipe(
  Args.withDescription("The year to run"),
  Args.withSchema(
    Schema.Number.pipe(
      Schema.filter((year) => availableYears.includes(year), {
        message: () => `Year must be one of: ${availableYears.join(", ")}`,
      }),
    ),
  ),
);

const dayNr = Args.integer({ name: "day" }).pipe(Args.withDescription("The day number to run"));

const run = Command.make("run", { yearNr, dayNr }, (config) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    // discover available days for the selected year
    const yearPath = path.join(__dirname, config.yearNr.toString());
    const dayEntries = yield* fs
      .readDirectory(yearPath)
      .pipe(Effect.catchAll(() => Effect.fail(new Error(`Year ${config.yearNr} not found`))));

    // Filter for 2-digit days and parse to integers
    const availableDays = dayEntries
      .filter((entry) => /^\d{2}$/.test(entry))
      .map((entry) => Number.parseInt(entry, 10));

    const paddedDay = String.padStart(2, "0")(config.dayNr.toString());

    // validate day exists
    if (!availableDays.includes(config.dayNr)) {
      return yield* Effect.fail(
        new Error(
          `Day ${config.dayNr} not found for year ${config.yearNr}. Available days: ${availableDays.join(", ")}`,
        ),
      );
    }

    const scriptDir = `./${config.yearNr}/${paddedDay}`;
    const fullPath = path.resolve(path.join(__dirname, scriptDir));

    yield* Effect.log(`Year ${config.yearNr}, Day ${config.dayNr}`);

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

const command = Command.make("aoc", {}, () => Effect.fail("Please specify a command")).pipe(
  Command.withSubcommands([run]),
);

export const cli = Command.run(command, {
  name: "aoc",
  version: "v1.0.0",
});
