import Path from "path";
import FS from "fs";
import Rimraf from "rimraf";
import { unfold, getInventory } from "../common/fold";
import { success, error, warn, info } from "../common/out";

const Unfold = async (workingDirectory, fold, name) => {
  const inventory = getInventory()[fold];
  if (inventory) {
    const destination = Path.join(workingDirectory, name || fold);
    if (!FS.existsSync(destination)) {
      info(
        `unfolding '${fold}' to '${Path.relative(
          workingDirectory,
          destination
        )}'`
      );
      unfold(fold, destination);

      if (inventory.generator) {
        const generatorPath = Path.join(destination, inventory.generator);
        if (
          FS.existsSync(generatorPath) &&
          FS.existsSync(Path.join(generatorPath, "index.js"))
        ) {
          const generator = require(Path.join(generatorPath, "index.js"));
          try {
            await generator(inventory, destination);
          } catch (err) {
            error("generator ran into error:", err);
          } finally {
            Rimraf.sync(generatorPath);
            success(`ran generator ${inventory.generator}`);
          }
        } else {
          error("invalid generator");
        }
      }

      success(`unfolded '${fold}' to '${destination}'`);
    } else {
      error(
        `cannot unfold into '${Path.relative(
          workingDirectory,
          destination
        )}', path already exists`
      );
    }
  } else {
    error(`'${fold}' is not a fold, run 'lfold list' to see available folds`);
  }
};
export default Unfold;
