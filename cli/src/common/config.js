import Path from "path";
import FS from "fs";
import FSExtra from "fs-extra";

const FILENAME = "lightfold.json";
const DEFAULT = {
  name: "",
  description: "",
  ignore: [FILENAME],
};

export const getInitialConfig = (name, description, version, path) => {
  let config = {
    ...DEFAULT,
    name,
    description,
    version,
  };
  if (!name && path) {
    const lstat = FS.lstatSync(path);
    if (lstat.isFile()) {
      config.name = Path.dirname(path);
    } else if (lstat.isDirectory()) {
      config.name = Path.basename(path);
    }
  }
  return config;
};

export const writeConfig = (config, path) => {
  let targetPath = null;
  if (Path.basename(path) === FILENAME) {
    targetPath = path;
  } else {
    const lstat = FS.lstatSync(path);
    if (lstat.isDirectory()) {
      targetPath = Path.join(path, FILENAME);
    } else if (lstat.isFile()) {
      targetPath = Path.join(Path.dirname(path), FILENAME);
    } else {
      throw new Error("invalid path to write to");
    }
  }
  FSExtra.writeJSONSync(targetPath, config);
  return targetPath;
};

export const getConfig = (path) => {
  let targetPath = null;
  if (Path.basename(path) === FILENAME && FS.existsSync(path)) {
    targetPath = path;
  } else {
    const lstat = FS.lstatSync(path);
    const joinedPath = Path.join(path, FILENAME);
    if (lstat.isDirectory(path) && FS.existsSync(joinedPath)) {
      targetPath = joinedPath;
    }
  }
  return targetPath
    ? FSExtra.readJSONSync(targetPath, { throws: false }) || {}
    : null;
};
