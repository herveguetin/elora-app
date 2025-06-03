export type RichWishlistItem = WishlistItemRecord & {
  product: Record<string, any>;
};

export type RichWishlist = any & {
  wishlistItems: RichWishlistItem[];
};

export type CreateWishlistPayload = {
  title: string;
  products: {
    gid: string;
  }[];
};
