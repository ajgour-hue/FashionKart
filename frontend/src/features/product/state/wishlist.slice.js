import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },

    addWishlistItem: (state, action) => {
      state.items.push(action.payload);
    },

    removeWishlistItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload
      );
    },

    setWishlistLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setWishlist,
  addWishlistItem,
  removeWishlistItem,
  setWishlistLoading,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;