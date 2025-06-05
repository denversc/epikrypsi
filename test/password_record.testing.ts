import { Arbitrary, uint8Array, record } from "fast-check";
import { type PasswordRecord } from "../src/password_record.ts";

/**
 * An arbitrary that generates `PasswordRecord` objects with random data.`
 */
export const passwordRecordArb: Arbitrary<PasswordRecord> = record<PasswordRecord>({
  salt: uint8Array({ minLength: 16, maxLength: 16 }),
  iv: uint8Array({ minLength: 12, maxLength: 12 }),
  authTag: uint8Array({ minLength: 16, maxLength: 16 }),
  masterKey: uint8Array({ minLength: 32, maxLength: 32 }),
  padding: uint8Array({ minLength: 52, maxLength: 52 }),
});
