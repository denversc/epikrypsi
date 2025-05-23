import signale, { type SignaleConfig } from "signale";

export type Logger = {
  info: (...arguments_: unknown[]) => unknown;
  warn: (...arguments_: unknown[]) => unknown;
};

function createSignaleConfig(): SignaleConfig {
  return {
    displayScope: false,
    displayBadge: true,
    displayDate: true,
    displayTimestamp: true,
    displayFilename: false,
    displayLabel: false,
  };
}

let logger: Logger | null = null;

export function getLogger(): Logger {
  if (logger === null) {
    const signaleConfig: SignaleConfig = createSignaleConfig();
    logger = new signale.Signale({ config: signaleConfig });
  }
  return logger;
}
