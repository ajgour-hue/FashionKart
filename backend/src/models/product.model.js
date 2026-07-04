import mongoose from "mongoose";
import { config } from "../config/config.js";
import bcrypt from "bcrypt";
import priceSchema from "./price.schema.js";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: priceSchema,
        required: true
    },
    currency: {
            type: String,
            enum: [ "USD", "EUR", "GBP", "JPY", "INR" ],
            default: "INR"
        },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    images : [
        {
            url : {
                type : String,
                required : true
            }
        }
    ],
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                type: priceSchema
            }
        },

    ]
},{timestamps: true});

const productModel = mongoose.model("Product", productSchema);
export default productModel;

