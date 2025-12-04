import { Console, Effect } from "effect";

const program = Effect.gen(function* () {
  yield* Console.log("Hello World from Day 1!");
});

export default program;
