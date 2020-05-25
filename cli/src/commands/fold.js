import FS from "fs";
import Path from "path";

import { getConfig } from "../common/config";
import { message, error, success, confirm } from "../common/out";
import { addFold, getInventory } from "../common/fold";

const _getFilePaths = (path, ignore) => {
  const files = [];
  const candidates = FS.readdirSync(path);

  candidates
    .map((x) => Path.resolve(path, x))
    .filter((x) => !(ignore || []).includes(x))
    .forEach((candidate) => {
      const lstat = FS.lstatSync(candidate);
      if (lstat.isFile()) {
        files.push(candidate);
      } else if (lstat.isDirectory()) {
        files.push(..._getFilePaths(candidate, ignore));
      }
    });
  return files;
};

const _checkConfig = (config, workingDirectory) => {
  if (!config) {
    return "missing 'lightfold.json' file, did you run 'lfold init'?";
  }
  const { name, description, ignore, generator } = config;
  if (!name || typeof name !== "string") {
    return "name of fold must be a non-empty string";
  }
  if (description && typeof description !== "string") {
    return "description must be a string";
  }
  if (
    ignore &&
    (!Array.isArray(ignore) || ignore.some((x) => typeof x !== "string"))
  ) {
    return "ignore list must be a list of relative file paths as strings";
  }
  if (
    generator &&
    (typeof generator !== "string" ||
      !FS.existsSync(Path.resolve(workingDirectory, generator)))
  ) {
    return "generator must be a string path to an existing directory in the same directory as 'lightfold.json'";
  }
  return;
};

const fold = async (workingDirectory) => {
  message(`folding ${workingDirectory}`);
  const config = getConfig(workingDirectory);
  const err = _checkConfig(config, workingDirectory);
  if (err) {
    error(err);
    return;
  }

  let inventoryCheck = !Boolean(getInventory()[config.name]);
  if (!inventoryCheck) {
    inventoryCheck = await confirm(
      `'${config.name}' already exists, would you like to replace it? Run 'lfold list' to see existing folds`
    );
  }
  if (inventoryCheck) {
    const paths = _getFilePaths(
      workingDirectory,
      (config.ignore || []).map((x) => Path.resolve(workingDirectory, x))
    ).map((x) => ({
      absolute: x,
      relative: Path.relative(workingDirectory, x),
    }));
    const inventory = addFold(
      config.name,
      config.description || "",
      config.version || "",
      config.generator || "",
      paths,
      (x) => message(`folding ${x.relative}`)
    );
    success(`created fold: ${inventory.name}`);
    message(inventory);
  }
};

export default fold;
