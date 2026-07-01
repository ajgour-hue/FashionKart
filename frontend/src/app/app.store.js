import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/state/auth.slice.js";
import productSlice from "../features/product/state/product.slice.js";
import cartSlice from "../features/cart/state/cart.slice.js";
export const store = configureStore({
    reducer: {
        auth: authSlice,
        product: productSlice,
        cart: cartSlice,
    },
});