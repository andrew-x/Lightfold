import Path from "path";
import { getConfig, writeConfig } from "../common/config";
import { error, success } from "../common/out";

const Attend = (workingDirectory, path) => {
  const config = getConfig(workingDirectory);
  if (config) {
    const normalized = Path.normalize(path);
    const ignore = config.ignore || [];
    config.ignore = [...ignore.filter((x) => x != normalized)];
    writeConfig(config, workingDirectory);
    success(`removed '${normalized}' from ignore list`);
  } else {
    error(`missing 'lightfold.json' file, did you run 'lfold init'?`);
  }
};
export default Attend;
