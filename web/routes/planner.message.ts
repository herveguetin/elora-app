import { LoaderFunctionArgs } from "@remix-run/node";
import { makeAuthContext } from "../../modules/gadget";

export async function action({ request, context }: LoaderFunctionArgs) {
  await makeAuthContext({ request, context });

  if (context.request.method === "POST") {
    try {
      /**
       * @todo Implement actuial formData treatment
       */
      const formData = await request.formData();
      return { post: Object.fromEntries(formData.entries()) };
    } catch (error) {
      context.logger.error({ error }, "[planner] Error sending message to planner");
      return { success: false };
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
