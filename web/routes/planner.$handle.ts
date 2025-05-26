import { AmbientContextFunctionArgs } from "types";
import { authenticateAppProxy, getPlannerByAttribute, getShopifyPlanner } from "../../modules";

export async function loader({ request, params, context }: AmbientContextFunctionArgs) {
  authenticateAppProxy({ request, context });
  const handle = params.handle;
  try {
    const planner = await getPlannerByAttribute(context, "handle", handle);
    const shopifyPlanner = await getShopifyPlanner(context, planner.gid);
    return { ...shopifyPlanner, handle };
  } catch (error) {
    // Planner does not exist
    return null;
  }
}
