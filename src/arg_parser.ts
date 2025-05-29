import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { version } from "../package.json" with { type: "json" };
import { type Logger } from "./logging.ts";
import { ConstantPasswordProvider, ReadlinePasswordProvider } from "./passwords.ts";
import { type Commands } from "./command_types.ts";

export default async function parseArgs(commands: Commands, logger: Logger): Promise<void> {
  const yargsParser = yargs(hideBin(process.argv))
    .scriptName("epk")
    .version(version)
    .usage("Usage: $0 <command> [options]")
    .command({
      command: "init <file>",
      describe: "Create a new Epikrypsi volume",
      builder: yargs =>
        yargs
          .positional("file", {
            type: "string",
            describe: "The file to create",
            demandOption: true,
          })
          .option("password", {
            alias: "p",
            string: true,
            describe: "The password to use for the new Epikrypsi volume",
          }),
      handler: argv => {
        const { file, password } = argv;
        const passwordProvider = passwordProviderFromArguments({ password }, logger);
        return commands.init({ args: { file, passwordProvider }, logger });
      },
    })
    .showHelpOnFail(false, "Specify --help for help")
    .strict();

  const parsedArguments = await yargsParser.parse();

  if (parsedArguments._.length === 0) {
    yargsParser.showHelp("log");
  }
}

function passwordProviderFromArguments(
  arguments_: {
    password: string | undefined;
  },
  logger: Logger,
) {
  const { password } = arguments_;
  const trimmedPassword = password?.trim();
  if (typeof trimmedPassword === "string" && trimmedPassword.length > 0) {
    logger.warn(
      `WARNING: specifying a password on the command line is insecure and should not be done ` +
        `with real passwords that require secrecy. This is because command line arguments are ` +
        `often stored in plain text in "history" files by shells, and also are usually visible ` +
        `by all users in the operating system's list of processes, such as the output of the ` +
        `"top" and "ps" commands on Linux. Prefer using an interactive prompt instead.`,
    );
    return new ConstantPasswordProvider(trimmedPassword);
  }
  return new ReadlinePasswordProvider({ input: process.stdin, output: process.stdout });
}
