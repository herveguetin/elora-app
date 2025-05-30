import { authenticateAppProxy } from "../../modules/gadget";
import {
  affiliatePlannerToCustomer,
  clearCustomerPlanner,
  getAdminPlanner,
  getCustomerPlanner,
} from "../../modules/planner";
import { AmbientContextFunctionArgs } from "../../types";

export async function loader({ request, context }: AmbientContextFunctionArgs) {
  authenticateAppProxy({ request, context });
  const customerId = (context.request.query as { logged_in_customer_id?: string }).logged_in_customer_id;

  // Customer not logged in => pass.
  if (customerId === "") return { customerPlanner: null, adminPlanner: null };

  const [customerPlanner, adminPlanner] = await Promise.all([
    getCustomerPlanner(context, customerId || ""),
    getAdminPlanner(context, customerId || ""),
  ]);

  return { customerPlanner, adminPlanner };
}

export async function action({ request, context }: AmbientContextFunctionArgs) {
  authenticateAppProxy({ request, context });

  if (context.request.method === "DELETE") {
    try {
      const customerId = (context.request.query as { logged_in_customer_id?: string }).logged_in_customer_id;
      await clearCustomerPlanner(context, customerId || "");
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
      const customerId = (context.request.query as { logged_in_customer_id?: string }).logged_in_customer_id;
      await affiliatePlannerToCustomer(context, { plannerHandle, customerId: customerId || "" });
      return { success: true };
    } catch (error) {
      context.logger.error({ error }, "[planner] Error while setting planner of customer");
      return { success: false };
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
