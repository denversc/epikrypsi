interface PasswordRecord {
  /** The 16-byte password salt. */
  salt: Uint8Array;
  /** The 12-byte initialization vector for aes-256-gcm. */
  iv: Uint8Array;
  /** The 16-byte authentication tag for aes-256-gcm. */
  authTag: Uint8Array;
  /** The 32-byte encrypted master key. */
  masterKey: Uint8Array;
}

export function* passwordRecordsFromPasswordBlock(block: Uint8Array): Generator<PasswordRecord> {
  if (block.length !== PASSWORD_BLOCK_SIZE) {
    throw new Error(
      `unexpected block.length for password block: ${block.length} ` +
        `(expected: ${PASSWORD_BLOCK_SIZE}) [mtcbkdmenk]`,
    );
  }

  const numberRecords = block.length / PASSWORD_RECORD_SIZE;
  if (numberRecords !== NUM_PASSWORD_RECORDS_PER_BLOCK) {
    throw new Error(
      `unexpected numRecords in block: ${numberRecords} ` +
        `(expected: ${NUM_PASSWORD_RECORDS_PER_BLOCK}) [paczxbgbv7]`,
    );
  }

  for (let index = 0; index < numberRecords; index++) {
    const offset = index * PASSWORD_RECORD_SIZE;
    const saltOffset = offset + SALT_OFFSET;
    const ivOffset = offset + IV_OFFSET;
    const authTagOffset = offset + AUTH_TAG_OFFSET;
    const masterKeyOffset = offset + MASTER_KEY_OFFSET;
    yield {
      salt: block.slice(saltOffset, saltOffset + SALT_SIZE),
      iv: block.slice(ivOffset, ivOffset + IV_SIZE),
      authTag: block.slice(authTagOffset, authTagOffset + AUTH_TAG_SIZE),
      masterKey: block.slice(masterKeyOffset, masterKeyOffset + MASTER_KEY_SIZE),
    };
  }
}

const PASSWORD_BLOCK_SIZE = 4096 as const;
const PASSWORD_RECORD_SIZE = 128 as const;
const NUM_PASSWORD_RECORDS_PER_BLOCK = 32 as const;
const SALT_SIZE = 16 as const;
const IV_SIZE = 12 as const;
const AUTH_TAG_SIZE = 16 as const;
const MASTER_KEY_SIZE = 32 as const;
const SALT_OFFSET = 0 as const;
const IV_OFFSET = SALT_OFFSET + SALT_SIZE;
const AUTH_TAG_OFFSET = IV_OFFSET + IV_SIZE;
const MASTER_KEY_OFFSET = AUTH_TAG_OFFSET + AUTH_TAG_SIZE;
