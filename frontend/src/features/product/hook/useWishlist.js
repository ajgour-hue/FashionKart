import { useDispatch } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../service/wishlist.api.js";

import {
  setWishlist,
  addWishlistItem,
  removeWishlistItem,
  setWishlistLoading,
} from "../state/wishlist.slice.js";

export const useWishlist = () => {
  const dispatch = useDispatch();

  // Get Wishlist
  const handleGetWishlist = async () => {
    try {
      dispatch(setWishlistLoading(true));

      const response = await getWishlist();

      if (response.success) {
        dispatch(setWishlist(response.wishlist));
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setWishlistLoading(false));
    }
  };

  // Add Wishlist
  const handleAddToWishlist = async (productId) => {
    try {
      const response = await addToWishlist(productId);

      if (response.success) {
        dispatch(addWishlistItem(response.wishlist));
      }

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Remove Wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await removeFromWishlist(productId);

      if (response.success) {
        dispatch(removeWishlistItem(productId));
      }

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    handleGetWishlist,
    handleAddToWishlist,
    handleRemoveFromWishlist,
  };  
};