import { type IncorrectLength, type IncorrectType, PROPERTY_MISSING } from "./validation.ts";

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
export type PasswordRecordPropertyErrors = Partial<
  Record<keyof PasswordRecord, typeof PROPERTY_MISSING | IncorrectLength | IncorrectType>
>;

/**
 * The return type of {@link validatePasswordRecord}.
 *
 * If {@link IncorrectType} then the argument was either `null` or not an `object`.
 * Otherwise, a record of validation errors; if the record has no properties
 * then validation succeeded.
 */
export type ValidatePasswordRecordResult = IncorrectType | PasswordRecordPropertyErrors;

export function validatePasswordRecord(value: unknown): ValidatePasswordRecordResult {
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
      return { expected: "Uint8Array", actual: value.constructor.name } satisfies IncorrectType;
    } else if (propertyValue.length !== expectedLength) {
      return { expected: "Uint8Array", actual: value.constructor.name } satisfies IncorrectType;
    }
  } else {
    return PROPERTY_MISSING;
  }
  return null;
}

export function passwordRecordsFromBlock(block: Uint8Array): PasswordRecord[] {
  if (block.length !== PASSWORD_BLOCK_SIZE) {
    throw new Error(
      `invalid block.length: ${block.length} (expected: ${PASSWORD_BLOCK_SIZE}) [mtcbkdmenk]`,
    );
  }

  const records: PasswordRecord[] = [];
  for (let recordIndex = 0; recordIndex < NUM_PASSWORD_RECORDS_PER_BLOCK; recordIndex++) {
    const offset = recordIndex * PASSWORD_RECORD_SIZE;
    const saltOffset = offset + SALT_OFFSET;
    const ivOffset = offset + IV_OFFSET;
    const authTagOffset = offset + AUTH_TAG_OFFSET;
    const masterKeyOffset = offset + MASTER_KEY_OFFSET;
    const paddingOffset = offset + PADDING_OFFSET;
    const record = {
      salt: block.subarray(saltOffset, saltOffset + SALT_SIZE),
      iv: block.subarray(ivOffset, ivOffset + IV_SIZE),
      authTag: block.subarray(authTagOffset, authTagOffset + AUTH_TAG_SIZE),
      masterKey: block.subarray(masterKeyOffset, masterKeyOffset + MASTER_KEY_SIZE),
      padding: block.subarray(paddingOffset, paddingOffset + PADDING_SIZE),
    };
    records.push(record);
  }

  return records;
}

export function passwordBlockFromRecords(records: PasswordRecord[]): Uint8Array {
  if (records.length !== NUM_PASSWORD_RECORDS_PER_BLOCK) {
    throw new Error(
      `invalid records.length: ${records.length} ` +
        `(expected: ${NUM_PASSWORD_RECORDS_PER_BLOCK}) [e9eww6vpbx]`,
    );
  }

  const block = new Uint8Array(PASSWORD_BLOCK_SIZE);

  for (const [index, record] of records.entries()) {
    const offset = index * PASSWORD_RECORD_SIZE;
    block.set(record.salt, offset + SALT_OFFSET);
    block.set(record.iv, offset + IV_OFFSET);
    block.set(record.authTag, offset + AUTH_TAG_OFFSET);
    block.set(record.masterKey, offset + MASTER_KEY_OFFSET);
    block.set(record.padding, offset + PADDING_OFFSET);
  }

  return block;
}

const PASSWORD_BLOCK_SIZE = 4096 as const;
const PASSWORD_RECORD_SIZE = 128 as const;
const NUM_PASSWORD_RECORDS_PER_BLOCK = 32 as const;

const SALT_SIZE = 16 as const;
const IV_SIZE = 12 as const;
const AUTH_TAG_SIZE = 16 as const;
const MASTER_KEY_SIZE = 32 as const;
const PADDING_SIZE = 52 as const;

const SALT_OFFSET = 0 as const;
const IV_OFFSET = SALT_OFFSET + SALT_SIZE;
const AUTH_TAG_OFFSET = IV_OFFSET + IV_SIZE;
const MASTER_KEY_OFFSET = AUTH_TAG_OFFSET + AUTH_TAG_SIZE;
const PADDING_OFFSET = MASTER_KEY_OFFSET + MASTER_KEY_SIZE;
