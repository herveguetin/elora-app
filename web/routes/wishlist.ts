import { CustomFunctionArgs } from "types";
import { createCustomerWishlist, getCustomerWishlists, makeAuthContext } from "../../modules";

export async function loader({ request, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });
  return await getCustomerWishlists(context);
}

export async function action({ request, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });

  if (context.request.method === "POST") {
    try {
      const body = await request.json();
      return await createCustomerWishlist(context, body);
    } catch (error) {
      context.logger.error({ error }, "[planner] Error while creating customer wishlist");
      return await getCustomerWishlists(context);
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
