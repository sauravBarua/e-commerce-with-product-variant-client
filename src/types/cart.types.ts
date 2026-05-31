export interface ICartItemVariant {
  id: string;
  sku: string | null;
  price: number | string;
  attributes: { id: string; key: string; value: string }[];
  inventory: { quantity: number; reservedQuantity: number } | null;
  colorGroup: {
    id: string;
    colorValue: string;
    colorCode: string | null;
    images: { id: string; url: string; isPrimary: boolean; sortOrder: number }[];
    product: { id: string; name: string; slug: string | null };
  };
}

export interface ICartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  variant: ICartItemVariant;
}

export interface ICart {
  id: string;
  customerId: string;
  items: ICartItem[];
  createdAt: string;
  updatedAt: string;
}
