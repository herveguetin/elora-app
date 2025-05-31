import { ShopifyShopRecord } from ".gadget/client/types-esm";
import { createStorefrontApiClient, StorefrontApiClient } from "@shopify/storefront-api-client";

export const getStorefrontClient = (shop: ShopifyShopRecord): StorefrontApiClient => {
  if (!shop.frontendAccessToken) {
    throw new Error("Shop is missing Storefront API private access token.");
  }

  return createStorefrontApiClient({
    storeDomain: shop.url || "",
    apiVersion: "unstable",
    privateAccessToken: shop.frontendAccessToken,
    customFetchApi: fetch,
  });
};
