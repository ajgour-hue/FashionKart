import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";

export const addToWishlist = async (req, res) => {
    try {

        const { productId } = req.params;
        const userId = req.user.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const existingWishlist = await Wishlist.findOne({
            user: userId,
            product: productId,
        });

        if (existingWishlist) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist"
            });
        }
        const wishlist = await Wishlist.create({
            user: userId,
            product: productId,
        });

        await wishlist.populate("product");

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist",
            wishlist,
        });
    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};


export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const wishlist = await Wishlist.findOneAndDelete({
            user: userId,
            product: productId,
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
        });
    } catch (error) {
        console.error("Remove Wishlist Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.find({
            user: userId,
        }).populate("product");

        return res.status(200).json({
            success: true,
            wishlist,
        });
    } catch (error) {
        console.error("Get Wishlist Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

