import { CustomContext } from "types";
import { getShopifyProducts } from "../../modules/product";
import { addItemsToWishlist, getItemByProductGid } from "./model";
import { deleteWishlist, getWishlistsForCustomer } from "./model/wishlist/repository";
import { CreateWishlistPayload } from "./types";

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
  const productsGids = payload.products.map((product) => product.gid);

  if (payload.products.length) await addItemsToWishlist(context, wishlist, productsGids);

  return await getCustomerWishlists(context);
};

export const updateCustomerWishlist = async (
  context: CustomContext,
  wishlistId: string,
  wishlistTitle: string
) => {
  const wishlist = await getCustomerWishlist(context, wishlistId);
  context.logger.error({wishlistTitle: wishlistTitle, wishlistId}, "title")
  await context.api.wishlist.update(wishlist.id, { title: wishlistTitle });
  return await getCustomerWishlists(context);
};

export const deleteCustomerWishlist = async (context: CustomContext, wishlistId: string) => {
  const wishlist = await getCustomerWishlist(context, wishlistId);
  await deleteWishlist(context, wishlist.id);
  return await getCustomerWishlists(context);
};

export const getWishlistItem = async (context: CustomContext, wishlistId: string, productGid: string) => {
  const wishlist = await getCustomerWishlist(context, wishlistId);
  return await getItemByProductGid(context, wishlist, productGid);
};

export const deleteProductFromWishlist = async (
  context: CustomContext,
  wishlistId: string,
  productGid: string
) => {
  const wishlist = await getCustomerWishlist(context, wishlistId);
  const wishlistItem = await getWishlistItem(context, wishlist.id, productGid);
  await context.api.wishlistItem.delete(wishlistItem.id);
  return await getCustomerWishlists(context);
};

export const addProductToWishlist = async (
  context: CustomContext,
  wishlistId: string,
  productGid: string
) => {
  const wishlist = await getCustomerWishlist(context, wishlistId);
  try {
    // Check if item exists
    await getWishlistItem(context, wishlist.id, productGid);
  } catch (error) {
    // Create item if it does not exist
    await addItemsToWishlist(context, wishlist, [productGid]);
  }

  return await getCustomerWishlists(context);
};
