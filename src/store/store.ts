import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import cartSlice from "./cartSlice";
import wishlistReducer from "./wishlistSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartSlice,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;