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
  const [_, total] = instructions.reduce<[number, number]>(
    ([pos, total], [turn, dist]) => {
      pos = turn === "L" ? (pos - (dist % 100) + 100) % 100 : (pos + (dist % 100)) % 100;
      return [pos, pos === 0 ? total + 1 : total];
    },
    [50, 0],
  );
  return total;
});

const main = program.pipe(
  Effect.provide(BunContext.layer),
  Effect.flatMap((result) => Console.log(`Total times at position 0: ${result}`)),
);

export default main;
