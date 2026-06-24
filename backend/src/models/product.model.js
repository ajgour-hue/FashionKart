import mongoose from "mongoose";
import { config } from "../config/config.js";
import bcrypt from "bcrypt";

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
        amount: {
            type: Number,
            required: true

        }, 
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

    image : [
        {
            url : {
                type : String,
                required : true
            }
        }
    ]
},{timestamps: true});

const productModel = mongoose.model("Product", productSchema);
export default productModel;

