import { FileSystem } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import { Console, Effect, Schema } from "effect";

export const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const input = yield* fs.readFileString("./input.txt");

  const parser = Schema.TemplateLiteralParser(Schema.Literal("L", "R"), Schema.Int);

  const instructions = Array.from(
    input.split("\n").map((line) => Schema.decodeUnknownSync(parser)(line.trim())),
  );

  // turn the dial, count the times we end up on 0. Remember, going negative or above 99 loops around
  const [total] = instructions.reduce<[number, number]>(
    ([total, pos], [turn, dist]) => {
      const movement = turn === "L" ? -(dist % 100) : dist % 100;
      // account for wrapping around the dial
      pos = (pos + movement + 100) % 100;
      return [pos === 0 ? total + 1 : total, pos];
    },
    [0, 50],
  );
  return total;
});

const main = program.pipe(
  Effect.provide(BunContext.layer),
  Effect.flatMap((result) => Console.log(`Total times at position 0: ${result}`)),
);

export default main;
