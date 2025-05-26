import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "wishlist" model, go to https://elora.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "8Ea-2BZau2CS",
  fields: {
    customerGid: { type: "string", storageKey: "VQRwTeFB-R14" },
    title: {
      type: "string",
      validations: { required: true },
      storageKey: "wJwHHTytMoF2",
    },
    wishlistItems: {
      type: "hasMany",
      children: { model: "wishlistItem", belongsToField: "wishlist" },
      storageKey: "-JFpZJwSoTUL",
    },
  },
};
