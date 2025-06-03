/**
 * Escapes all special regular expression characters in the given string.
 * @param s The string whose special regular expression characters to escape.
 * @returns The given string with special regular expression characters escaped.
 */
export function escaped(s: string): string {
  // @ts-expect-error The typings do not yet include RegExp.escape(), but it DOES exist.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
  return RegExp.escape(s);
}
