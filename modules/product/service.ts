import { CustomContext } from "types";
import { PRODUCTS_BY_GIDS_QUERY } from "./graphql/Queries";
export * from "./metafields";

export const getShopifyProducts = async (context: CustomContext, productGids: string[]) => {
  const products = await context.storefront?.request(PRODUCTS_BY_GIDS_QUERY, {
    variables: {
      ids: productGids,
    },
  });
  return products;
};
