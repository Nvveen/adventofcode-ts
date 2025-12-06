import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Args, Command } from "@effect/cli";
import { FileSystem, Path } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import { Effect, Option, String } from "effect";

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
  Args.withDescription("The year to run (optional, runs all years if not provided)"),
  Args.optional,
);

const dayNr = Args.integer({ name: "day" }).pipe(
  Args.withDescription("The day number to run (optional, runs all days if not provided)"),
  Args.optional,
);

const getAvailableDaysForYear = (year: number) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    const yearPath = path.join(__dirname, year.toString());
    const dayEntries = yield* fs.readDirectory(yearPath);

    return dayEntries
      .filter((entry) => /^\d{2}$/.test(entry))
      .map((entry) => Number.parseInt(entry, 10))
      .sort((a, b) => a - b);
  });

const runDay = (year: number, day: number) =>
  Effect.gen(function* () {
    const path = yield* Path.Path;

    const paddedDay = String.padStart(2, "0")(day.toString());
    const scriptDir = `./${year}/${paddedDay}`;
    const fullPath = path.resolve(path.join(__dirname, scriptDir));

    yield* Effect.log(`Year ${year}, Day ${day}`);

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
  });

const runDayWithErrorHandling = (year: number, day: number) =>
  runDay(year, day).pipe(
    Effect.catchAll((error) => Effect.log(`Error running year ${year}, day ${day}: ${error}`)),
  );

const run = Command.make("run", { yearNr, dayNr }, (config) =>
  Effect.gen(function* () {
    // If no year provided, run all years
    if (Option.isNone(config.yearNr)) {
      yield* Effect.log("Running all years...");
      for (const year of availableYears.sort()) {
        const availableDays = yield* getAvailableDaysForYear(year).pipe(
          Effect.catchAll(() => Effect.succeed([])),
        );

        for (const day of availableDays) {
          yield* runDayWithErrorHandling(year, day);
        }
      }
      return;
    }

    const year = config.yearNr.value;

    // Validate year
    if (!availableYears.includes(year)) {
      return yield* Effect.fail(
        new Error(`Year ${year} not found. Available years: ${availableYears.join(", ")}`),
      );
    }

    // discover available days for the selected year
    const availableDays = yield* getAvailableDaysForYear(year).pipe(
      Effect.catchAll(() => Effect.fail(new Error(`Year ${year} not found`))),
    );

    // If no day provided, run all days for the year
    if (Option.isNone(config.dayNr)) {
      yield* Effect.log(`Running all days for year ${year}...`);
      for (const day of availableDays) {
        yield* runDayWithErrorHandling(year, day);
      }
      return;
    }

    const day = config.dayNr.value;

    // validate day exists
    if (!availableDays.includes(day)) {
      return yield* Effect.fail(
        new Error(
          `Day ${day} not found for year ${year}. Available days: ${availableDays.join(", ")}`,
        ),
      );
    }

    yield* runDay(year, day);
  }),
);

const command = run;

export const cli = Command.run(command, {
  name: "aoc",
  version: "v1.0.0",
});
