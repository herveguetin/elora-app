import { deleteRecord, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  try {
    // On delete cascade
    const wishlistItems = await api.wishlistItem.findMany({
      filter: {
        wishlistId: {
          equals: record.id,
        },
      },
    });
    await api.wishlistItem.bulkDelete(wishlistItems.map((wishlistItem) => wishlistItem.id));
  } catch (error) {
    // Wishlist has not item
  }

  await deleteRecord(record);
};

export const options: ActionOptions = {
  actionType: "delete",
};
