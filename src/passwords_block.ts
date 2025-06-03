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
