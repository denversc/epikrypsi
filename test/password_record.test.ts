import { describe, expect, test } from "bun:test";
import fc from "fast-check";

import { assertValidPasswordRecord } from "../src/password_record.ts";
import { passwordRecordArb } from "./password_record.testing.ts";
import { valueOfNotType } from "./testing/fastcheck.ts";

describe("password_record.test.ts [g5y5m67f7m]", () => {
  describe("assertValidPasswordRecord() [kfhm2xn5h8]", () => {
    test("should return normally for valid values [svgkxn9t87]", () => {
      fc.assert(
        fc.property(passwordRecordArb, passwordRecord => {
          assertValidPasswordRecord(passwordRecord);
        }),
      );
    });

    test("should throw if value is not an object [wq6naqhawp]", () => {
      fc.assert(
        fc.property(valueOfNotType("object"), value => {
          const function_ = () => assertValidPasswordRecord(value);
          expect(function_).toThrowError(/\bcx76rqp7bn\b/);
          expect(function_).toThrowError(/\bnot compatible with PasswordRecord\b/);
          expect(function_).toThrowError(new RegExp(`\\b: ${typeof value}\\b`));
          expect(function_).toThrowError(/\bexpected: object\b/);
        }),
      );
    });

    test("should throw if value is null [v9jrpqfcba]", () => {
      const function_ = () => assertValidPasswordRecord(null);
      expect(function_).toThrowError(/\bcx76rqp7bn\b/);
      expect(function_).toThrowError(/\bnot compatible with PasswordRecord\b/);
      expect(function_).toThrowError(/\b: null\b/);
      expect(function_).toThrowError(/\bexpected: object\b/);
    });
  });
});
