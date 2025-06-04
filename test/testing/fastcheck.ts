import { anything, type Arbitrary, array, type ArrayConstraints } from "fast-check";

export function nonEmptyArray<T>(
  arb: Arbitrary<T>,
  constraints?: Omit<ArrayConstraints, "minLength">,
): Arbitrary<[T, ...T[]]> {
  const effectiveConstraints: ArrayConstraints = { ...constraints, minLength: 1 };
  return array(arb, effectiveConstraints) as Arbitrary<[T, ...T[]]>;
}

export function notString(): Arbitrary<Exclude<unknown, string>> {
  return anything().filter(value => typeof value !== "string");
}

export function notNumber(): Arbitrary<Exclude<unknown, number>> {
  return anything().filter(value => typeof value !== "number");
}
