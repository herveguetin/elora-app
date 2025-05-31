import { AppLoadContext, LoaderFunctionArgs } from "@remix-run/node";

export type CustomContext = AppLoadContext & {
  country?: string;
  locale?: string;
  storefront?: StorefrontApiClient;
};

export type CustomFunctionArgs = LoaderFunctionArgs & {
  context: CustomContext;
};
