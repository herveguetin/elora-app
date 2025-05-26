import { CustomFunctionArgs } from "types";
import {
  createCustomerWishlist,
  deleteCustomerWishlist,
  enrichWishlist,
  getCustomerWishlist,
  makeAuthContext,
  updateCustomerWishlist,
} from "../../modules";

export async function loader({ request, params, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });
  const wishlist = await getCustomerWishlist(context, params.id!);
  const richWishlist = await enrichWishlist(context, wishlist.id);
  richWishlist.wishlistItems = richWishlist.wishlistItems!.data.nodes.map((node) => node);
  return { ...richWishlist };
}

export async function action({ request, params, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });

  if (context.request.method === "DELETE") {
    try {
      return await deleteCustomerWishlist(context, params.id!);
    } catch (error) {
      context.logger.error({ error }, "[wishlist] Error while deleting wishlist of customer");
      return { success: false };
    }
  }

  if (context.request.method === "PATCH") {
    const data = await request.json();
    try {
      return await updateCustomerWishlist(context, data.id!, data.wishlistTitle!);
    } catch (error) {
      context.logger.error({ error }, "[wishlist] Error while updating wishlist of customer");
      return { success: false };
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
