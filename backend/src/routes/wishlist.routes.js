import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../controller/wishlist.controller.js";

const router = express.Router();

/**
 * @route POST /api/wishlist/:productId
 * @description Add product to wishlist
 * @access Private
 */
router.post("/:productId", authenticateUser, addToWishlist);


/**
 *  @route DELETE /api/wishlist/:productId
 *  @description Remove product from wishlist
 *  @access Private
 * */
router.delete("/:productId", authenticateUser, removeFromWishlist);

/**
 * @route GET /api/wishlist
 * @description Get user's wishlist
 * @access Private
 */
router.get("/", authenticateUser, getWishlist);


export default router;