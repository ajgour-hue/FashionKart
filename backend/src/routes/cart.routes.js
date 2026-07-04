import express from "express";
import { Router } from "express";                                     
import {authenticateUser} from "../middleware/auth.middleware.js";
import {validateAddToCart , validateIncrementItemQuantity} from "../validator/cart.validator.js";  
import {addToCart, getCart , incrementCartItemQuantity   ,decrementCartItemQuantity , removeCartItem} from "../controller/cart.controller.js";

const router = Router(); 



/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private
 * @argument productId - ID of the product to add
 * @argument variantId - ID of the variant to add
 * @argument quantity - Quantity of the item to add (optional, default: 1)
 */
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)



/**
 * @route GET /api/cart
 * @desc Get user's cart
 * @access Private
 */
router.get('/', authenticateUser, getCart)


router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validateIncrementItemQuantity, incrementCartItemQuantity)


router.patch("/quantity/decrement/:productId/:variantId", authenticateUser, validateIncrementItemQuantity, decrementCartItemQuantity)

router.delete("/remove/:productId/:variantId", authenticateUser, validateIncrementItemQuantity, removeCartItem)

export default router;