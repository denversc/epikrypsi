/**
 * A utility function to ensure exhaustive checks in control flow.
 * Throws an error at runtime if it's ever called.
 * Its primary purpose is to trigger a compile-time error if a variable
 * has not been narrowed to `never`.
 *
 * @param value The variable that should be of type `never`.
 * @param message The message for the thrown exception; any occurrences of `"%s"` are replaced by
 * a debug-friendly string representation of the given `value`.
 */
export function assertUnreachable(value: never, message: string): never {
  throw new Error(message.replace("%s", Bun.inspect(value)));
}
