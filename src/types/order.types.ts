export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "REFUNDED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "CANCELLED";

export interface IAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrderItemVariant {
  id: string;
  sku: string | null;
  attributes: { id: string; key: string; value: string }[];
  colorGroup: {
    id: string;
    colorValue: string;
    colorCode: string | null;
    images: { id: string; url: string }[];
    product: { id: string; name: string };
  };
}

export interface IOrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  priceAtOrder: number | string;
  variant: IOrderItemVariant;
}

export interface IOrder {
  id: string;
  customerId: string;
  addressId: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number | string;
  createdAt: string;
  updatedAt: string;
  orderItems: IOrderItem[];
  address: IAddress | null;
  customer: { id: string; name: string; email: string };
}

export interface ICreateOrderPayload {
  items: { variantId: string; quantity: number }[];
  addressId?: string;
}
