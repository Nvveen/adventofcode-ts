import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Args, Command } from "@effect/cli";
import { FileSystem, Path } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import { Data, Effect, Option, String } from "effect";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Custom Error classes using Effect's Data.Error
class ModuleNotFoundError extends Data.Error<{ readonly scriptDir: string }> {}
class YearNotFoundError extends Data.Error<{
  readonly year: number;
  readonly availableYears: readonly number[];
}> {}
class DayNotFoundError extends Data.Error<{
  readonly year: number;
  readonly day: number;
  readonly availableDays: readonly number[];
}> {}
class DayExecutionError extends Data.Error<{
  readonly year: number;
  readonly day: number;
  readonly cause: unknown;
}> {}

const availableYears = await Effect.runPromise(
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    // read all year directories in src folder
    const srcPath = __dirname;
    const entries = yield* fs.readDirectory(srcPath);

    // Filter for 4-digit years, parse to integers, and sort
    const years = entries
      .filter((entry) => /^\d{4}$/.test(entry))
      .map((entry) => Number.parseInt(entry, 10))
      .sort((a, b) => a - b);

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
          : Effect.fail(new ModuleNotFoundError({ scriptDir })),
      ),
    );
  }).pipe(
    Effect.catchAll((error) => {
      if (error instanceof ModuleNotFoundError) {
        return Effect.log(
          `Error running year ${year}, day ${day}: No default export found in module ${error.scriptDir}`,
        );
      }
      const cause = error instanceof DayExecutionError ? error.cause : error;
      return Effect.log(`Error running year ${year}, day ${day}: ${cause}`);
    }),
  );

const command = Command.make("run", { yearNr, dayNr }, (config) =>
  Effect.gen(function* () {
    // If no year provided, run all years
    if (Option.isNone(config.yearNr)) {
      yield* Effect.log("Running all years...");
      for (const year of availableYears) {
        const availableDays = yield* getAvailableDaysForYear(year).pipe(
          Effect.catchAll(() => Effect.succeed([])),
        );

        for (const day of availableDays) {
          yield* runDay(year, day);
        }
      }
      return;
    }

    const year = config.yearNr.value;

    // Validate year
    if (!availableYears.includes(year)) {
      return yield* Effect.fail(new YearNotFoundError({ year, availableYears }));
    }

    // discover available days for the selected year
    const availableDays = yield* getAvailableDaysForYear(year).pipe(
      Effect.catchAll(() => Effect.fail(new YearNotFoundError({ year, availableYears }))),
    );

    // If no day provided, run all days for the year
    if (Option.isNone(config.dayNr)) {
      yield* Effect.log(`Running all days for year ${year}...`);
      for (const day of availableDays) {
        yield* runDay(year, day);
      }
      return;
    }

    const day = config.dayNr.value;

    // validate day exists
    if (!availableDays.includes(day)) {
      return yield* Effect.fail(new DayNotFoundError({ year, day, availableDays }));
    }

    yield* runDay(year, day);
  }),
);

export const cli = Command.run(command, {
  name: "aoc",
  version: "v1.0.0",
});
