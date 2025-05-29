import { type Logger } from "./logging.ts";
import { type PasswordProvider } from "./passwords.ts";

export namespace Arguments {
  export interface Init {
    file: string;
    passwordProvider: PasswordProvider;
  }
}

export type CommandFunctionArguments<T> = { args: T; logger: Logger };

export type CommandFunction<T> = (arguments_: CommandFunctionArguments<T>) => Promise<void> | void;

export interface Commands {
  init: CommandFunction<Arguments.Init>;
}
