import axios from "axios";


export const wishlistApiInstance = axios.create({
    // baseURL: "http://localhost:3000/api/products", yaha par hame cors ki jagah proxy use kiya hain
    baseURL: "/api/wishlist",
    withCredentials: true,
})

export async function addToWishlist(productId) {
     const response = await wishlistApiInstance.post(`/${productId}`);
  return response.data;
}

export const removeFromWishlist = async (productId) => {
  const response = await wishlistApiInstance.delete(`/${productId}`);
  return response.data;
};

export const getWishlist = async () => {
  const response = await wishlistApiInstance.get("/");
  return response.data;
};