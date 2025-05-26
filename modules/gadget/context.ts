import { AppLoadContext } from "@remix-run/node";

export const makeContextFromAppProxy = async (context: AppLoadContext): Promise<AppLoadContext> => {
  // Switch to API admin mode
  const api = context.api.actAsAdmin;
  context.api = api;

  // Find shop making the request and set it for Shopify connection
  // in order to handle multi-tenants
  const shop = (context.request.query as { shop?: string }).shop;
  const shopifyShop = await context.api.shopifyShop.findFirst({
    filter: {
      domain: {
        equals: shop,
      },
    },
  });
  context.connections.shopify.setCurrentShop(shopifyShop.id);

  // Add custom entries to context
  context.country = context.request.raw.headers["x-app-country"];
  context.locale = context.request.raw.headers["x-app-locale"];

  return context;
};
