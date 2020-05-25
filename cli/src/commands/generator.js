import Path from "path";
import FS from "fs";
import FSExtra from "fs-extra";
import { message, error, interrogate, success } from "../common/out";
import { getConfig, writeConfig } from "../common/config";

const GENERATOR_STUB = `
/**
 * This is the entry point to the generator
 * It will be called after files are unzipped.
 *
 * @async
 * @function index
 * @param { object } info - A JSON object containing the same information as a 'lfold info' command
 * @return { Promise<Boolean> } - Whether or not to keep the generator directory. The generator will be deleted by default.
 */
module.exports = async (info) => {
  console.log("hello lightfold generator", info);

  return false;
};
`;

const Generator = async (workingDirectory, name) => {
  const config = getConfig(workingDirectory);
  if (!config) {
    error("missing `lightfold.json` file, did you run 'lfold init'?");
    return;
  }

  let dirName = name;
  if (!name) {
    const directoryFiles = FS.readdirSync(workingDirectory);
    const response = await interrogate([
      {
        id: "name",
        prompt: `What would you like to name the folder that will hold the generator?`,
        default: "lightfold-generator",
        validate: (val) => {
          try {
            const path = Path.normalize(Path.join(workingDirectory, val));
            if (
              Path.dirname(path) !== workingDirectory ||
              directoryFiles.includes(val)
            ) {
              throw new Error();
            }
            return true;
          } catch (err) {
            return "must be a valid folder name that does not conflict with another file/folder in the directory";
          }
        },
      },
    ]);
    dirName = response["name"];
  }

  const dir = Path.join(workingDirectory, dirName);
  FSExtra.ensureDirSync(dir);
  FSExtra.writeJSONSync(Path.join(dir, "package.json"), {
    name: dirName,
    version: "0.0.1",
    description: "a generator for a lightfold fold",
    license: "MIT",
    repository: {},
  });
  FSExtra.writeFileSync(Path.join(dir, "index.js"), GENERATOR_STUB);
  config.generator = dirName;
  writeConfig(config, workingDirectory);

  success(`generator created at '${Path.relative(workingDirectory, dir)}'`);
};
export default Generator;
