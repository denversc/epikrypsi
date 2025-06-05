import { assertUnreachable } from "./typing.ts";
import {
  type IncorrectLength,
  type IncorrectType,
  isIncorrectLength,
  isIncorrectType,
  PROPERTY_MISSING,
} from "./validation.ts";

export interface PasswordRecord {
  /** The 16-byte password salt. */
  salt: Uint8Array;
  /** The 12-byte initialization vector for aes-256-gcm. */
  iv: Uint8Array;
  /** The 16-byte authentication tag for aes-256-gcm. */
  authTag: Uint8Array;
  /** The 32-byte encrypted master key. */
  masterKey: Uint8Array;
  /** The 52-byte padding containing random data */
  padding: Uint8Array;
}

const commaSeparatedListFormat = new Intl.ListFormat(undefined, {
  type: "disjunction",
  style: "long",
});

function toCommaSeparatedOrString<T extends string | number>(value: T | T[]): string {
  if (!Array.isArray(value)) {
    return `${value}`;
  }
  return commaSeparatedListFormat.format(value.map(item => `${item}`));
}

/**
 * Asserts that the given value satisfies the {@link PasswordRecord} interface and conforms
 * to all of its requirements, namely, that each {@link Uint8Array} has the expected length.
 *
 * Throws {@link InvalidPasswordRecordError} if the given value is _not_ a valid
 * {@link PasswordRecord}. Returns normally otherwise.
 */
export function assertValidPasswordRecord(value: unknown): asserts value is PasswordRecord {
  const result = validatePasswordRecord(value);
  if (isIncorrectType(result)) {
    throw new InvalidPasswordRecordError(
      `the type of the given value is not compatible with PasswordRecord: ` +
        `${result.actual} (expected: ${toCommaSeparatedOrString(result.expected)}) [cx76rqp7bn]`,
    );
  }
  const errors: string[] = [];

  for (const [propertyName, propertyError] of Object.entries(result)) {
    if (propertyError === PROPERTY_MISSING) {
      errors.push(`property "${propertyName}" is missing [txbb3wetfr]`);
    } else if (isIncorrectType(propertyError)) {
      errors.push(
        `property "${propertyName}" has the wrong type: ` +
          `${propertyError.actual} ` +
          `(expected: ${toCommaSeparatedOrString(propertyError.expected)}) [d435k8gx4v]`,
      );
    } else if (isIncorrectLength(propertyError)) {
      errors.push(
        `property "${propertyName}" has the wrong length: ` +
          `${propertyError.actual} ` +
          `(expected: ${toCommaSeparatedOrString(propertyError.expected)}) [ba8h2qefz5]`,
      );
    } else {
      assertUnreachable(propertyError, "internal error: invalid propertyError: %s [jv7tvgdtcg]");
    }
  }

  if (errors.length > 0) {
    throw new InvalidPasswordRecordError(
      `the given value is not a valid PasswordRecord: ` + `${errors.join("; ")} [z8zh7y6m6z]`,
    );
  }
}

/**
 * The exception thrown by {@link assertValidPasswordRecord} if one or more of
 * its assertion checks fail.
 */
export class InvalidPasswordRecordError extends Error {
  declare readonly name: "InvalidPasswordRecordError";

  constructor(message: string) {
    super(message);
    this.name = "InvalidPasswordRecordError";
    Object.setPrototypeOf(this, InvalidPasswordRecordError.prototype);
  }
}

const passwordRecordProperties: Readonly<
  Array<Readonly<{ propertyName: keyof PasswordRecord; expectedLength: number }>>
> = Object.freeze([
  Object.freeze({ propertyName: "salt", expectedLength: 16 }),
  Object.freeze({ propertyName: "iv", expectedLength: 12 }),
  Object.freeze({ propertyName: "authTag", expectedLength: 16 }),
  Object.freeze({ propertyName: "masterKey", expectedLength: 32 }),
  Object.freeze({ propertyName: "padding", expectedLength: 52 }),
]);

/**
 * The return type from of {@link validatePasswordRecord} that contains validation erorrs
 * for individual properties of the given value.
 *
 * If a property is missing then the value of its corresponding property in {@link PasswordRecord}
 * was valid; otherwise, the value indicates the reason why it was invalid.
 *
 * If this object has no properties then the given value completely satisfied
 * {@link PasswordRecord} and its invariants.
 */
type PasswordRecordPropertyErrors = Partial<
  Record<keyof PasswordRecord, typeof PROPERTY_MISSING | IncorrectLength | IncorrectType>
>;

/**
 * The return type of {@link validatePasswordRecord}.
 *
 * If {@link IncorrectType} then the argument was either `null` or not an `object`.
 * Otherwise, a record of validation errors; if the record has no properties
 * then validation succeeded.
 */
type ValidatePasswordRecordResult = IncorrectType | PasswordRecordPropertyErrors;

function validatePasswordRecord(value: unknown): ValidatePasswordRecordResult {
  if (typeof value !== "object") {
    return { expected: "object", actual: typeof value } satisfies IncorrectType;
  } else if (value === null) {
    return { expected: "object", actual: "null" } satisfies IncorrectType;
  }

  const errors: PasswordRecordPropertyErrors = {};
  for (const { propertyName, expectedLength } of passwordRecordProperties) {
    const error = validatePasswordRecordProperty(value, propertyName, expectedLength);
    if (error) {
      // eslint-disable-next-line security/detect-object-injection
      errors[propertyName] = error;
    }
  }
  return errors;
}

function validatePasswordRecordProperty(
  value: Readonly<Partial<PasswordRecord>>,
  propertyName: keyof PasswordRecord,
  expectedLength: number,
) {
  if (propertyName in value) {
    // eslint-disable-next-line security/detect-object-injection
    const propertyValue = value[propertyName] as unknown;
    if (typeof propertyValue !== "object") {
      return { expected: "object", actual: typeof value } satisfies IncorrectType;
    } else if (propertyValue === null) {
      return { expected: "object", actual: "null" } satisfies IncorrectType;
    } else if (!(propertyValue instanceof Uint8Array)) {
      const constructorName = (value as unknown)?.constructor?.name ?? "<null prototype>";
      return {
        expected: "Uint8Array",
        actual: constructorName,
      } satisfies IncorrectType;
    } else if (propertyValue.length !== expectedLength) {
      return { expected: expectedLength, actual: propertyValue.length } satisfies IncorrectLength;
    }
  } else {
    return PROPERTY_MISSING;
  }
  return null;
}
