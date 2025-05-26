import { PlannerRecord, ShopifyShopRecord } from ".gadget/client/types-esm";
import { AmbientContext } from ".gadget/server/dist-esm";
import { PlannerMetaobject, SyncPlannersResponse } from "modules/planner/types";
import { PLANNERS_METAOBJECT_TYPE } from "../../../planner/config";
import { ALL_PLANNERS_QUERY } from "../../graphql/Queries";

export const getPlanners = async (context: AmbientContext): Promise<PlannerRecord[]> => {
  return await context.api.planner.findMany();
};

export const getPlannerByAttribute = async (
  context: AmbientContext,
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

export const pullPlanners = async (context: AmbientContext): Promise<SyncPlannersResponse> => {
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
  context: AmbientContext,
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
  context: AmbientContext,
  shopId: string,
  planner: PlannerMetaobject,
  response: SyncPlannersResponse
): Promise<void> => {
  const findField = (key: string) => planner.fields.find((field) => field.key === key)?.value ?? "";
  
  const data = {
    gid: planner.id,
    nom: findField("nom"),
    prenom: findField("prenom"),
    email: findField("email"),
    handle: planner.handle,
    shop: { _link: shopId },
  };

  const existingPlanner = await findPlannerToSync(context, planner);

  try {
    if (existingPlanner) {
      await context.api.planner.update(existingPlanner.id, data);
    } else {
      await context.api.planner.create(data);
    }
  } catch (error) {
    const message = `[planner] Error syncing planner ${planner.id} for shop ${shopId}`;
    context.logger.error({ error }, message);
    response.success = false;
    response.errors.push(message);
  }
};

const findPlannerToSync = async (
  context: AmbientContext,
  planner: PlannerMetaobject
): Promise<PlannerRecord | null> => {
  try {
    return await getPlannerByAttribute(context, "gid", planner.id);
  } catch (error) {
    // Planner does not exist
    return null;
  }
};
