import { CustomFunctionArgs } from "types";
import { getCustomerWishlists, makeAuthContext } from "../../modules";

export async function loader({ request, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });
  return await getCustomerWishlists(context);
}
