import { describe, expect, test } from "bun:test";
import fc from "fast-check";

import {
  type IncorrectLength,
  type IncorrectType,
  isIncorrectLength,
  isIncorrectType,
} from "../src/validation.ts";
import {
  absolutelyAnything,
  nonArrayExamples,
  nonEmptyArray,
  notArrayOrIncludesTypesOtherThan,
  notNumber,
  notString,
} from "./testing/fastcheck.ts";

describe("validation.test.ts [ym23cpzkck]", () => {
  describe("isIncorrectType() [jtj23jh3e6]", () => {
    test("should return false for invalid values [zsr3tp8j8t]", () => {
      fc.assert(
        fc.property(invalidIncorrectTypeArb, value => {
          expect(isIncorrectType(value)).toBeFalse();
        }),
        { examples: invalidIncorrectTypeExamples() },
      );
    });
    test("should return true for valid values [ae3me7wk74]", () => {
      fc.assert(
        fc.property(validIncorrectTypeArb, value => {
          expect(isIncorrectType(value)).toBeTrue();
        }),
      );
    });
  });

  describe("isIncorrectLength() [tn2ytqj3sk]", () => {
    test("should return false for invalid values [sy2j489rf3]", () => {
      fc.assert(
        fc.property(invalidIncorrectLengthArb, value => {
          expect(isIncorrectLength(value)).toBeFalse();
        }),
        { examples: invalidIncorrectLengthExamples() },
      );
    });
    test("should return true for valid values [gan2bgsfgv]", () => {
      fc.assert(
        fc.property(validIncorrectLengthArb, value => {
          expect(isIncorrectLength(value)).toBeTrue();
        }),
      );
    });
  });
});

const validIncorrectTypeArb: fc.Arbitrary<IncorrectType> = fc.oneof(
  fc.record({ expected: fc.string(), actual: fc.string() }),
  fc.record({ expected: nonEmptyArray(fc.string()), actual: fc.string() }),
);

const invalidIncorrectTypeArb = fc.oneof(
  absolutelyAnything().filter(value => value === null || typeof value !== "object"),
  fc.object().filter(value => !("expected" in value && "actual" in value)),
  fc.record({ expected: fc.string() }),
  fc.record({ expected: nonEmptyArray(fc.string()) }),
  fc.record({ actual: fc.string() }),
  fc.record({ expected: fc.string(), actual: notString() }),
  fc.record({ expected: nonEmptyArray(fc.string()), actual: notString() }),
  fc.record({ expected: fc.constant([]), actual: fc.string() }),
  fc.record({
    expected: notString().filter(notArrayOrIncludesTypesOtherThan("string")),
    actual: fc.string(),
  }),
);

function invalidIncorrectTypeExamples(): unknown[] {
  return nonArrayExamples().map(value => [value]);
}

const validIncorrectLengthArb: fc.Arbitrary<IncorrectLength> = fc.oneof(
  fc.record({ expected: fc.integer(), actual: fc.integer() }),
  fc.record({ expected: nonEmptyArray(fc.integer()), actual: fc.integer() }),
);

const invalidIncorrectLengthArb = fc.oneof(
  absolutelyAnything().filter(value => value === null || typeof value !== "object"),
  fc.object().filter(value => !("expected" in value && "actual" in value)),
  fc.record({ expected: fc.integer() }),
  fc.record({ expected: nonEmptyArray(fc.integer()) }),
  fc.record({ actual: fc.integer() }),
  fc.record({ expected: fc.integer(), actual: notNumber() }),
  fc.record({ expected: nonEmptyArray(fc.integer()), actual: notNumber() }),
  fc.record({ expected: fc.constant([]), actual: fc.integer() }),
  fc.record({
    expected: notNumber().filter(notArrayOrIncludesTypesOtherThan("number")),
    actual: fc.integer(),
  }),
);

function invalidIncorrectLengthExamples(): unknown[] {
  return nonArrayExamples().map(value => [value]);
}
