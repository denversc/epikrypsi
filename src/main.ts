import crypto from "node:crypto";
import fs from "node:fs/promises";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { version } from "../package.json" with { type: "json" };
import { getLogger, type Logger } from "./logging.ts";

export async function main(): Promise<void> {
  const logger = getLogger();

  const yargsParser = yargs(hideBin(process.argv))
    .scriptName("epk")
    .version(version)
    .usage("Usage: $0 <command> [options]")
    .command({
      command: "init <file>",
      describe: "Create a new Epikrypsi volume",
      builder: yargs =>
        yargs.positional("file", {
          type: "string",
          describe: "The file to create",
          demandOption: true,
        }),
      handler: argv => {
        const { file } = argv;
        return runInitCommand({ logger, file });
      },
    })
    .showHelpOnFail(false, "Specify --help for help")
    .strict();

  const parsedArguments = await yargsParser.parse();

  if (parsedArguments._.length === 0) {
    yargsParser.showHelp("log");
  }
}

class DisposableFileHandle {
  #fileHandle: fs.FileHandle;

  constructor(fileHandle: fs.FileHandle) {
    this.#fileHandle = fileHandle;
  }

  close(): Promise<void> {
    console.log("Closing file handle");
    return this.#fileHandle.close();
  }

  [Symbol.asyncDispose](): Promise<void> {
    return this.close();
  }
}

async function runInitCommand(arguments_: { logger: Logger; file: string }): Promise<void> {
  const { logger, file } = arguments_;
  logger.info(`Creating a new Epikrypsi volume: ${file}`);

  const f = await fs.open(file, "wx");
  await using x = new DisposableFileHandle(f);

  const initialData = crypto.randomBytes(4096 * 3);
  f.write(initialData);

  logger.info(`Created new Epikrypsi volume: ${file}`);
}

if (import.meta.main) {
  await main();
}
