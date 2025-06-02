import { CustomFunctionArgs } from "types";
import { makeAuthContext } from "../../modules/gadget";
import {
  affiliatePlannerToCustomer,
  clearCustomerPlanner,
  getAdminPlanner,
  getCustomerPlanner,
} from "../../modules/planner";

export async function loader({ request, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });

  // Customer not logged in => pass.
  if (context.customerGid === "") return { customerPlanner: null, adminPlanner: null };

  const [customerPlanner, adminPlanner] = await Promise.all([
    getCustomerPlanner(context, context.customerGid!),
    getAdminPlanner(context, context.customerGid!),
  ]);

  return { customerPlanner, adminPlanner };
}

export async function action({ request, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });

  if (context.request.method === "DELETE") {
    try {
      await clearCustomerPlanner(context, context.customerGid!);
      return { success: true };
    } catch (error) {
      context.logger.error({ error }, "[planner] Error while clearing planner of customer");
      return { success: false };
    }
  }

  if (context.request.method === "POST") {
    try {
      const body = await request.json();
      const plannerHandle = body.handle;
      await affiliatePlannerToCustomer(context, { plannerHandle, customerGid: context.customerGid! });
      return { success: true };
    } catch (error) {
      context.logger.error({ error }, "[planner] Error while setting planner of customer");
      return { success: false };
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
