// ─── Product types ───────────────────────────────────────────
export interface IProductVariantAttribute {
  id: string;
  key: string;
  value: string;
}

export interface IProductInventory {
  quantity: number;
  reservedQuantity: number;
}

export interface IProductVariant {
  id: string;
  sku: string | null;
  price: number;
  attributes: IProductVariantAttribute[];
  inventory: IProductInventory | null;
}

export interface IProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface IProductColorGroup {
  id: string;
  colorValue: string;
  colorCode: string | null;
  images: IProductImage[];
  variants: IProductVariant[];
}

export interface IProduct {
  id: string;
  name: string;
  slug: string | null;
  description: string;
  averageRating: number | string;
  isActive: boolean;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  colorGroups: IProductColorGroup[];
  createdAt: string;
  updatedAt: string;
}

// ─── Legacy specialty types ───────────────────────────────────
export interface ISpecialty {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  isDeleted?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ICreateSpecialtyPayload {
  title: string;
  description?: string;
  icon?: string;
}

export interface IUpdateSpecialtyPayload {
  title?: string;
  description?: string;
  icon?: string;
}
