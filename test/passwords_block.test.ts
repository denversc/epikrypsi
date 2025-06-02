import { describe, expect, test } from "bun:test";
import fc from "fast-check";

import { passwordRecordsFromPasswordBlock } from "../src/passwords_block.ts";

describe("passwords_block.ts.ts [gmpzp3ap7p]", () => {
  describe("passwordRecordsFromPasswordBlock() [k5ykrs8gw6]", () => {
    test("should throw if block length is not 4096 bytes [we7cpk4xff]", () => {
      fc.property(fc.uint8Array({ minLength: 0, maxLength: 4096 * 2 }), block => {
        if (block.length === 4096) {
          return; // Skip valid case
        }
        expect(() => {
          passwordRecordsFromPasswordBlock(block);
        }).toThrowError(
          `unexpected block.length for password block: ${block.length} ` +
            `(expected: 4096) [mtcbkdmenk]`,
        );
      });
    });
  });
});
