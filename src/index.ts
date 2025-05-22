import signale, { type SignaleConfig } from "signale";

const signaleConfig: SignaleConfig = Object.freeze({
  displayScope: false,
  displayBadge: true,
  displayDate: true,
  displayTimestamp: true,
  displayFilename: false,
  displayLabel: false,
});

const logger = new signale.Signale({ config: signaleConfig });

logger.info("Hello World!");

logger.info(globalThis.Bun);
