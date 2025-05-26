import crypto from "crypto";
import { CustomContext } from "types";

const SIGNATURE_PARAM = "signature";

export const authenticateAppProxy = ({
  request,
  context,
}: {
  request: Request;
  context: CustomContext;
}): boolean => {
  if (!context.config.SHOPIFY_APP_CLIENT_SECRET) {
    throw new Error("Missing SHOPIFY_APP_CLIENT_SECRET environment variable.");
  }

  let url = new URL(request.url);
  const searchParams = url.searchParams;
  const signature = searchParams.get(SIGNATURE_PARAM);
  searchParams.delete(SIGNATURE_PARAM);

  const sortedParams = Array.from(searchParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("");

  const calculatedSignature = crypto
    .createHmac("sha256", process.env.SHOPIFY_APP_CLIENT_SECRET!)
    .update(sortedParams)
    .digest("hex");

  if (calculatedSignature !== signature) {
    throw new Error("Invalid signature: request is not from Shopify.");
  }

  return true;
};
