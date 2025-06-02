import parseArguments from "./argument_parser.ts";
import getCommands from "./commands.ts";
import { getLogger } from "./logging.ts";

function main(): Promise<void> {
  const logger = getLogger();
  const commands = getCommands();
  return parseArguments(commands, logger);
}

await main();
