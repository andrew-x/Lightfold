import Commander from "commander";

import Init from "./commands/init";
import Info from "./commands/info";
import Ignore from "./commands/ignore";
import Attend from "./commands/attend";
import Generator from "./commands/generator";
import Fold from "./commands/fold";
import List from "./commands/list";
import Delete from "./commands/delete";
import Unfold from "./commands/unfold";

import { cleanFolds } from "./common/fold";

let WORKING_DIRECTORY = __dirname;

Commander.version("v1.0.0");
Commander.command("init")
  .description("intializes current directory for folding")
  .action(() => Init(WORKING_DIRECTORY));
Commander.command("info [fold]")
  .description("get config for fold in current directory or fold")
  .action((fold) => Info(WORKING_DIRECTORY, fold));
Commander.command("ignore <path>")
  .description("add relative path to ignore list")
  .action((path) => Ignore(WORKING_DIRECTORY, path));
Commander.command("attend <path>")
  .description("remove relative path from ignore list")
  .action((path) => Attend(WORKING_DIRECTORY, path));
Commander.command("fold")
  .description("package the current directory into a fold")
  .action(() => Fold(WORKING_DIRECTORY));
Commander.command("list")
  .description("list available folds on the system")
  .action(() => List());
Commander.command("delete <fold>")
  .description("delete fold from fold list")
  .action((fold) => Delete(fold));
Commander.command("unfold <fold> [name]")
  .description("unfold with an optional name of output directory")
  .action((fold, name) => Unfold(WORKING_DIRECTORY, fold, name));
Commander.command("generator [name]")
  .description("creates a generator in the root of the directory")
  .action((name) => Generator(WORKING_DIRECTORY, name));

export const cli = (args, cwd) => {
  WORKING_DIRECTORY = cwd;

  cleanFolds();
  Commander.parse(args);
};
