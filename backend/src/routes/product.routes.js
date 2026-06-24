    import express from "express";
    import { createProduct } from "../controller/product.controller.js";
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

    router.post("/", authenticateSeller, upload.array('images', 7),createProductValidator, createProduct)
    export default router;
