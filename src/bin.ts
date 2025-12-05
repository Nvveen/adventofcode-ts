import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect } from "effect";
import { run } from "./Cli";

run(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
