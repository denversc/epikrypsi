import { read } from "read";

import { type PartialAndUndefined } from "./utility_types.ts";

export interface PasswordProvider {
  getPassword(options?: PartialAndUndefined<GetPasswordOptions>): Promise<string>;
}

export interface GetPasswordOptions {
  prompt: string;
}

export function resolveGetPasswordOptions(
  options?: PartialAndUndefined<GetPasswordOptions>,
): GetPasswordOptions {
  const { prompt } = options ?? {};
  return {
    prompt: prompt ?? "Enter password",
  };
}

export class ConstantPasswordProvider implements PasswordProvider {
  #password: string;

  constructor(password: string) {
    this.#password = password;
  }

  getPassword(): Promise<string> {
    return Promise.resolve(this.#password);
  }
}

export class ReadlinePasswordProvider implements PasswordProvider {
  #input: NodeJS.ReadableStream;
  #output: NodeJS.WritableStream;

  constructor(arguments_: { input: NodeJS.ReadableStream; output: NodeJS.WritableStream }) {
    const { input, output } = arguments_;
    this.#input = input;
    this.#output = output;
  }

  async getPassword(options?: PartialAndUndefined<GetPasswordOptions>): Promise<string> {
    const { prompt } = resolveGetPasswordOptions(options);
    const userInput = await read({
      input: this.#input,
      output: this.#output,
      prompt: `${prompt}: `,
      silent: true,
    });

    const password = userInput.trim();
    if (password.length === 0) {
      throw new GetPasswordCancelledError("password cannot be empty");
    }

    return password;
  }
}

export class GetPasswordCancelledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetPasswordCancelledError";
  }
}
