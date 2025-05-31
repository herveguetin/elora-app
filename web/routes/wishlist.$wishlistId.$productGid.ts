import { makeAuthContext } from "modules";
import { CustomFunctionArgs } from "types";

export async function loader({ request, params, context }: CustomFunctionArgs) {
  makeAuthContext({ request, context });
  const { id: wishlistId, productGid } = params;

  if (!wishlistId || !productGid) {
    throw new Response("Missing required parameters", { status: 400 });
  }

  try {
    // Get the storefront client from context
    const storefront = context.storefront;
    const country = context.country;

    // Get the product details using the productGid
    const response = await storefront.request(
      `query GetProduct($id: ID!) {
        product(id: $id) {
          id
          title
          handle
          description
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }`,
      {
        id: productGid,
      }
    );

    return json({
      product: response.data.product,
      wishlistId: wishlistId,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Response("Error fetching product details", { status: 500 });
  }
}
