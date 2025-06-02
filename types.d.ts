import { AppLoadContext, LoaderFunctionArgs } from "@remix-run/node";

export type CustomContext = AppLoadContext & {
  customerGid?: string;
  country?: string;
  locale?: string;
  storefront?: StorefrontApiClient;
};

export type CustomFunctionArgs = LoaderFunctionArgs & {
  context: CustomContext;
};
