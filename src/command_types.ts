import { type Logger } from "./logging.ts";
import { type PasswordProvider } from "./passwords.ts";

export interface InitArguments {
  file: string;
  passwordProvider: PasswordProvider;
}

export interface CommandFunctionArguments<T> {
  args: T;
  logger: Logger;
}

export type CommandFunction<T> = (arguments_: CommandFunctionArguments<T>) => Promise<void> | void;

export interface Commands {
  init: CommandFunction<InitArguments>;
}
