import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "wishlistItem" model, go to https://elora.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "pu2wVpkDQC8J",
  fields: {
    productGid: {
      type: "string",
      validations: { required: true },
      storageKey: "LLj5KPobL0R3",
    },
    wishlist: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "wishlist" },
      storageKey: "CpWWVsnsDD48",
    },
  },
};
