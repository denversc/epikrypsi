import crypto from "node:crypto";
import fs from "node:fs/promises";

import type { CommandFunctionArguments, InitArguments } from "./command_types.ts";
import { AsyncDisposableStack } from "./disposable.ts";

export default async function runInitCommand(
  arguments_: CommandFunctionArguments<InitArguments>,
): Promise<void> {
  const {
    args: { file, passwordProvider },
    logger,
  } = arguments_;
  await using asyncDisposableStack = new AsyncDisposableStack();

  const password = await passwordProvider.getPassword({
    prompt: "Enter the password for the new Epikrypsi volume",
  });

  logger.info(`Creating a new Epikrypsi volume: ${file}`);

  const f = await fs.open(file, "wx");
  asyncDisposableStack.adopt(f, f => f.close());

  const initialData = crypto.randomBytes(4096 * 3);
  await f.write(initialData);
  await f.write(new TextEncoder().encode(password));

  logger.info(`Created new Epikrypsi volume: ${file}`);
}
