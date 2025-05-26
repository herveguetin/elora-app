import { PlannerRecord } from ".gadget/client/types-esm";
import { CustomContext } from "types";
import { CUSTOMER_PLANNER_METAFIELD_KEY, CUSTOMER_PLANNER_METAFIELD_NAMESPACE } from "../customer/config";
import { CUSTOMER_QUERY } from "../customer/graphql/Queries";
import { parseFields } from "../framework";
import { CLEAR_CUSTOMER_PLANNER, SET_CUSTOMER_PLANNER } from "./graphql/Mutations";
import { CUSTOMER_PLANNER_QUERY, PLANNER_QUERY } from "./graphql/Queries";
import { getPlannerByAttribute } from "./model";
import { AffiliatePlannerPayload } from "./types";

export const getCustomerPlanner = async (
  context: CustomContext,
  customerGid: string
): Promise<Record<string, string> | null> => {
  const shopify = context.connections.shopify.current!;

  try {
    const planner = await shopify.graphql(CUSTOMER_PLANNER_QUERY, {
      id: customerGid,
      namespace: CUSTOMER_PLANNER_METAFIELD_NAMESPACE,
      key: CUSTOMER_PLANNER_METAFIELD_KEY,
    });
    const fields = parseFields(planner.customer.metafield.reference.fields);
    fields.handle = planner.customer.metafield.reference.handle;
    return fields;
  } catch (error) {
    // No planner found
    return null;
  }
};

export const clearCustomerPlanner = async (context: CustomContext, customerGid: string): Promise<void> => {
  const shopify = context.connections.shopify.current!;
  await shopify.graphql(CLEAR_CUSTOMER_PLANNER, {
    metafields: [
      {
        key: CUSTOMER_PLANNER_METAFIELD_KEY,
        namespace: CUSTOMER_PLANNER_METAFIELD_NAMESPACE,
        ownerId: customerGid,
      },
    ],
  });
};

export const getAdminPlanner = async (
  context: CustomContext,
  customerGid: string
): Promise<Record<string, string> | null> => {
  const shopify = context.connections.shopify.current!;
  const { customer } = await shopify.graphql(CUSTOMER_QUERY, { id: customerGid });

  try {
    const planner: PlannerRecord = await getPlannerByAttribute(context, "email", customer.email);
    const shopifyPlanner = await getShopifyPlanner(context, planner.gid);
    shopifyPlanner.handle = planner.handle;
    return shopifyPlanner;
  } catch (error) {
    // Current customer is not a planner
    return null;
  }
};

export const getShopifyPlanner = async (
  context: CustomContext,
  gid: string
): Promise<Record<string, string>> => {
  const shopify = context.connections.shopify.current!;
  const { metaobject } = await shopify.graphql(PLANNER_QUERY, { id: gid });
  return parseFields(metaobject.fields);
};

export const affiliatePlannerToCustomer = async (
  context: CustomContext,
  payload: AffiliatePlannerPayload
): Promise<void> => {
  const shopify = context.connections.shopify.current!;
  const planner: PlannerRecord = await getPlannerByAttribute(context, "handle", payload.plannerHandle);
  await shopify.graphql(SET_CUSTOMER_PLANNER, {
    metafields: [
      {
        ownerId: payload.customerGid,
        namespace: CUSTOMER_PLANNER_METAFIELD_NAMESPACE,
        key: CUSTOMER_PLANNER_METAFIELD_KEY,
        value: planner.gid,
      },
    ],
  });
};
