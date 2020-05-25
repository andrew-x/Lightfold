import { getInventory } from "../common/fold";
import { message, error, info } from "../common/out";

const List = () => {
  const inventory = getInventory();
  const folds = Object.keys(inventory);
  if (folds.length > 0) {
    info("available folds:");
    folds.forEach((x) => message(`• ${x}`));
  } else {
    error("no folds available");
  }
};
export default List;
