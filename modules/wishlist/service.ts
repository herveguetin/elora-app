import { WishlistRecord } from ".gadget/client/types-esm";
import { CustomContext } from "types";
import { getWishlistsForCustomer, deleteWishlist } from "./model/wishlist/repository";
import { CreateWishlistPayload, RichWishlist } from "./types";
import { getShopifyProducts } from "../../modules/product";

export const getCustomerWishlists = async (context: CustomContext, customerGid?: string) => {
  try {
    customerGid = customerGid ?? context.customerGid!;
    return await getWishlistsForCustomer(context, customerGid);
  } catch (error) {
    // No wishlists found
    return [];
  }
};

export const getCustomerWishlist = async (context: CustomContext, wishlistId: string) => {
  const wishlists = await getCustomerWishlists(context);

  // Making sure the required wishlist belongs to the customer
  const wishlist = wishlists.find((wishlist) => wishlist.id === wishlistId);
  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  return wishlist;
};

export const enrichWishlist = async (context: CustomContext, wishlistId: string) => {
  const wishlist = await getCustomerWishlist(context, wishlistId);
  const productGids = wishlist.wishlistItems.edges.map((item) => item.node.productGid);
  const products = await getShopifyProducts(context, productGids);
  return { ...wishlist, wishlistItems: products };
};

export const createCustomerWishlist = async (context: CustomContext, payload: CreateWishlistPayload) => {
  const variables = {
    title: payload.title,
    customerGid: context.customerGid,
  };
  const wishlist = await context.api.wishlist.create(variables);
  if (payload.products.length) {
    const products = payload.products.map((product) => {
      return {
        productGid: product.gid,
        wishlist: {
          _link: wishlist.id,
        },
      };
    });
    await context.api.wishlistItem.bulkCreate(products);
  }

  return await getCustomerWishlist(context, wishlist.id);
};

export const deleteCustomerWishlist = async (context: CustomContext, wishlistId: string): Promise<void> => {
  const wishlist = await getCustomerWishlist(context, wishlistId);
  return await deleteWishlist(context, wishlist.id);
};
