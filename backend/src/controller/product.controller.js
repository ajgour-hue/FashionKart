import productModel from "../models/product.model.js";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";
import { uploadFile } from "../service/storage.service.js";

export async function createProduct(req, res) {

    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))


    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        images,
        seller: seller._id
    })


    res.status(201).json({
        message: "Product created successfully",
        success: true,
        product
    })
}


export async function getSellerProducts(req, res) {

    const seller = req.user;

    const products = await productModel.find({ seller: seller._id });

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })

}

export async function getAllProducts(req, res) {

    const { search = "" } = req.query;

    let filter = {};

    if (search.trim()) {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    const products = await productModel.find(filter);

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    });

}

export async function getProductDetails(req, res) {

    const { id } = req.params;

    const product = await productModel.findById(id);

    res.status(200).json({
        message: "Product fetched successfully",
        success: true,
        product
    })

}

export async function addProductVariant(req, res) {

    const productId = req.params.productId;

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id
    });
    

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    const files = req.files;
    const images = []

    if (files || files.length !== 0) {
  (await Promise.all(files.map(async (file) => {
            const image = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
            return image
        }))).map(image => images.push(image))
    }


    const price = req.body.priceAmount
    const stock = req.body.stock
    const attributes = JSON.parse(req.body.attributes || "{}")

    console.log(price)

    product.variants.push({
        images,
        price: {
            amount: Number(price) || product.price.amount,
            currency: req.body.priceCurrency || product.price.currency
        },
        stock,
        attributes
    })

    await product.save();

    res.status(200).json({
        message: "Product variant added successfully",
        success: true,
        product
    })
}


export async function getSimilarProducts(req, res) {

    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    const products = await productModel.find({
        _id: { $ne: id }, // current product ko hata do
        title: {
            $regex: product.title.split(" ")[0],
            $options: "i"
        }
    }).limit(4);

    res.json({
        success: true,
        products
    });

}

export async function updateProduct(req, res) {
    try {
        const { productId } = req.params;
        const { title, description, priceAmount, priceCurrency } = req.body;

        const product = await productModel.findOne({
            _id: productId,
            seller: req.user._id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Update basic details
        product.title = title;
        product.description = description;

        product.price = {
            amount: Number(priceAmount),
            currency: priceCurrency || "INR"
        };

        // Update images only if new images are uploaded
        if (req.files && req.files.length > 0) {

            const images = await Promise.all(
                req.files.map(async (file) => {
                    return await uploadFile({
                        buffer: file.buffer,
                        fileName: file.originalname
                    });
                })
            );

            product.images = images;
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}