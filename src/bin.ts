import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect, Layer, Logger, LogLevel } from "effect";
import { run } from "./Cli";

const MainLayer = Layer.mergeAll(
  BunContext.layer, //
  Logger.pretty,
);

run(process.argv).pipe(
  Logger.withMinimumLogLevel(LogLevel.Info),
  Effect.provide(MainLayer),
  BunRuntime.runMain,
);
