/**
 * A validation result indicating the a required property on an object is missing.
 */
export const PROPERTY_MISSING: unique symbol = Symbol("PROPERTY_MISSING");

/**
 * A validation result indicating that a property has an incorrect type.
 */
export interface IncorrectType {
  expected: string | [string, ...string[]];
  actual: string;
}

/**
 * Determines whether a value satisfies the {@link IncorrectType} interface.
 * @param value the value to check.
 * @returns true if, and only if, the given value is a non-null object that defines the properties
 * specified in the {@link IncorrectType} interface with the correct types.
 */
export function isIncorrectType(value: unknown): value is IncorrectType {
  if (typeof value !== "object") {
    return false;
  }
  if (value === null) {
    return false;
  }
  if (!("expected" in value && "actual" in value)) {
    return false;
  }
  if (Array.isArray(value.expected)) {
    if (value.expected.length === 0) {
      return false;
    }
    if (!value.expected.every(item => typeof item === "string")) {
      return false;
    }
  } else if (typeof value.expected !== "string") {
    return false;
  }
  if (typeof value.actual !== "string") {
    return false;
  }
  return true;
}

/**
 * A validation result indicating that a property has an incorrect length.
 */
export interface IncorrectLength {
  expected: number | [number, ...number[]];
  actual: number;
}

/**
 * Determines whether a value satisfies the {@link IncorrectLength} interface.
 * @param value the value to check.
 * @returns true if, and only if, the given value is a non-null object that defines the properties
 * specified in the {@link IncorrectLength} interface with the correct types.
 */
export function isIncorrectLength(value: unknown): value is IncorrectLength {
  if (typeof value !== "object") {
    return false;
  }
  if (value === null) {
    return false;
  }
  if (!("expected" in value && "actual" in value)) {
    return false;
  }
  if (Array.isArray(value.expected)) {
    if (value.expected.length === 0) {
      return false;
    }
    if (!value.expected.every(item => typeof item === "number")) {
      return false;
    }
  } else if (typeof value.expected !== "number") {
    return false;
  }
  if (typeof value.actual !== "number") {
    return false;
  }
  return true;
}
