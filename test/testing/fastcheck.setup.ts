import { beforeAll } from "bun:test";
import { configureGlobal } from "fast-check";

// Opt-in to including the root cause in the error message.
//
// Without this setting enabled, errors are attached as the "cause" property of the thrown
// exception only; however, `bun test` does NOT include the "cause" in its error output, which
// largely obscures the root cause of a test failure. By including it, the output from `bun test`
// for failed test _includes_ the root cause of the test failure.
beforeAll(() => {
  configureGlobal({ includeErrorInReport: true });
});
