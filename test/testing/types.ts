/**
 * The possible string values resulting from the `typeof` operator.
 */
export type TypeofResult =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function";

/**
 * The list of all possible values of {@link TypeofResult}.
 */
export const allTypeofResults: Readonly<Array<TypeofResult>> = Object.freeze([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "undefined",
  "object",
  "function",
]);
