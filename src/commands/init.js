import Path from "path";
import {
  getInitialConfig,
  writeConfig,
  getConfig,
} from "../common/config";
import { message, success, confirm, interrogate } from "../common/out";

const init = async (workingDirectory) => {
  message(`initializing ${workingDirectory}`);

  let currentCheck = !Boolean(getConfig(workingDirectory));
  if (!currentCheck) {
    currentCheck = await confirm(
      `found existing 'lightfold.json' file, would you like to overwrite?`
    );
  }

  if (currentCheck) {
    const answers = await interrogate([
      {
        id: "name",
        prompt: `What would you like to name the fold?`,
        default: Path.basename(workingDirectory),
      },
      {
        id: "description",
        prompt: "Add a description for the fold?",
      },
      {
        id: "version",
        prompt: "Set a version identifier?",
        default: "0.0.1",
      },
    ]);
    const { name, description, version } = answers;
    const config = getInitialConfig(
      name,
      description,
      version,
      workingDirectory
    );
    const foldPath = writeConfig(config, workingDirectory);
    success(`fold initialized, configuration file at 'lightfold.json'`);
    message(config);
  }
};
export default init;
