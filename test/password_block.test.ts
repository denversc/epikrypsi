import { describe, expect, test } from "bun:test";
import fc from "fast-check";

import { passwordBlockFromRecords, passwordRecordsFromBlock } from "../src/password_block.ts";
import { passwordRecordArb } from "./password_record.testing.ts";

describe("password_block.test.ts [gmpzp3ap7p]", () => {
  describe("passwordRecordsFromBlock() [k5ykrs8gw6]", () => {
    test("should throw if block length is not 4096 bytes [we7cpk4xff]", () => {
      fc.assert(
        fc.property(uint8ArrayLengthNot4096Arb, block => {
          const function_ = () => passwordRecordsFromBlock(block);
          expect(function_).toThrowError(/\bmtcbkdmenk\b/);
          expect(function_).toThrowError(/\binvalid block.length\b/i);
          expect(function_).toThrowError(new RegExp(`\\b${block.length}\\b`));
          expect(function_).toThrowError(/\bexpected: 4096\b/i);
        }),
      );
    });

    test("should correctly parse blocks [d7a5cvqgtd]", () => {
      fc.assert(
        fc.property(fc.array(passwordRecordArb, { minLength: 32, maxLength: 32 }), array => {
          const block = passwordBlockFromRecords(array);
          const parsedRecords = [...passwordRecordsFromBlock(block)];
          expect(parsedRecords).toEqual(array);
        }),
      );
    });
  });
});

/**
 * An arbitrary that generates Uint8Array objects with lengths greater than and less than, but not
 * equal to, 4096.
 */
const uint8ArrayLengthNot4096Arb = fc
  .uint8Array({ minLength: 0, maxLength: 4096 * 2 })
  .filter(array => array.length !== 4096);
