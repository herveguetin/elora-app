import { CustomFunctionArgs } from "types";
import {
  createCustomerWishlist,
  deleteCustomerWishlist,
  enrichWishlist,
  getCustomerWishlist,
  makeAuthContext,
} from "../../modules";

export async function loader({ request, params, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });
  const wishlist = await getCustomerWishlist(context, params.wishlistId!);
  const richWishlist = await enrichWishlist(context, wishlist.id);
  return { richWishlist };
}

export async function action({ request, params, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });

  if (context.request.method === "DELETE") {
    try {
      await deleteCustomerWishlist(context, params.id!);
      return { success: true };
    } catch (error) {
      context.logger.error({ error }, "[wishlist] Error while deleting wishlist of customer");
      return { success: false };
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
