/**
 * Similar to TypeScript's `Partial<T>` type, but allows properties to be `undefined`.
 */
export type PartialAndUndefined<T> = {
  [P in keyof T]?: T[P] | undefined;
};
