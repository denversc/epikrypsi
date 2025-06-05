import { describe, expect, test } from "bun:test";
import fc, { type Arbitrary } from "fast-check";

import { assertValidPasswordRecord, type PasswordRecord } from "../src/password_record.ts";
import { assertUnreachable } from "../src/typing.ts";
import {
  assertIsPasswordRecordPropertyName,
  passwordRecordArb,
  PasswordRecordArrayLengths,
  passwordRecordPropertyValueArb,
} from "./password_record.testing.ts";
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
        fc.property(invalidPasswordRecordArb, testData => {
          const { states, passwordRecord } = testData;
          const function_ = () => {
            assertValidPasswordRecord(passwordRecord);
          };

          for (const [propertyName, state] of Object.entries(states)) {
            assertIsPasswordRecordPropertyName(propertyName);

            if (state === "valid") {
              continue;
            }

            expect(function_).toThrowError(/\bz8zh7y6m6z\b/);
            expect(function_).toThrowError(new RegExp(`\\b${propertyName}\\b`));
            expect(function_).toThrowError(/\bis not a valid PasswordRecord\b/);

            switch (state) {
              case "incorrect type": {
                expect(function_).toThrowError(/\bd435k8gx4v\b/);
                expect(function_).toThrowError(/\bhas the wrong type\b/i);

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
                assertUnreachable(state, "internal error: invalid state: %s [s9h362vdq8]");
              }
            }
          }
        }),
      );
    });
  });
});

type PasswordRecordPropertyState = "valid" | "missing" | "incorrect type" | "incorrect length";

const allPasswordRecordPropertyStates: readonly PasswordRecordPropertyState[] = [
  "valid",
  "missing",
  "incorrect type",
  "incorrect length",
];

const invalidPasswordRecordArb = fc
  .record({
    salt: fc.constantFrom(...allPasswordRecordPropertyStates),
    iv: fc.constantFrom(...allPasswordRecordPropertyStates),
    authTag: fc.constantFrom(...allPasswordRecordPropertyStates),
    masterKey: fc.constantFrom(...allPasswordRecordPropertyStates),
    padding: fc.constantFrom(...allPasswordRecordPropertyStates),
  })
  .filter(record => Object.values(record).some(value => value !== "valid"))
  .chain(states => {
    const recordSpec: Partial<Record<keyof PasswordRecord, Arbitrary<unknown>>> = {};
    for (const [propertyName, propertyState] of Object.entries(states)) {
      assertIsPasswordRecordPropertyName(propertyName);
      switch (propertyState) {
        case "valid": {
          recordSpec[propertyName] = passwordRecordPropertyValueArb(propertyName);
          break;
        }
        case "missing": {
          break;
        }
        case "incorrect type": {
          recordSpec[propertyName] = fc.anything().filter(item => !(item instanceof Uint8Array));
          break;
        }
        case "incorrect length": {
          const validLength = PasswordRecordArrayLengths[propertyName];
          recordSpec[propertyName] = fc.uint8Array().filter(array => array.length !== validLength);
          break;
        }
        default: {
          assertUnreachable(
            propertyState,
            "internal error: invalid propertyState: %s [wx5zaea8n3]",
          );
        }
      }
    }
    return fc.record({
      states: fc.constant<Record<keyof PasswordRecord, PasswordRecordPropertyState>>(states),
      passwordRecord: fc.record<Partial<Record<keyof PasswordRecord, unknown>>>(recordSpec),
    });
  });
