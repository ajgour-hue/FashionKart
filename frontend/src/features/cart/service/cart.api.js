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

    export const getCart = async () => {
    const response = await cartApiInstance.get('/')
    return response.data
}

export const incrementItemQuantity = async ({ productId, variantId }) => {
    const response = await cartApiInstance.patch(`/quantity/increment/${productId}/${variantId}`)
    return response.data
}

export const decrementItemQuantity = async ({ productId, variantId }) => {
    const response = await cartApiInstance.patch(`/quantity/decrement/${productId}/${variantId}`)
    return response.data
}

export const removeItem = async ({ productId, variantId }) => {
    const response = await cartApiInstance.delete(`/remove/${productId}/${variantId}`)
    return response.data
}

