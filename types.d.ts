import { AppLoadContext, LoaderFunctionArgs } from "@remix-run/node";
import { StorefrontApiClient } from "@shopify/storefront-api-client";

export type CustomContext = AppLoadContext & {
  customerGid?: string;
  country?: string;
  locale?: string;
  storefront?: StorefrontApiClient;
  themeId?: string;
};

export type CustomFunctionArgs = LoaderFunctionArgs & {
  context: CustomContext;
};
