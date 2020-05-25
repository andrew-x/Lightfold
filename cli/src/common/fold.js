import Path from "path";
import FS from "fs";
import FSExtra from "fs-extra";
import Moment from "moment";
import OS from "os";
import Zip from "adm-zip";

const COREPATH = Path.join(OS.homedir(), ".lightfold");
const INVENTORYPATH = Path.join(COREPATH, ".inventory");

export const getInventory = () => {
  FSExtra.ensureFileSync(INVENTORYPATH);
  return FSExtra.readJSONSync(INVENTORYPATH, { throws: false }) || {};
};

export const writeInventory = (inventory) => {
  return FSExtra.writeJSONSync(INVENTORYPATH, inventory);
};

export const cleanFolds = () => {
  const inventory = getInventory();
  const packs = FS.readdirSync(COREPATH).filter(
    (x) => Path.extname(x) === ".zip"
  );
  packs
    .filter((p) => !Boolean(inventory[Path.basename(p, ".zip")]))
    .forEach((p) => FS.unlinkSync(Path.resolve(COREPATH, p)));
  Object.keys(inventory)
    .filter((k) => !packs.includes(`${k}.zip`))
    .forEach((k) => delete inventory[k]);
  writeInventory(inventory);
};

export const getFolds = () => {
  FSExtra.ensureDirSync(COREPATH);
  return FS.readdirSync(COREPATH)
    .filter((x) => Path.extname(x) === "zip")
    .map((x) => Path.basename(x));
};

export const addFold = (
  name,
  description,
  version,
  generator,
  files,
  onAdd
) => {
  FSExtra.ensureDirSync(COREPATH);
  const packPath = Path.join(COREPATH, `${name}.zip`);
  if (FS.existsSync(packPath)) {
    FS.unlinkSync(packPath);
  }
  const zip = new Zip();
  files.forEach((x) => {
    if (onAdd) {
      onAdd(x);
    }
    zip.addLocalFile(x.absolute, Path.dirname(x.relative));
  });
  zip.writeZip(packPath);

  const inventory = getInventory();
  inventory[name] = {
    name,
    createdTime: Moment.utc().format(),
    description,
    version,
    generator,
    packPath,
  };
  writeInventory(inventory);
  return inventory[name];
};

export const deleteFold = (name) => {
  const inventory = getInventory();
  delete inventory[name];
  FS.unlinkSync(Path.join(COREPATH, `${name}.zip`));
  writeInventory(inventory);
};

export const unfold = (name, destination) => {
  const zip = new Zip(Path.join(COREPATH, `${name}.zip`));
  zip.extractAllTo(destination);
};
