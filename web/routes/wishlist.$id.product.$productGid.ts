import { CustomFunctionArgs } from "types";
import { addProductToWishlist, deleteProductFromWishlist, makeAuthContext } from "../../modules";

export async function action({ request, params, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });

  if (context.request.method === "DELETE") {
    try {
      const wishlist = await deleteProductFromWishlist(context, params.id!, params.productGid!);
      return { success: true, wishlist };
    } catch (error) {
      context.logger.error({ error }, "[wishlist] Error while deleting product from wishlist of customer");
      return { success: false };
    }
  }

  if (context.request.method === "POST") {
    try {
      const wishlist = await addProductToWishlist(context, params.id!, params.productGid!);
      return { success: true, wishlist };
    } catch (error) {
      context.logger.error({ error }, "[planner] Error while creating customer wishlist");
      return { success: false };
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
