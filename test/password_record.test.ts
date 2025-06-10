import { describe, expect, test } from "bun:test";
import fc from "fast-check";

import { assertValidPasswordRecord } from "../src/password_record.ts";
import { assertUnreachable } from "../src/typing.ts";
import {
  assertIsPasswordRecordPropertyName,
  passwordRecordArb,
  PasswordRecordArrayLengths,
  passwordRecordWithInvalidPropertiesArb,
} from "./password_record.testing.ts";
import { notObject } from "./testing/fastcheck.ts";
import { escaped } from "./testing/regexp.ts";

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
        fc.property(notObject(), value => {
          const function_ = () => {
            assertValidPasswordRecord(value);
          };
          expect(function_).toThrowError(/\bcx76rqp7bn\b/);
          expect(function_).toThrowError(/\bnot compatible with PasswordRecord\b/);
          expect(function_).toThrowError(new RegExp(`\\b: ${typeof value}\\b`));
          expect(function_).toThrowError(/\bexpected: object\b/);
        }),
      );
    });

    test("should throw if value is null [v9jrpqfcba]", () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const function_ = () => {
        assertValidPasswordRecord(null);
      };
      expect(function_).toThrowError(/\bcx76rqp7bn\b/);
      expect(function_).toThrowError(/\bnot compatible with PasswordRecord\b/);
      expect(function_).toThrowError(/\b: null\b/);
      expect(function_).toThrowError(/\bexpected: object\b/);
    });

    test("should throw if value is an object but with invalid properties [wczmx7sccx]", () => {
      expect.hasAssertions();
      fc.assert(
        fc.property(passwordRecordWithInvalidPropertiesArb, testData => {
          const { validities, passwordRecord } = testData;
          const function_ = () => {
            assertValidPasswordRecord(passwordRecord);
          };

          for (const [propertyName, validity] of Object.entries(validities)) {
            assertIsPasswordRecordPropertyName(propertyName);
            const propertyValue = passwordRecord[propertyName];

            if (validity === "valid") {
              continue;
            }

            expect(function_).toThrowError(/\bz8zh7y6m6z\b/);
            expect(function_).toThrowError(new RegExp(`\\b${propertyName}\\b`));
            expect(function_).toThrowError(/\bis not a valid PasswordRecord\b/);

            switch (validity) {
              case "incorrect typeof": {
                expect(function_).toThrowError(/\bd435k8gx4v\b/);
                expect(function_).toThrowError(/\bhas the wrong type\b/i);
                expect(function_).toThrowError(
                  new RegExp(`\\bwrong type: ${typeof propertyValue}\\b`),
                );
                expect(function_).toThrowError(/\bexpected: object\b/);
                break;
              }
              case "incorrect instanceof": {
                const actualConstructor = propertyValue?.constructor?.name ?? "<null prototype>";
                expect(function_).toThrowError(/\bd435k8gx4v\b/);
                expect(function_).toThrowError(/\bhas the wrong type\b/i);
                expect(function_).toThrowError(
                  new RegExp(`\\bwrong type: ${escaped(actualConstructor)}\\b`),
                );
                expect(function_).toThrowError(/\bexpected: Uint8Array\b/);
                break;
              }
              case "incorrect length": {
                const actualLength = (passwordRecord[propertyName] as Uint8Array).length;
                const expectedLength = PasswordRecordArrayLengths[propertyName];
                expect(function_).toThrowError(/\bba8h2qefz5\b/);
                expect(function_).toThrowError(/\bhas the wrong length\b/i);
                expect(function_).toThrowError(new RegExp(`\\b${actualLength}\\b`));
                expect(function_).toThrowError(new RegExp(`\\b${expectedLength}\\b`));
                break;
              }
              case "missing": {
                expect(function_).toThrowError(/\btxbb3wetfr\b/);
                expect(function_).toThrowError(/\bis missing\b/i);
                break;
              }
              default: {
                assertUnreachable(validity, "internal error: invalid validity: %s [s9h362vdq8]");
              }
            }
          }
        }),
      );
    });
  });
});
