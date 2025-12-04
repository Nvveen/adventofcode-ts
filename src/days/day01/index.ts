import { Effect, Console } from "effect";

const program = Effect.gen(function* () {
  yield* Console.log("Hello World from Day 1!");
});

Effect.runPromise(program).catch(console.error);
