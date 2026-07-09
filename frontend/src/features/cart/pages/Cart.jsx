import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart'
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import { useRazorpay } from "react-razorpay"

const Cart = () => {
    const cart = useSelector(state => state.cart)

    const shippingFree = cart.totalPrice >= 15000;

    const { handleGetCart, handleRemoveCartItem, handleIncrementCartItem, handleDecrementCartItem, handleAddItem
        , handleCreateCartOrder, handleVerifyCartOrder
    } = useCart()

    const navigate = useNavigate()

    const { error, isLoading, Razorpay } = useRazorpay();
    const user = useSelector(state => state.user)

    const formatCurrency = (amount, currency = "INR") => {
        return `₹ ${Number(amount).toLocaleString("en-IN")}`;
    };

    const [quantities, setQuantities] = useState({})

    useEffect(() => {
        handleGetCart()
    }, [])

    const changeQty = (id, delta) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] ?? 1) + delta),
        }))
    }

    const getVariantDetails = (product, variantId) => {
        if (!product?.variants || !variantId) return null
        return product.variants
    }

    const getDisplayImage = (product, variant) => {
        if (variant?.images?.length) return variant.images[0].url
        if (product?.images?.length) return product.images[0].url
        return null
    }

    async function handleCheckout() {
        const order = await handleCreateCartOrder()
        console.log(order)

        const options = {
            key: "rzp_test_TAxsY1Pp8IufcQ",
            amount: order.amount,
            currency: order.currency,
            name: "Snitch",
            description: "Test Transaction",
            order_id: order.id,
            handler: async (response) => {
                const isValid = await handleVerifyCartOrder(response)
                if (isValid) {
                    navigate(`/order-success?order_id=${response?.razorpay_order_id}`)
                }
            },
            prefill: {
                name: user?.fullname,
                email: user?.email,
                contact: user?.contact,
            },
            theme: {
                color: "#000000",
            },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
    }

    /* ─── Empty state ─── */
    if (!cart?.items?.length) {
        return (
            <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6">
                <div className="w-28 h-28 rounded-full bg-neutral-100 flex items-center justify-center">
                    <i className="ri-shopping-bag-line text-5xl text-neutral-500"></i>
                </div>

                <h1 className="text-4xl font-semibold mt-8">
                    Your Cart is Empty
                </h1>

                <p className="text-neutral-500 mt-3 max-w-md">
                    Looks like you haven't added anything yet. Explore our collection and find something you love.
                </p>

                <Link
                    to="/"
                    className="mt-8 bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-800 transition"
                >
                    Continue Shopping
                </Link>
            </div>
        )
    }

    return (
        <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12">

            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-semibold">
                        Shopping Cart
                    </h1>

                    <p className="text-neutral-500 mt-2">
                        {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <button
                    onClick={() => navigate("/")}
                    className="hidden md:block border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition"
                >
                    Continue Shopping
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">

                {/* ── Cart Items ── */}
                <div className="flex-1 flex flex-col gap-6">
                    {cart.items.map((item) => {
                        const { product, variant: variantId, price, _id } = item
                        const variantDetail = getVariantDetails(product, variantId)
                        const imageUrl = getDisplayImage(product, variantDetail)
                        const displayPrice = price ?? variantDetail?.price ?? product?.price
                        const qty = quantities[_id] ?? item.quantity ?? 1
                        const attributes = variantDetail?.attributes ?? {}
                        const stock = variantDetail?.stock
                        const variantPrice = variantDetail?.price;

                        return (
                            <div
                                key={_id}
                                className="flex gap-5 bg-neutral-50 rounded-xl p-5"
                            >
                                {/* Image */}
                                <div className="relative w-28 sm:w-36 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={product?.title}
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            className="w-full aspect-[4/5] object-cover cursor-pointer"
                                        />
                                    ) : (
                                        <div className="w-full aspect-[4/5] bg-neutral-100" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="uppercase tracking-[3px] text-xs text-neutral-400">
                                            {product?.category || "Fashion"}
                                        </p>

                                        <h2 className="mt-2 text-lg font-medium line-clamp-1">
                                            {product?.title}
                                        </h2>

                                        {Object.keys(attributes).length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {Object.entries(attributes).map(([key, val]) => (
                                                    <span
                                                        key={key}
                                                        className="px-3 py-1 text-xs bg-neutral-100 rounded-full"
                                                    >
                                                        {val}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <p className="mt-2 text-xl font-semibold">
                                            {displayPrice ? formatCurrency(displayPrice.amount) : '—'}
                                        </p>

                                        {stock !== undefined && (
                                            <p className={`mt-1 text-xs ${stock > 0 ? 'text-neutral-400' : 'text-red-500'}`}>
                                                {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                                            </p>
                                        )}

                                        {variantPrice && displayPrice?.amount !== variantPrice?.amount && (
                                            <div className={`mt-3 rounded-lg border px-3.5 py-2.5 flex items-start gap-2.5 ${displayPrice.amount > variantPrice.amount
                                                ? "bg-[#f1f8f1] border-[#c8e6c9]"
                                                : "bg-[#fdf3ef] border-[#f5c4b3]"
                                                }`}>
                                                {displayPrice.amount > variantPrice.amount ? (
                                                    <i className="ri-checkbox-circle-line text-green-600 mt-0.5"></i>
                                                ) : (
                                                    <i className="ri-error-warning-line text-red-500 mt-0.5"></i>
                                                )}
                                                <div>
                                                    <p className={`text-xs font-medium mb-0.5 ${displayPrice.amount > variantPrice.amount ? "text-green-700" : "text-red-700"}`}>
                                                        Price updated
                                                    </p>
                                                    {displayPrice.amount > variantPrice.amount ? (
                                                        <>
                                                            <p className="text-sm text-neutral-800">
                                                                Now available for <span className="font-semibold">{formatCurrency(variantPrice.amount)}</span>
                                                            </p>
                                                            <p className="mt-1 text-xs text-green-700">
                                                                You save {formatCurrency(displayPrice.amount - variantPrice.amount)}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm text-neutral-800">
                                                                Current price is <span className="font-semibold">{formatCurrency(variantPrice.amount)}</span>
                                                            </p>
                                                            <p className="mt-1 text-xs text-red-700">
                                                                Additional {formatCurrency(variantPrice.amount - displayPrice.amount)} applies
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom row */}
                                    <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
                                        {/* Quantity */}
                                        <div className="flex items-center border border-neutral-300 rounded-full overflow-hidden">
                                            <button
                                                id={`qty-dec-${_id}`}
                                                onClick={async () => {
                                                    try {
                                                        await handleDecrementCartItem({
                                                            productId: product._id,
                                                            variantId,
                                                        });
                                                    } catch (err) {
                                                        toast.error(err?.response?.data?.message || "Failed to update quantity");
                                                    }
                                                }}
                                                className="w-9 h-9 flex items-center justify-center hover:bg-neutral-100 transition"
                                                aria-label="Decrease quantity"
                                            >
                                                <i className="ri-subtract-line text-sm"></i>
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium select-none">
                                                {qty}
                                            </span>
                                            <button
                                                id={`qty-inc-${_id}`}
                                                onClick={() => handleIncrementCartItem({ productId: product._id, variantId })}
                                                className="w-9 h-9 flex items-center justify-center hover:bg-neutral-100 transition"
                                                aria-label="Increase quantity"
                                            >
                                                <i className="ri-add-line text-sm"></i>
                                            </button>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            id={`remove-${_id}`}
                                            onClick={async () => {
                                                try {
                                                    await handleRemoveCartItem({
                                                        productId: product._id,
                                                        variantId,
                                                    });
                                                    toast.success("Item removed from cart 🗑️");
                                                } catch (err) {
                                                    toast.error(err?.response?.data?.message || "Failed to remove item");
                                                }
                                            }}
                                            className="w-11 h-11 border border-neutral-300 rounded-lg flex items-center justify-center hover:bg-neutral-100 transition"
                                        >
                                            <i className="ri-delete-bin-line text-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* Policy strip */}
                    <div className="mt-4 pt-6 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-xs text-neutral-500">
                        <div>
                            <p className="font-medium text-neutral-700 mb-1">Shipping</p>
                            <p>Complimentary over INR 15,000</p>
                        </div>
                        <div>
                            <p className="font-medium text-neutral-700 mb-1">Returns</p>
                            <p>Within 14 days of delivery</p>
                        </div>
                        <div>
                            <p className="font-medium text-neutral-700 mb-1">Authenticity</p>
                            <p>100% Guaranteed</p>
                        </div>
                    </div>
                </div>

                {/* ── Order Summary ── */}
                <div className="w-full lg:w-[360px] lg:sticky lg:top-24 h-fit">
                    <div className="bg-neutral-50 rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-6">
                            Order Summary
                        </h2>

                        <div className="flex flex-col gap-4 mb-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Subtotal</span>
                                <span className="font-medium">{formatCurrency(cart.totalPrice)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-neutral-500">Shipping</span>
                                <span className={shippingFree ? 'text-green-600 font-medium' : 'text-neutral-500'}>
                                    {shippingFree ? 'Free' : 'Complimentary over INR 15,000'}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-neutral-500">Duties & Taxes</span>
                                <span className="text-neutral-500">Included</span>
                            </div>
                        </div>

                        <div className="border-t border-neutral-200 pt-4 mb-6 flex justify-between items-center">
                            <span className="text-base font-semibold">Total</span>
                            <span className="text-xl font-bold">{formatCurrency(cart.totalPrice)}</span>
                        </div>

                        <button
                            id="proceed-checkout"
                            onClick={handleCheckout}
                            className="w-full bg-black text-white py-3 rounded-full hover:bg-neutral-800 transition mb-3"
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            id="continue-shopping"
                            onClick={() => navigate('/')}
                            className="w-full border border-black py-3 rounded-full hover:bg-black hover:text-white transition"
                        >
                            Continue Shopping
                        </button>

                        <p className="mt-6 text-center text-xs text-neutral-400">
                            Free returns within 14 days · Authenticity guaranteed
                        </p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Cart