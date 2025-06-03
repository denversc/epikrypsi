import { describe, expect, test } from "bun:test";
import fc from "fast-check";

import { escaped } from "./regexp.ts";

describe("regexp.test.ts [w9jpa2t3s6]", () => {
  describe("escaped() [jnxn54af6x]", () => {
    test("should escape special regular expression characters [a943h2nzj7]", () => {
      fc.assert(
        fc.property(fc.string({ unit: "binary-ascii" }), unescapedText => {
          const escapedText = escaped(unescapedText);
          const regexp = new RegExp(escapedText);
          const candidateText = `foo${unescapedText}bar`;
          expect(candidateText).toMatch(regexp);
        }),
      );
    });
  });
});
