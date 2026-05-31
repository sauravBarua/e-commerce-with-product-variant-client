import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IGuestCartItem {
  variantId: string;
  productId: string;
  productName: string;
  colorValue: string;
  colorCode: string | null;
  imageUrl: string;
  variantLabel: string;
  sku: string | null;
  price: number;
  quantity: number;
}

interface GuestCartState {
  items: IGuestCartItem[];
}

const initialState: GuestCartState = {
  items: [],
};

const guestCartSlice = createSlice({
  name: "guestCart",
  initialState,
  reducers: {
    addGuestItem(
      state,
      action: PayloadAction<Omit<IGuestCartItem, "quantity">>,
    ) {
      const existing = state.items.find(
        (i) => i.variantId === action.payload.variantId,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    removeGuestItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.variantId !== action.payload);
    },

    updateGuestItemQty(
      state,
      action: PayloadAction<{ variantId: string; quantity: number }>,
    ) {
      const item = state.items.find(
        (i) => i.variantId === action.payload.variantId,
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },

    clearGuestCart(state) {
      state.items = [];
    },
  },
});

export const { addGuestItem, removeGuestItem, updateGuestItemQty, clearGuestCart } =
  guestCartSlice.actions;

export default guestCartSlice.reducer;
