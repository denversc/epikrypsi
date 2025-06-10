import { describe, expect, test } from "bun:test";
import fc from "fast-check";

import {
  absolutelyAnything,
  nonArrayExamples,
  nonEmptyArray,
  notArrayOrIncludesTypesOtherThan,
  notNumber,
  notObject,
  notString,
  valueOfNotType,
  valueOfType,
} from "./fastcheck.ts";
import { allTypeofResults } from "./types.ts";

describe("fastcheck.test.ts [wzvdygx2g6]", () => {
  test("nonEmptyArray() should generate non-empty arrays [e3yddmdb42]", () => {
    fc.assert(
      fc.property(nonEmptyArray(absolutelyAnything()), value => {
        expect(value.length).toBeGreaterThan(0);
      }),
    );
  });

  test("nonEmptyArray() return type should have 0th element not undefined [b4bkw2r6jt]", () => {
    const arb = nonEmptyArray(fc.string());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const value = fc.sample(arb, 1)[0]!;
    const value0: string = value[0];
    // @ts-expect-error value[1] should have type `string|undefined`, and fail type checking when
    // being assigned to a variable of type `string`.
    const value1: string = value[1];
    // Do something nonsensical with `value0` and `value1` to avoid "unused variable" warnings.
    expect([value0, value1]).not.toBeNull();
  });

  test("notString() should generate non-strings [mtq5pp3pm2]", () => {
    fc.assert(
      fc.property(notString(), value => {
        expect(value).not.toBeTypeOf("string");
      }),
    );
  });

  test("notNumber() should generate non-numbers [v9kwba7w7x]", () => {
    fc.assert(
      fc.property(notNumber(), value => {
        expect(value).not.toBeTypeOf("number");
      }),
    );
  });

  test("notObject() should generate non-objects [b4sagyspp2]", () => {
    fc.assert(
      fc.property(notObject(), value => {
        expect(value).not.toBeTypeOf("object");
      }),
    );
  });

  test("nonArrayExamples() returns non-arrays [t9dmpyezef]", () => {
    expect.hasAssertions();
    for (const example of nonArrayExamples()) {
      const message = `Array.isArray(${Bun.inspect(example)}) should return false`;
      expect(Array.isArray(example), message).toBeFalse();
    }
  });

  test("nonArrayExamples() returns all different types [mewq48z4vc]", () => {
    const unencounteredTypes = new Set(allTypeofResults);
    for (const example of nonArrayExamples()) {
      unencounteredTypes.delete(typeof example);
    }
    expect(unencounteredTypes).toBeEmpty();
  });

  test("notArrayOrIncludesTypesOtherThan() returns true for non-array types [hpz2hgtsay]", () => {
    fc.assert(
      fc.property(fc.constantFrom(...allTypeofResults), typeName => {
        const filter = notArrayOrIncludesTypesOtherThan(typeName);
        for (const example of nonArrayExamples()) {
          expect(filter(example)).toBeTrue();
        }
      }),
    );
  });

  test("notArrayOrIncludesTypesOtherThan() returns true for empty arrays [vh85hvczyj]", () => {
    fc.assert(
      fc.property(fc.constantFrom(...allTypeofResults), typeName => {
        const filter = notArrayOrIncludesTypesOtherThan(typeName);
        expect(filter([])).toBeTrue();
      }),
    );
  });

  test("notArrayOrIncludesTypesOtherThan() returns true for non-empty arrays containing at least one element of another type [fesdgcxh35]", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allTypeofResults).chain(typeName =>
          fc.record({
            typeName: fc.constant(typeName),
            value: nonEmptyArray(fc.constantFrom(...nonArrayExamples())).filter(
              array => !array.every(item => typeof item === typeName),
            ),
          }),
        ),
        testData => {
          const { typeName, value } = testData;
          const filter = notArrayOrIncludesTypesOtherThan(typeName);
          expect(filter(value)).toBeTrue();
        },
      ),
    );
  });

  test("notArrayOrIncludesTypesOtherThan() returns false for non-empty arrays containing only elements of the given type [mbagd7xs4j]", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allTypeofResults).chain(typeName =>
          fc.record({
            typeName: fc.constant(typeName),
            value: nonEmptyArray(valueOfType(typeName)),
          }),
        ),
        testData => {
          const { typeName, value } = testData;
          const filter = notArrayOrIncludesTypesOtherThan(typeName);
          expect(filter(value)).toBeFalse();
        },
      ),
    );
  });

  test("valueOfType() returns and Arbitrary that generates values of the given type [zjzfrdfgxf]", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allTypeofResults).chain(typeName =>
          fc.record({
            typeName: fc.constant(typeName),
            value: valueOfType(typeName),
          }),
        ),
        testData => {
          const { typeName, value } = testData;
          expect(typeof value).toBe(typeName);
        },
      ),
    );
  });

  test("valueOfNotType() returns and Arbitrary that generates values NOT of the given type [cf6a5rkmaj]", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allTypeofResults).chain(typeName =>
          fc.record({
            typeName: fc.constant(typeName),
            value: valueOfNotType(typeName),
          }),
        ),
        testData => {
          const { typeName, value } = testData;
          expect(typeof value).not.toBe(typeName);
        },
      ),
    );
  });
});
