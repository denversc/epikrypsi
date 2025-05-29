import { type Commands } from "./command_types.ts";
import init from "./init_command.ts";

export default function getCommands(): Commands {
  return {
    init,
  };
}
