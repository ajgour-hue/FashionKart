import { createProduct, getSellerProducts, getAllProducts, getProductById, addProductVariant  ,updateProduct} from "../service/product.api";
import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice";
import { getSimilarProducts } from "../service/product.api";

export const useProduct = () => {
    const dispatch = useDispatch()


    async function handleCreateProduct(formData) {
        const data = await createProduct(formData)
        return data.product
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProducts()
        dispatch(setSellerProducts(data.products))
        return data.products
    }

    async function handleGetAllProducts(search = "") {
        const data = await getAllProducts(search);
        dispatch(setProducts(data.products));
    }

    async function handleGetProductById(productId) {
        const data = await getProductById(productId)
        return data.product

    }

    async function handleAddProductVariant(productId, newProductVariant) {
        const data = await addProductVariant(productId, newProductVariant)

        return data
    }

    async function handleGetSimilarProducts(productId) {

    const data = await getSimilarProducts(productId);

    return data.products;

}

async function handleUpdateProduct(productId, formData) {
    const data = await updateProduct(productId, formData);
    return data.product;
}


    return { handleUpdateProduct, handleGetSimilarProducts, handleCreateProduct, handleGetSellerProduct, handleGetAllProducts, handleGetProductById, handleAddProductVariant }


}

