import express from "express";
import { createProduct, getSellerProducts, getAllProducts, getProductDetails, addProductVariant } from "../controller/product.controller.js";
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


/**
 * @route GET /api/products
 * @description Get all products
 * @access Public
 */

router.get("/", getAllProducts)


/**
 * @route GET /api/products/detail/:id
 * @description Get product details by ID
 * @access Public
 */
router.get("/detail/:id", getProductDetails)



/**
 *  @route post /api/products/:productId/variants
 * @description Add a new variant to a product
 * @access Private (Seller only)
 */
router.post("/:productId/variants", authenticateSeller, upload.array('images', 7), addProductVariant)