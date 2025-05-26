import { CustomFunctionArgs } from "types";
import { makeAuthContext } from "../../modules/gadget";

export async function action({ request, context }: CustomFunctionArgs) {
  await makeAuthContext({ request, context });

  if (context.request.method === "POST") {
    try {
      /**
       * @todo Implement actual formData treatment
       */
      const data = await request.json();
      return { post: data };
    } catch (error) {
      context.logger.error({ error }, "[planner] Error sending message to planner");
      return { success: false };
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
