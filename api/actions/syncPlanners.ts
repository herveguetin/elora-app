import { pullPlanners } from "../../modules";
export const run: ActionRun = async (context) => {
  return await pullPlanners(context);
};
