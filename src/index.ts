import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { version } from "../package.json" with { type: "json" };
import { getLogger, type Logger } from "./logging.ts";

export async function main(): Promise<void> {
  const logger = getLogger();

  await yargs(hideBin(process.argv))
    .scriptName("epk")
    .version(version)
    .usage("Usage: $0 <command> [options]")
    .command(initCommand({ logger }))
    .showHelpOnFail(true)
    .strict()
    .parse();
}

function initCommand(arguments_: { logger: Logger }) {
  const { logger } = arguments_;
  return {
    command: "init",
    describe: "Create a new Epikrypsi volume",
    handler: async () => {
      logger.info("Creating a new Epikrypsi volume...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      logger.info("Creating a new Epikrypsi volume DONE!");
    },
  };
}
