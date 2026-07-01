import axios from "axios";


export const productApiInstance = axios.create({
    // baseURL: "http://localhost:3000/api/products", yaha par hame cors ki jagah proxy use kiya hain
    baseURL: "/api/products",
    withCredentials: true,
})

export async function createProduct(formdata){

    const response = await productApiInstance.post("/", formdata);

    return response.data;
}

export async function getSellerProducts(){

    const response = await productApiInstance.get("/seller")

    return response.data;

}


export async function getAllProducts(){

    const response = await productApiInstance.get("/");

    return response.data;

}

export async function getProductById(productId){

    const response = await productApiInstance.get(`/detail/${productId}`);

    return response.data;
}