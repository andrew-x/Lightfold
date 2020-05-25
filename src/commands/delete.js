import { getInventory, deleteFold } from "../common/fold";
import { error, confirm, success } from "../common/out";

const Delete = async (fold) => {
  const inventory = getInventory();
  if (inventory[fold]) {
    if (await confirm(`are you sure you want to delete ${fold}?`)) {
      deleteFold(fold);
      success(`deleted '${fold}'`);
    }
  } else {
    error(`'${fold}' is not a fold, run 'lfold list' to see available folds`);
  }
};
export default Delete;
