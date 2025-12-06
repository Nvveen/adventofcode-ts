import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect, Layer, Logger, LogLevel } from "effect";
import { cli } from "./Cli";

const MainLayer = Layer.mergeAll(BunContext.layer, Logger.pretty);

cli(process.argv).pipe(
  Logger.withMinimumLogLevel(LogLevel.Info),
  Effect.provide(MainLayer),
  BunRuntime.runMain,
);
