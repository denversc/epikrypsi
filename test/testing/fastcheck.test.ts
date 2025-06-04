import { describe, expect, test } from "bun:test";
import fc from "fast-check";

import { nonEmptyArray, notNumber, notString } from "./fastcheck.ts";

describe("fastcheck.test.ts [wzvdygx2g6]", () => {
  test("nonEmptyArray() should generate non-empty arrays [e3yddmdb42]", () => {
    fc.assert(
      fc.property(nonEmptyArray(fc.anything()), value => {
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
});
