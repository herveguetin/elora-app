import { ActionFunctionArgs } from "@remix-run/node";
import { removeMetafields } from "../../modules";

export const action = async ({ context }: ActionFunctionArgs) => {
  const errors = await removeMetafields(context);
  return { success: errors.length === 0, errors };
};
