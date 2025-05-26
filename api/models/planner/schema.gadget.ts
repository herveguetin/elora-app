import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "planner" model, go to https://elora-sandbox.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "P_msDapr3UH7",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "vXS4BH2bEUuA",
    },
    gid: {
      type: "string",
      validations: { required: true },
      storageKey: "kqovxE7aQJLr",
    },
    handle: {
      type: "string",
      validations: { required: true, unique: true },
      storageKey: "604st9jJ9VpH",
    },
    nom: {
      type: "string",
      validations: { required: true },
      storageKey: "sHa9-HKh_rEA",
    },
    prenom: {
      type: "string",
      validations: { required: true },
      storageKey: "JYMRvsxppULD",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "C83fPJIjN9TA",
    },
  },
};
