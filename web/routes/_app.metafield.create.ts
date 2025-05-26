import { ActionFunctionArgs } from "@remix-run/node";
import { importMetafields } from "../../modules";

export const action = async ({ context }: ActionFunctionArgs) => {
  const errors = await importMetafields(context);
  return { success: errors.length === 0, errors };
};
