import path from "node:path";

import { $ } from "bun";

/* eslint-disable no-console */
/* eslint-disable unicorn/no-process-exit */

const cwd = path.normalize(path.join(import.meta.dirname, ".."));

interface Command {
  id: string;
  command: string;
}

interface CommandWithResult extends Command {
  success: boolean;
}

const allCommands: Command[] = [
  { id: "prettier", command: "bun --bun run prettier" },
  { id: "lint", command: "bun --bun run lint" },
  { id: "tsc", command: "bun --bun run tsc" },
  { id: "test", command: "bun test" },
];

function parseArguments(): Command[] {
  const arguments_ = process.argv.slice(2);
  const commands: Command[] = [];
  for (const argument of arguments_) {
    const command = allCommands.find(c => c.id === argument);
    if (!command) {
      const knownCommands = allCommands
        .map(c => c.id)
        .toSorted()
        .join(", ");
      console.error(`❌ ERROR: unknown command: ${argument} (known commands: ${knownCommands})`);
      process.exit(2);
    }
    commands.push(command);
  }
  return commands.length > 0 ? commands : allCommands;
}

const commands = parseArguments();

const divider = "================================================================================";

let successCount = 0;
let failCount = 0;
const results: CommandWithResult[] = [];
for (const command of commands) {
  const { id: commandId, command: commandString } = command;
  console.log(divider);
  console.log(`🏃 Running command ${commandString} (id=${commandId})`);
  const result = await $`${{ raw: commandString }}`.cwd(cwd).nothrow();
  console.log();
  if (result.exitCode === 0) {
    console.log(`✅ ${commandString} (id=${commandId})`);
    successCount++;
    results.push({ ...command, success: true });
  } else {
    console.error(
      `❌ FAILED with non-zero exit code ${result.exitCode}: ` +
        `${commandString} (id=${commandId})`,
    );
    failCount++;
    results.push({ ...command, success: false });
  }
  console.log();
}

console.log(divider);
console.log();
for (const commandWithResults of results) {
  const { id: commandId, command, success } = commandWithResults;
  if (success) {
    console.log(`✅ ${command} (id=${commandId})`);
  } else {
    console.log(`❌ FAILED: ${command} (id=${commandId})`);
  }
}
console.log();
console.log(`${successCount} commands succeeded, ${failCount} commands failed.`);
if (failCount > 0) {
  process.exit(1);
}
