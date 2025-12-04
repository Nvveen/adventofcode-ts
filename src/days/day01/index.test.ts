import { describe, expect, test } from "bun:test";
import { FileSystem } from "@effect/platform";
import { Effect } from "effect";
import { program } from ".";

// Mock input data - fill this in with your test data
const mockInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

// Create a mock FileSystem layer using layerNoop
const MockFileSystem = FileSystem.layerNoop({
  readFileString: () => Effect.succeed(mockInput),
});

describe("Day 01", () => {
  test("should solve part 1", async () => {
    // Run the program with the mock filesystem
    const result = await Effect.runPromise(program.pipe(Effect.provide(MockFileSystem)));

    // Starting at position 50:
    // L68 -> 82, L30 -> 52, R48 -> 0 (count=1), L5 -> 95,
    // R60 -> 55, L55 -> 0 (count=2), L1 -> 99, L99 -> 0 (count=3),
    // R14 -> 14, L82 -> 32
    expect(result).toBe(3);
  });
});
