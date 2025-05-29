import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { version } from "../package.json" with { type: "json" };
import { type Logger } from "./logging.ts";
import { ConstantPasswordProvider, ReadlinePasswordProvider } from "./passwords.ts";
import { type Commands } from "./command_types.ts";

export default async function parseArgs(commands: Commands, logger: Logger): Promise<void> {
  const yargsParser = yargs(hideBin(process.argv));

  const yargsCommands = yargsParser
    .scriptName("epk")
    .usage("Usage: $0 <command> [options]")
    .version(version)
    .strict()
    .showHelpOnFail(false, "Specify --help for help")
    .epilogue(`Each boolean argument can be negated by prefixing it with "no-".`)
    .wrap(yargsParser.terminalWidth())
    .command({
      command: "init <file> [options]",
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
          })
          .option("warn-about-password-on-command-line", {
            boolean: true,
            default: true,
            describe:
              "Whether to emit a warning when the --password command-line argument is used.",
          }),
      handler: argv => {
        const { file, password, warnAboutPasswordOnCommandLine } = argv;
        const passwordProvider = passwordProviderFromArguments(
          { password, warnAboutPasswordOnCommandLine },
          logger,
        );
        return commands.init({ args: { file, passwordProvider }, logger });
      },
    });

  // Parse the arguments and run the corresponding command.
  const parsedArguments = await yargsCommands.parse();

  // If no command was specified, just show the help screen then exit.
  if (parsedArguments._.length === 0) {
    yargsParser.showHelp("log");
  }
}

function passwordProviderFromArguments(
  arguments_: {
    password: string | undefined;
    warnAboutPasswordOnCommandLine: boolean;
  },
  logger: Logger,
) {
  const { password, warnAboutPasswordOnCommandLine } = arguments_;
  const trimmedPassword = password?.trim();
  if (typeof trimmedPassword === "string" && trimmedPassword.length > 0) {
    if (warnAboutPasswordOnCommandLine) {
      logger.warn(
        `WARNING: specifying a password on the command line is insecure and should not be done ` +
          `with real passwords that require secrecy. This is because command line arguments ` +
          `are often stored in plain text in "history" files by shells, and also are usually ` +
          `visible by all users in the operating system's list of processes, such as the ` +
          `output of the "top" and "ps" commands on Linux. Prefer using an interactive prompt ` +
          `instead.`,
      );
    }
    return new ConstantPasswordProvider(trimmedPassword);
  }
  return new ReadlinePasswordProvider({ input: process.stdin, output: process.stdout });
}
