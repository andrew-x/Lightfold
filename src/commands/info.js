import Moment from "moment";
import { getConfig } from "../common/config";
import { getInventory } from "../common/fold";
import { error, message, info, warn } from "../common/out";

const Info = (workingDirectory, fold) => {
  if (fold) {
    const inventory = getInventory()[fold];
    if (inventory) {
      info(`info for '${fold}'`);
      if (inventory.createdTime) {
        try {
          const moment = Moment(inventory.createdTime);
          if (moment) {
            inventory.createdTime = moment.format("LLL");
          }
        } catch (err) {
          warn("invalid created time parameter");
        }
      }
      message(inventory);
    } else {
      error(`'${fold}' is not an available fold`);
    }
  } else {
    const config = getConfig(workingDirectory);
    if (config) {
      info(`fold config for '${config.name}':`);
      message(config);
    } else {
      error(`missing 'lightfold.json' file, did you run 'lfold init'?`);
    }
  }
};
export default Info;
