import { CustomFunctionArgs } from "types";
import { getPlannerByAttribute, getShopifyPlanner, makeAuthContext } from "../../modules";

export async function loader({ request, params, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });

  const handle = params.handle!;
  try {
    const planner = await getPlannerByAttribute(context, "handle", handle);
    const shopifyPlanner = await getShopifyPlanner(context, planner.gid);
    return { ...shopifyPlanner, handle };
  } catch (error) {
    // Planner does not exist
    return null;
  }
}
