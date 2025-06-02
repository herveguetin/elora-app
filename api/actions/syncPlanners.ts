import { CustomContext } from "types";
import { pullPlanners } from "../../modules";
export const run: ActionRun = async (context) => {
  return await pullPlanners(context as unknown as CustomContext);
};
  