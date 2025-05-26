import { getTranslations, makeAuthContext } from "../../modules";
import { CustomFunctionArgs } from "types";

export async function loader({ request, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });
  return await getTranslations(context);
}
