import { WishlistRecord } from ".gadget/client/types-esm";
import { CustomContext } from "types";
import {getWishlistsForCustomer, deleteWishlist } from "./model/wishlist/repository";

export const getCustomerWishlists = async (
  context: CustomContext,
  customerGid: string
): Promise<WishlistRecord[]> => {
  try {
    return await getWishlistsForCustomer(context, customerGid);
  } catch (error) {
    // No wishlists found
    return [];
  }
};

export const deleteCustomerWishlist = async (
  context: CustomContext,
  customerGid: string,
  wishlistId: string
): Promise<void> => {
  const wishlists = await getWishlistsForCustomer(context, customerGid);
  const wishlist = wishlists.find((wishlist) => wishlist.id === wishlistId);
  if (!wishlist) {
    throw new Error("Wishlist not found");
  }
  return await deleteWishlist(context, wishlist.id);
};
