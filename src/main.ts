import { getLogger, type Logger } from "./logging.ts";
import getCommands from "./commands.ts";
import parseArgs from "./arg_parser.ts";

function main(): Promise<void> {
  const logger = getLogger();
  const commands = getCommands();
  return parseArgs(commands, logger);
}

await main();
