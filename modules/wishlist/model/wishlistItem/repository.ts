import { WishlistRecord } from ".gadget/client/types-esm";
import { CustomContext } from "types";

export const addItemsToWishlist = async (
  context: CustomContext,
  wishlist: WishlistRecord,
  productsGids: string[]
) => {
  const newProducts = productsGids.map((productGid) => {
    return {
      productGid,
      wishlist: {
        _link: wishlist.id,
      },
    };
  });
  await context.api.wishlistItem.bulkCreate(newProducts);
};

export const getItemByProductGid = async (
  context: CustomContext,
  wishlist: WishlistRecord,
  productGid: string
) => {
  return await context.api.wishlistItem.findFirst({
    filter: {
      AND: [
        {
          wishlistId: {
            equals: wishlist.id,
          },
        },
        {
          productGid: {
            equals: productGid,
          },
        },
      ],
    },
  });
};
