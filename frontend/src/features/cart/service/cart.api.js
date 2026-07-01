import axios from "axios";

export const cartApiInstance = axios.create({
    // baseURL: "http://localhost:3000/api/carts", yaha par hame cors ki jagah proxy use kiya hain
    baseURL: "/api/cart",
    withCredentials: true,
})



export const addItem = async ({ productId, variantId }) => {

    // console.log(productId);
    // console.log(variantId);

    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity: 1
    })



    return response.data
}