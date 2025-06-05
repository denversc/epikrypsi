import { type Arbitrary, record, uint8Array, constantFrom } from "fast-check";


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

/**
 * The reason that the value of a {@link PasswordRecord} property is invalid.
 */
export type PasswordRecordPropertyValidity = 
  
  /**
   * The value is in fact valid; that is, it is an instance of
   * {@link Uint8Array} with the expected length.
   */
  | "valid"
  
  /**
   * The property is missing, and is not present on the object.
   */
  | "missing"
  
  /**
   * The type of the value, according to the `typeof` operator` is incorrect;
   * that is, it is something other than `"object"`.
   */
  | "incorrect typeof"
  
  /**
   * The value does not satisfy `instanceof Uint8Array`.
   */
  | "incorrect instanceof"
  
  /**
   * The value is indeed a {@link Uint8Array} but its length differs from the
   * expected length.
   */
  | "incorrect length";

/**
 * The set of all valid values for {@link PasswordRecordPropertyValidity}.
 */
export const allPasswordRecordPropertyValidities: readonly PasswordRecordPropertyValidity[] = [
  "valid",
  "missing",
  "incorrect instanceof",
  "incorrect length",
];

/**
 * An {@link Arbitrary} that generates all {@link PasswordRecordPropertyValidity} values
 * with equal probability.
 */
export const passwordRecordPropertyValidityArb: Arbitrary<PasswordRecordPropertyValidity> = constantFrom(...allPasswordRecordPropertyValidities);

/**
 * An {@link Arbitrary} that produces objects with the all of the properties defined by
 * {@link PasswordRecord} but with {@link PasswordRecordPropertyValidity} values.
 * 
 * This can be useful
 */
export const passwordRecordWithValiditiesArb: Arbitrary<Record<keyof PasswordRecord, PasswordRecordPropertyValidity>> =
  record({
    salt: passwordRecordPropertyValidityArb,
    iv: passwordRecordPropertyValidityArb,
    authTag: passwordRecordPropertyValidityArb,
    masterKey: passwordRecordPropertyValidityArb,
    padding: passwordRecordPropertyValidityArb,
  })

/**
 * An {@link Arbitrary} that produces non-null objects where one, or more, of
 * its properties violate the requirements of {@link PasswordRecord}.
 */
const passwordRecordWithInvalidPropertiesArb = fc
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
          recordSpec[propertyName] = absolutelyAnything().filter(
            item => !(item instanceof Uint8Array),
          );
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
