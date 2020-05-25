import Path from "path";
import FS from "fs";
import Inquirer from "inquirer";
import Handlebars from "handlebars";

const _editFile = (path, data) => {
  if (FS.existsSync(path)) {
    const original = FS.readFileSync(path, "utf-8");
    const handle = Handlebars.compile(original);
    const templated = handle(data);
    FS.writeFileSync(path, templated);
  }
};

/**
 * This is the entry point to the generator
 * It will be called after files are unzipped.
 *
 * @async
 * @function index
 * @param { object } info - A JSON object containing the same information as a 'lfold info' command
 * @param { string } rootPath - A path to the root of the unfolded directory
 * @return { Promise<Boolean> } - Whether or not to keep the generator directory. The generator will be deleted by default.
 */
module.exports = async (info, rootPath) => {
  const responses = await Inquirer.prompt([
    {
      type: "input",
      name: "name",
      default: Path.basename(rootPath),
      message: "what would you like to name the project?",
    },
    {
      type: "input",
      name: "description",
      default: "",
      message: "what is a short description of the project?",
    },
  ]);

  const packagePath = Path.join(rootPath, "package.json");
  _editFile(packagePath, responses);

  const indexPath = Path.join(rootPath, "public", "index.html");
  _editFile(indexPath, responses);

  const manifestPath = Path.join(rootPath, "public", "manifest.json");
  _editFile(manifestPath, responses);

  return false;
};
