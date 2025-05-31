import { LoaderFunctionArgs } from "@remix-run/node";
import { getPlanners, makeAuthContext } from "../../modules";

export async function loader({ request, context }: LoaderFunctionArgs) {
  await makeAuthContext({ request, context });
  try {
    return await getPlanners(context);
  } catch (error) {
    // Planner does not exist
    return null;
  }
}
