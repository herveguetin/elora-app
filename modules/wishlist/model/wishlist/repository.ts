import { WishlistRecord } from ".gadget/client/types-esm";
import { CustomContext } from "types";

export const getWishlistsForCustomer = async (
  context: CustomContext,
  customerGid: string
) => {
  return await context.api.wishlist.findMany({
    select: {
      id: true,
      title: true,
      customerGid: true,
      createdAt: true,
      updatedAt: true,
      __typename: true,
      wishlistItems: {
        edges: {
          node: {
            id: true,
            productGid: true,
            createdAt: true,
            updatedAt: true,
            __typename: true,
          },
        },
      },
    },
    filter: {
      customerGid: {
        equals: customerGid,
      },
    },
  });
};

export const deleteWishlist = async (context: CustomContext, wishlistId: string): Promise<void> => {
  await context.api.wishlist.delete(wishlistId);
};
