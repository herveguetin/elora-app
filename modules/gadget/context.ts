import { ShopifyShopRecord } from ".gadget/client/types-esm";
import { CustomContext } from "types";
import { authenticateAppProxy } from "./app-proxy";
import { getStorefrontClient } from "./storefront-api";

export const makeAuthContext = async ({
  request,
  context,
}: {
  request: Request;
  context: CustomContext;
}): Promise<void> => {
  // Make sure request comes from the Shopify store
  authenticateAppProxy({ request, context });

  // Switch to API admin mode
  const api = context.api.actAsAdmin;
  context.api = api;

  // Find shop making the request and set it for Shopify connection
  // in order to handle multi-tenants
  const shop = await setCurrentShop(context);

  // Retrieve Storefront API client for Shop
  const storefrontClient = getStorefrontClient(shop);

  // Add custom entries to context
  context.storefront = storefrontClient;
  context.country = context.request.raw.headers["x-app-country"] as string;
  context.locale = context.request.raw.headers["x-app-locale"] as string;
};

const setCurrentShop = async (context: CustomContext): Promise<ShopifyShopRecord> => {
  const requestShop = (context.request.query as { shop?: string }).shop;
  const shopifyShop = await context.api.shopifyShop.findFirst({
    filter: {
      domain: {
        equals: requestShop,
      },
    },
  });
  context.connections.shopify.setCurrentShop(shopifyShop.id);

  return shopifyShop;
};
