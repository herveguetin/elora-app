import { CustomFunctionArgs } from "types";
import { getPlanners, makeAuthContext } from "../../modules";

export async function loader({ request, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });

  try {
    return await getPlanners(context);
  } catch (error) {
    // Planner does not exist
    return null;
  }
}
