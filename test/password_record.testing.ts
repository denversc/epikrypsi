import { Arbitrary, record, uint8Array } from "fast-check";

import { type PasswordRecord } from "../src/password_record.ts";
import { assertUnreachable } from "../src/typing.ts";

const passwordRecordPropertyNames: Readonly<Array<keyof PasswordRecord>> = [
  "salt",
  "iv",
  "authTag",
  "masterKey",
  "padding",
];

export const PasswordRecordArrayLengths = {
  salt: 16 as const,
  iv: 12 as const,
  authTag: 16 as const,
  masterKey: 32 as const,
  padding: 52 as const,
} as const;

/**
 * Asserts that a given string is equal to one of the property names of {@link PasswordRecord}.
 */
export function assertIsPasswordRecordPropertyName(s: string): asserts s is keyof PasswordRecord {
  if (!(passwordRecordPropertyNames as unknown[]).includes(s)) {
    throw new Error(`invalid PasswordRecord property name: ${s} [gcw3jaaqv5]`);
  }
}

/**
 * An arbitrary that generates `PasswordRecord` objects with random data.`
 */
export const passwordRecordArb: Arbitrary<PasswordRecord> = record<PasswordRecord>({
  salt: passwordRecordPropertyValueArb("salt"),
  iv: passwordRecordPropertyValueArb("iv"),
  authTag: passwordRecordPropertyValueArb("authTag"),
  masterKey: passwordRecordPropertyValueArb("masterKey"),
  padding: passwordRecordPropertyValueArb("padding"),
});

/**
 * Returns an {@link Arbitrary} that generates valid values for the given
 * property of {@link PasswordRecord}.
 */
export function passwordRecordPropertyValueArb(
  propertyName: keyof PasswordRecord,
): Arbitrary<Uint8Array> {
  switch (propertyName) {
    case "salt": {
      return uint8Array({ minLength: 16, maxLength: 16 });
    }
    case "iv": {
      return uint8Array({ minLength: 12, maxLength: 12 });
    }
    case "authTag": {
      return uint8Array({ minLength: 16, maxLength: 16 });
    }
    case "masterKey": {
      return uint8Array({ minLength: 32, maxLength: 32 });
    }
    case "padding": {
      return uint8Array({ minLength: 52, maxLength: 52 });
    }
    default: {
      assertUnreachable(propertyName, "internal error: invalid propertyName: %s [x5t6f5f2n5]");
    }
  }
}
