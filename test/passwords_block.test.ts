import { describe, expect, test } from "bun:test";
import fc from "fast-check";

import { type PasswordRecord,passwordRecordsFromPasswordBlock } from "../src/passwords_block.ts";

describe("passwords_block.ts.ts [gmpzp3ap7p]", () => {
  describe("passwordRecordsFromPasswordBlock() [k5ykrs8gw6]", () => {
    test("should throw if block length is not 4096 bytes [we7cpk4xff]", () => {
      fc.property(uint8ArrayLengthNot4096Arb, array => {
        expect(() => {
          passwordRecordsFromPasswordBlock(array);
        }).toThrowError(
          `unexpected block.length for password block: ${array.length} ` +
            `(expected: 4096) [mtcbkdmenk]`,
        );
      });
    });

    test("should correctly parse blocks [d7a5cvqgtd]", () => {
      fc.property(fc.array(passwordRecordArb, { minLength: 32, maxLength: 32 }), array => {
        const block = passwordBlockFromRecords(array);
        const parsedRecords = [...passwordRecordsFromPasswordBlock(block)];
        expect(parsedRecords).toEqual(array);
      });
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

/**
 * An arbitrary that generates `PasswordRecord` objects with random data.`
 */
const passwordRecordArb = fc.record<PasswordRecord>({
  salt: fc.uint8Array({ minLength: 16, maxLength: 16 }),
  iv: fc.uint8Array({ minLength: 12, maxLength: 12 }),
  authTag: fc.uint8Array({ minLength: 16, maxLength: 16 }),
  masterKey: fc.uint8Array({ minLength: 32, maxLength: 32 }),
  padding: fc.uint8Array({ minLength: 52, maxLength: 52 }),
});

function passwordBlockFromRecords(passwordRecords: PasswordRecord[]): Uint8Array {
  const result = new Uint8Array(passwordRecords.length * 128);
  for (const [index, passwordRecord] of passwordRecords.entries()) {
    const record = passwordRecord;
    const offset = index * 128;
    result.set(record.salt, offset + 0);
    result.set(record.iv, offset + 16);
    result.set(record.authTag, offset + 28);
    result.set(record.masterKey, offset + 44);
    result.set(record.padding, offset + 76);
  }
  return result;
}
