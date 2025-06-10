import { type Arbitrary, constant,constantFrom, object, record, uint8Array } from "fast-check";

import { type PasswordRecord } from "../src/password_record.ts";
import { assertUnreachable } from "../src/typing.ts";
import { notObject } from "./testing/fastcheck.ts";

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
 * An {@link Arbitrary} that generates valid {@link PasswordRecord} objects with random data.`
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
  assertIsPasswordRecordPropertyName(propertyName);
  const length = PasswordRecordArrayLengths[propertyName];
  return uint8Array({ minLength: length, maxLength: length });
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
export const allPasswordRecordPropertyValidities: readonly PasswordRecordPropertyValidity[] =
  Object.freeze([
    "valid",
    "missing",
    "incorrect typeof",
    "incorrect instanceof",
    "incorrect length",
  ]);

/**
 * Asserts that a given value is one of the valid values for
 * {@link PasswordRecordPropertyValidity}.
 */
export function assertIsPasswordRecordPropertyValidity(
  value: unknown,
): asserts value is PasswordRecordPropertyValidity {
  if (!(allPasswordRecordPropertyValidities as unknown[]).includes(value)) {
    throw new Error(`invalid PasswordRecordPropertyValidity: ${Bun.inspect(value)} [m99qah7kf6]`);
  }
}

/**
 * An {@link Arbitrary} that generates all {@link PasswordRecordPropertyValidity} values
 * with equal probability.
 */
export const passwordRecordPropertyValidityArb: Arbitrary<PasswordRecordPropertyValidity> =
  constantFrom(...allPasswordRecordPropertyValidities);

/**
 * An {@link Arbitrary} that produces objects with the all of the properties defined by
 * {@link PasswordRecord} but with {@link PasswordRecordPropertyValidity} values.
 */
export function passwordRecordWithValiditiesArb(options: {
  minInvalidCount: number;
}): Arbitrary<Record<keyof PasswordRecord, PasswordRecordPropertyValidity>> {
  const { minInvalidCount } = options;

  function filterValidities(
    validities: Record<keyof PasswordRecord, PasswordRecordPropertyValidity>,
  ): boolean {
    const invalidCount = Object.values(validities).filter(value => value !== "valid").length;
    if (invalidCount < minInvalidCount) {
      return false;
    }
    return true;
  }

  return record({
    salt: passwordRecordPropertyValidityArb,
    iv: passwordRecordPropertyValidityArb,
    authTag: passwordRecordPropertyValidityArb,
    masterKey: passwordRecordPropertyValidityArb,
    padding: passwordRecordPropertyValidityArb,
  }).filter(filterValidities);
}

function arbitraryForValidity(
  propertyName: keyof PasswordRecord,
  validity: PasswordRecordPropertyValidity,
): Arbitrary<unknown> | undefined {
  switch (validity) {
    case "valid": {
      return passwordRecordPropertyValueArb(propertyName);
    }
    case "missing": {
      return undefined;
    }
    case "incorrect typeof": {
      return notObject();
    }
    case "incorrect instanceof": {
      return object().filter(item => !(item instanceof Uint8Array));
    }
    case "incorrect length": {
      const correctLength = PasswordRecordArrayLengths[propertyName];
      return uint8Array().filter(array => array.length !== correctLength);
    }
    default: {
      assertUnreachable(validity, "internal error: invalid validity: %s [wx5zaea8n3]");
    }
  }
}

/**
 * An {@link Arbitrary} that produces non-null objects where one, or more, of
 * its properties violate the requirements of {@link PasswordRecord}.
 */
export const passwordRecordWithInvalidPropertiesArb: Arbitrary<{
  validities: Record<keyof PasswordRecord, PasswordRecordPropertyValidity>;
  passwordRecord: Partial<Record<keyof PasswordRecord, unknown>>;
}> = passwordRecordWithValiditiesArb({ minInvalidCount: 1 }).chain(validities => {
  const recordSpec: Partial<Record<keyof PasswordRecord, Arbitrary<unknown>>> = {};
  for (const [propertyName, validity] of Object.entries(validities)) {
    assertIsPasswordRecordPropertyName(propertyName);
    const propertyArb = arbitraryForValidity(propertyName, validity);
    if (propertyArb) {
      recordSpec[propertyName] = propertyArb;
    }
  }
  return record({
    validities: constant(validities),
    passwordRecord: record(recordSpec),
  });
});
