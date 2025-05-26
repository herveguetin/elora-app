import { PlannerRecord, ShopifyShopRecord } from ".gadget/client/types-esm";
import { PlannerMetaobject, SyncPlannersResponse } from "modules/planner/types";
import { CustomContext } from "types";
import { CREATE_REDIRECT } from "../../../../modules/planner/graphql/Mutations";
import {
  PLANNERS_AFFILIATION_REQUEST_PARAM,
  PLANNERS_AFFILIATION_ROUTE,
  PLANNERS_METAOBJECT_TYPE,
} from "../../../planner/config";
import { ALL_PLANNERS_QUERY } from "../../graphql/Queries";

export const getPlanners = async (context: CustomContext): Promise<PlannerRecord[]> => {
  // use allRecords to store all records
  const allRecords = [];
  let records = await context.api.planner.findMany({ first: 250 });

  allRecords.push(...records);

  // loop through additional pages to get all protected orders
  while (records.hasNextPage) {
    // paginate
    records = await records.nextPage();
    allRecords.push(...records);
  }

  return records;
};

export const getPlannerByAttribute = async (
  context: CustomContext,
  attribute: string,
  value: string
): Promise<PlannerRecord> => {
  return await context.api.planner.findFirst({
    filter: {
      [attribute]: {
        equals: value,
      },
    },
  });
};

export const pullPlanners = async (context: CustomContext): Promise<SyncPlannersResponse> => {
  const shops: ShopifyShopRecord[] = await context.api.shopifyShop.findMany();

  let response: SyncPlannersResponse = {
    success: true,
    errors: [],
  };

  const shopTasks = shops.map((shop) => syncPlannersForShop(context, shop, response));
  await Promise.allSettled(shopTasks);
  return response;
};

const syncPlannersForShop = async (
  context: CustomContext,
  shop: ShopifyShopRecord,
  response: SyncPlannersResponse
): Promise<void> => {
  const shopify = await context.connections.shopify.forShopId(shop.id);
  const srcPlanners = await shopify.graphql(ALL_PLANNERS_QUERY, {
    type: PLANNERS_METAOBJECT_TYPE,
  });

  const plannerTasks = srcPlanners.metaobjects.nodes.map((planner: PlannerMetaobject) =>
    syncPlanner(context, shop.id, planner, response)
  );

  await Promise.allSettled(plannerTasks);
};

const syncPlanner = async (
  context: CustomContext,
  shopId: string,
  planner: PlannerMetaobject,
  response: SyncPlannersResponse
): Promise<void> => {
  const shopify = await context.connections.shopify.forShopId(shopId);
  const url = new URL(`https://fake.com${PLANNERS_AFFILIATION_ROUTE}`);
  const findField = (key: string) => planner.fields.find((field) => field.key === key)?.value ?? "";
  let usedPlanner = await findPlannerToSync(context, planner);

  const data = {
    gid: planner.id,
    nom: findField("nom"),
    prenom: findField("prenom"),
    email: findField("email"),
    handle: planner.handle,
    shop: { _link: shopId },
  };

  try {
    if (usedPlanner) {
      await context.api.planner.update(usedPlanner.id, data);
    } else {
      usedPlanner = await context.api.planner.create(data);
    }

    // Write url redirect
    url.searchParams.set(PLANNERS_AFFILIATION_REQUEST_PARAM, usedPlanner.handle);
    await shopify.graphql(CREATE_REDIRECT, {
      path: `/${usedPlanner.handle}`,
      target: url.pathname + url.search,
    });
  } catch (error) {
    const message = `[planner] Error syncing planner ${planner.id} for shop ${shopId}`;
    context.logger.error({ error }, message);
    response.success = false;
    response.errors.push(message);
  }
};

const findPlannerToSync = async (
  context: CustomContext,
  planner: PlannerMetaobject
): Promise<PlannerRecord | null> => {
  try {
    return await getPlannerByAttribute(context, "gid", planner.id);
  } catch (error) {
    // Planner does not exist
    return null;
  }
};
