import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.3.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2025-04",
        enabledModels: [],
        type: "partner",
        scopes: [
          "read_products",
          "read_metaobjects",
          "read_customers",
          "write_customers",
          "unauthenticated_read_product_listings",
          "read_themes",
          "read_online_store_navigation",
          "write_online_store_navigation",
          "write_products",
        ],
      },
    },
  },
};
