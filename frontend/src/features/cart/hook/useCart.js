import { addItem } from "../service/cart.api.js";
import { useDispatch } from "react-redux";
import { addItem as addItemToCart, incrementCartItem, decrementCartItem, removeCartItem, setCart } from "../state/cart.slice.js";
import { useNavigate } from "react-router-dom";
import { getCart, incrementItemQuantity, decrementItemQuantity, removeItem  , createCartOrder, verifyCartOrder} from "../service/cart.api.js";



export const useCart = () => {

    const dispatch = useDispatch()


    async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId })
        await handleGetCart();
        return data
    }

    async function handleGetCart() {
        const data = await getCart()
        console.log(data)
        dispatch(setCart(data.cart))

    }

    async function handleIncrementCartItem({ productId, variantId }) {
        await incrementItemQuantity({ productId, variantId })
        dispatch(incrementCartItem({ productId, variantId }))
         await handleGetCart();
    }

    async function handleDecrementCartItem({ productId, variantId }) {
        await decrementItemQuantity({ productId, variantId })
        dispatch(decrementCartItem({ productId, variantId }))
         await handleGetCart();
    }

    async function handleRemoveCartItem({ productId, variantId }) {
        await removeItem({ productId, variantId })
        dispatch(removeCartItem({ productId, variantId }))
         await handleGetCart();
    }

      async function handleCreateCartOrder() {
        const data = await createCartOrder()
        return data.order
    }

    async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
     
        const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
    //  removal of cart items after successful payment order
        if (data.success) {
        await handleGetCart();
    }
        return data.success
    }

    return { handleAddItem, handleGetCart, handleIncrementCartItem, handleDecrementCartItem, handleRemoveCartItem , handleCreateCartOrder, handleVerifyCartOrder, handleRemoveCartItem }

}


