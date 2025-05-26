import { AmbientContextFunctionArgs } from "types";
import { authenticateAppProxy, getPlannerByAttribute, getPlanners, getShopifyPlanner } from "../../modules";

export async function loader({ request, context }: AmbientContextFunctionArgs) {
  authenticateAppProxy({ request, context });
  try {
    return await getPlanners(context);
  } catch (error) {
    // Planner does not exist
    return null;
  }
}
