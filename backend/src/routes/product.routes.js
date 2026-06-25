import express from "express";
import { createProduct, getSellerProducts } from "../controller/product.controller.js";
import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProductValidator } from "../validator/product.validator.js";
import multer from "multer";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
})

/**
 * @route POST /api/products
 * @description Create a new product
 * @access Private (Seller only)
 */
router.post("/", authenticateSeller, upload.array('images', 7), createProductValidator, createProduct)

/**
 * @route GET /api/products/seller
 * @description Get all products by seller
 * @access Private (Seller only)
 */
router.get("/seller", authenticateSeller, getSellerProducts)
export default router;

