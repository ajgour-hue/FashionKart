import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";

export const addToWishlist = async (req, res) => {
   
    //  console.log("Add Wishlist API Hit");


    try {
        const { productId } = req.params;
        const userId = req.user.id;

        // Check if product exists
        const exists = await Product.exists({ _id: productId });

        if (!exists) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Create wishlist item
        const wishlist = await Wishlist.create({
            user: userId,
            product: productId,
        });

        // Keep this for now if frontend uses product details
        // ! not  sending the irrelevant data like variants etc ..
        // await wishlist.populate("product");

        console.log("Before populate");

        await wishlist.populate({
            path: "product",
            select: "title price images",
        });

        // console.log("After populate");
        // console.log(wishlist);
        // console.log(wishlist.product);

        // console.log(wishlist.product);

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist",
            wishlist,
        });
    } catch (error) {
        // Duplicate wishlist item
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist",
            });
        }

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

