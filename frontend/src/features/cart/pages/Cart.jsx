import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart'
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import {useRazorpay} from "react-razorpay"
/* ─── Inline styles & tokens matching the "Avenue Montaigne" design system ─── */
const tokens = {
    surface: '#fbf9f6',
    surfaceLow: '#f5f3f0',
    surfaceLowest: '#ffffff',
    surfaceHigh: '#eae8e5',
    surfaceHighest: '#e4e2df',
    onSurface: '#1b1c1a',
    onSurfaceVariant: '#4d463a',
    secondary: '#7A6E63',
    muted: '#B5ADA3',
    primary: '#C9A96E',
    primaryDark: '#745a27',
    outlineVariant: '#d0c5b5',
    outline: '#7f7668',
}
const Cart = () => {
    // const cartItems = useSelector(state => state.cart?.items)
    const cart = useSelector(state => state.cart)

    const shippingFree = cart.totalPrice >= 15000;

    const { handleGetCart, handleRemoveCartItem, handleIncrementCartItem, handleDecrementCartItem, handleAddItem 
        , handleCreateCartOrder, handleVerifyCartOrder
    } = useCart()

    const navigate = useNavigate()


    const { error, isLoading, Razorpay } = useRazorpay();
    const user = useSelector(state => state.user)


    const formatCurrency = (amount, currency = "INR") => {
        return `${currency} ${Number(amount).toLocaleString("en-IN")}`;
    };

    /* Local quantity state — key: cartItem._id, value: number */
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

    /* ─── Helpers ─── */
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
            amount: order.amount, // Amount in paise
            currency: order.currency,
            name: "Snitch",
            description: "Test Transaction",
            order_id: order.id, // Generate order_id on server
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
                color: tokens.primary,
            },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
    }


    /* ─── Empty state ─── */
    if (!cart?.items?.length) {
        return (
            <>
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .empty-fade { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
                `}</style>
                <div
                    className="min-h-screen flex flex-col"
                    style={{ backgroundColor: tokens.surface, fontFamily: "'Inter', sans-serif" }}
                >
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-24 px-8 empty-fade">
                        <span
                            className="text-[10px] uppercase tracking-[0.3em] font-medium"
                            style={{ color: tokens.primary }}
                        >
                            Cart
                        </span>
                        <p
                            className="text-5xl md:text-6xl font-light leading-tight text-center"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: tokens.onSurface }}
                        >
                            Your selection is empty.
                        </p>
                        <p
                            className="text-[10px] uppercase tracking-[0.22em]"
                            style={{ color: tokens.muted }}
                        >
                            Curate your collection
                        </p>
                        <Link
                            to="/"
                            className="mt-4 px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                            style={{
                                backgroundColor: tokens.onSurface,
                                color: tokens.surface,
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = tokens.primary
                                e.currentTarget.style.color = tokens.onSurface
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = tokens.onSurface
                                e.currentTarget.style.color = tokens.surface
                            }}
                        >
                            Explore the Archive
                        </Link>
                    </div>
                </div>  
            </>
        )
    }

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <style>{`
                html { scroll-behavior: smooth; }
                ::selection { background-color: rgba(201, 169, 110, 0.3); }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .fade-in { animation: fadeIn 0.9s ease both; }
                .fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
                .cart-row {
                    transition: box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .cart-row:hover {
                    box-shadow: 0 12px 28px rgba(27,28,26,0.06);
                    transform: translateY(-2px);
                }
                .cart-row-img {
                    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .cart-row:hover .cart-row-img {
                    transform: scale(1.04);
                }
                .qty-btn {
                    transition: background-color 0.2s ease, color 0.2s ease;
                }
                .remove-btn {
                    position: relative;
                }
                .remove-btn::after {
                    content: '';
                    position: absolute;
                    left: 0; bottom: -2px;
                    width: 100%; height: 1px;
                    background-color: currentColor;
                    transform: scaleX(0);
                    transform-origin: right;
                    transition: transform 0.3s ease;
                }
                .remove-btn:hover::after {
                    transform: scaleX(1);
                    transform-origin: left;
                }
                .summary-card {
                    transition: box-shadow 0.4s ease;
                }
            `}</style>

            <div
                className="min-h-screen pb-24 selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: tokens.surface, fontFamily: "'Inter', sans-serif" }}
            >

                {/* ── Main Content ── */}
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 pt-6 sm:pt-8 lg:pt-12">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                        {/* ═══════════════════════════════════════════════
                            LEFT COLUMN — Cart Items (65%)
                        ═══════════════════════════════════════════════ */}
                        <div className="w-full lg:w-[65%]">
                            {/* Heading */}
                            <div className="mb-10 fade-in">
                                <span
                                    className="text-[10px] uppercase tracking-[0.3em] font-medium mb-2 block"
                                    style={{ color: tokens.primary }}
                                >
                                    Shopping Cart
                                </span>
                                <h1
                                    className="font-light leading-[1.05] mb-3"
                                    style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        color: tokens.onSurface,
                                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                    }}
                                >
                                    Your Selection
                                </h1>
                                <div className="w-14 h-px mb-3" style={{ backgroundColor: tokens.primary }} />
                                <p
                                    className="text-[10px] uppercase tracking-[0.24em] font-medium"
                                    style={{ color: tokens.muted }}
                                >
                                    {cart?.items?.length} {cart?.items?.length === 1 ? 'piece' : 'pieces'}
                                </p>
                            </div>

                            {/* ── Cart Item List ── */}
                            <div className="flex flex-col gap-6">
                                {cart.items.map((item, idx) => {
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
                                            className="cart-row fade-in-up flex gap-6 md:gap-8 p-6 md:p-8 rounded-sm"
                                            style={{ backgroundColor: tokens.surfaceLow, animationDelay: `${Math.min(idx * 70, 350)}ms` }}
                                        >
                                            {/* Product Image */}
                                            <div
                                                className="flex-shrink-0 overflow-hidden rounded-sm"
                                                style={{
                                                    width: 'clamp(100px, 15vw, 160px)',
                                                    aspectRatio: '4/5',
                                                    backgroundColor: tokens.surfaceHighest,
                                                }}
                                            >
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={product?.title}
                                                        className="cart-row-img w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-full h-full flex items-center justify-center"
                                                        style={{ backgroundColor: tokens.surfaceHigh }}
                                                    />
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    {/* Title */}
                                                    <h2
                                                        className="font-light leading-tight mb-3"
                                                        style={{
                                                            fontFamily: "'Cormorant Garamond', serif",
                                                            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                                                            color: tokens.onSurface,
                                                        }}
                                                    >
                                                        {product?.title}
                                                    </h2>

                                                    {/* Variant Attribute Chips */}
                                                    {Object.keys(attributes).length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {Object.entries(attributes).map(([key, val]) => (
                                                                <span
                                                                    key={key}
                                                                    className="px-3 py-1 text-[9px] uppercase tracking-[0.18em] font-medium rounded-sm"
                                                                    style={{
                                                                        backgroundColor: tokens.primary,
                                                                        color: '#fff',
                                                                    }}
                                                                >
                                                                    {val}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Price */}
                                                    <p
                                                        className="text-[11px] uppercase tracking-[0.2em] font-medium mb-1"
                                                        style={{ color: tokens.onSurface }}
                                                    >
                                                        {displayPrice
                                                            ? formatCurrency(displayPrice.amount, displayPrice.currency)
                                                            : '—'}
                                                    </p>

                                                    {/* Stock */}
                                                    {stock !== undefined && (
                                                        <p
                                                            className="text-[10px] uppercase tracking-[0.15em] mb-4"
                                                            style={{ color: stock > 0 ? tokens.muted : '#b5504a' }}
                                                        >
                                                            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                                                        </p>
                                                    )}

                                                    {variantPrice && displayPrice?.amount !== variantPrice?.amount && (
                                                        <div className={`mt-2 mb-4 rounded-[10px] border px-3.5 py-2.5 flex items-start gap-2.5 ${displayPrice.amount > variantPrice.amount
                                                            ? "bg-[#f1f8f1] border-[#c8e6c9]"
                                                            : "bg-[#fdf3ef] border-[#f5c4b3]"
                                                            }`}>

                                                            {/* Icon */}
                                                            {displayPrice.amount > variantPrice.amount ? (
                                                                <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b8f3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b5503a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                                                </svg>
                                                            )}

                                                            {/* Text */}
                                                            <div>
                                                                <p className={`text-[10px] uppercase tracking-[0.08em] font-medium mb-0.5 ${displayPrice.amount > variantPrice.amount ? "text-[#3b7a3b]" : "text-[#8f4030]"
                                                                    }`}>
                                                                    Price updated
                                                                </p>

                                                                {displayPrice.amount > variantPrice.amount ? (
                                                                    <>
                                                                        <p className="text-[13px] text-[#1B1C1A] leading-relaxed">
                                                                            Now available for{" "}
                                                                            <span className="font-semibold">
                                                                                {formatCurrency(variantPrice.amount, variantPrice.currency)}
                                                                            </span>
                                                                        </p>
                                                                        <p className="mt-1 text-[11px] text-[#3b7a3b]">
                                                                            You save {formatCurrency(displayPrice.amount - variantPrice.amount, variantPrice.currency)}
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <p className="text-[13px] text-[#1B1C1A] leading-relaxed">
                                                                            Current price is{" "}
                                                                            <span className="font-semibold">
                                                                                {formatCurrency(variantPrice.amount, variantPrice.currency)}
                                                                            </span>
                                                                        </p>
                                                                        <p className="mt-1 text-[11px] text-[#b5503a]">
                                                                            Additional {formatCurrency(variantPrice.amount - displayPrice.amount, variantPrice.currency)} applies
                                                                        </p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>




                                                {/* Bottom Row: Quantity + Remove */}
                                                <div className="flex items-center justify-between flex-wrap gap-4">
                                                    {/* Quantity Stepper */}
                                                    <div
                                                        className="flex items-center rounded-sm overflow-hidden"
                                                        style={{ border: `1px solid ${tokens.outlineVariant}` }}
                                                    >
                                                        <button
                                                            id={`qty-dec-${_id}`}
                                                            onClick={async () => {
                                                                try {
                                                                    await handleDecrementCartItem({
                                                                        productId: product._id,
                                                                        variantId,
                                                                    });

                                                                } catch (err) {
                                                                    toast.error(
                                                                        err?.response?.data?.message || "Failed to update quantity"
                                                                    );
                                                                }
                                                            }}
                                                            className="qty-btn w-9 h-9 flex items-center justify-center text-sm font-light"
                                                            style={{ color: tokens.onSurface, borderRight: `1px solid ${tokens.outlineVariant}` }}
                                                            aria-label="Decrease quantity"
                                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = tokens.surfaceHighest }}
                                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                                                        >
                                                            −
                                                        </button>
                                                        <span
                                                            className="w-10 text-center text-[11px] tracking-[0.12em] font-medium select-none"
                                                            style={{ color: tokens.onSurface }}
                                                        >
                                                            {qty}
                                                        </span>
                                                        <button
                                                            onClick={() => handleIncrementCartItem({

                                                                productId: product._id, variantId
                                                            })

                                                            }
                                                            id={`qty-inc-${_id}`}

                                                            className="qty-btn w-9 h-9 flex items-center justify-center text-sm font-light"
                                                            style={{ color: tokens.onSurface, borderLeft: `1px solid ${tokens.outlineVariant}` }}
                                                            aria-label="Increase quantity"
                                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = tokens.surfaceHighest }}
                                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Remove */}
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await handleRemoveCartItem({
                                                                    productId: product._id,
                                                                    variantId,
                                                                });

                                                                toast.success("Item removed from cart 🗑️");
                                                            } catch (err) {
                                                                toast.error(
                                                                    err?.response?.data?.message || "Failed to remove item"
                                                                );
                                                            }
                                                        }}
                                                        id={`remove-${_id}`}
                                                        className="remove-btn text-[10px] uppercase tracking-[0.22em] font-medium transition-opacity duration-200 hover:opacity-70"
                                                        style={{ color: tokens.muted }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Policy strip */}
                            <div
                                className="mt-10 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-[10px] uppercase tracking-[0.12em] fade-in"
                                style={{ borderTop: `1px solid ${tokens.surfaceHighest}`, color: tokens.muted }}
                            >
                                <div>
                                    <p className="font-medium mb-1" style={{ color: tokens.secondary }}>Shipping</p>
                                    <p>Complimentary over INR 15,000</p>
                                </div>
                                <div>
                                    <p className="font-medium mb-1" style={{ color: tokens.secondary }}>Returns</p>
                                    <p>Within 14 days of delivery</p>
                                </div>
                                <div>
                                    <p className="font-medium mb-1" style={{ color: tokens.secondary }}>Authenticity</p>
                                    <p>100% Guaranteed</p>
                                </div>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════════════
                            RIGHT COLUMN — Order Summary (35%, Sticky)
                        ═══════════════════════════════════════════════ */}
                        <div className="w-full lg:w-[35%] lg:sticky lg:top-28 fade-in-up">
                            <div
                                className="summary-card p-8 rounded-sm"
                                style={{ backgroundColor: tokens.surfaceLowest, boxShadow: '0 20px 40px rgba(27,28,26,0.06)' }}
                            >
                                {/* Heading */}
                                <span
                                    className="text-[10px] uppercase tracking-[0.3em] font-medium mb-2 block"
                                    style={{ color: tokens.primary }}
                                >
                                    Summary
                                </span>
                                <h2
                                    className="font-light mb-6"
                                    style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: '1.75rem',
                                        color: tokens.onSurface,
                                    }}
                                >
                                    The Total
                                </h2>

                                {/* Tonal divider */}
                                <div className="mb-6" style={{ height: 1, backgroundColor: tokens.surfaceHighest }} />

                                {/* Line items */}
                                <div className="flex flex-col gap-4 mb-6">
                                    <div className="flex justify-between items-baseline">
                                        <span
                                            className="text-[10px] uppercase tracking-[0.18em]"
                                            style={{ color: tokens.secondary }}
                                        >
                                            Subtotal
                                        </span>
                                        <span
                                            className="text-[11px] uppercase tracking-[0.12em] font-medium"
                                            style={{ color: tokens.onSurface }}
                                        >
                                            {formatCurrency(cart.totalPrice)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-baseline">
                                        <span
                                            className="text-[10px] uppercase tracking-[0.18em]"
                                            style={{ color: tokens.secondary }}
                                        >
                                            Shipping
                                        </span>
                                        <span
                                            className="text-[10px] uppercase tracking-[0.1em]"
                                            style={{ color: shippingFree ? '#5a7a5a' : tokens.muted }}
                                        >
                                            {cart.totalPrice >= 15000 ? 'Complimentary' : `Complimentary over INR 15,000`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-baseline">
                                        <span
                                            className="text-[10px] uppercase tracking-[0.18em]"
                                            style={{ color: tokens.secondary }}
                                        >
                                            Duties & Taxes
                                        </span>
                                        <span
                                            className="text-[10px] uppercase tracking-[0.1em]"
                                            style={{ color: tokens.muted }}
                                        >
                                            Included
                                        </span>
                                    </div>
                                </div>

                                {/* Total divider */}
                                <div className="mb-6" style={{ height: 1, backgroundColor: tokens.surfaceHighest }} />

                                {/* Grand Total */}
                                <div className="flex justify-between items-baseline mb-8">
                                    <span
                                        className="  text-sm font-medium"
                                        style={{ color: tokens.onSurface }}
                                    >
                                        Total
                                    </span>
                                    <span
                                        className="text-base uppercase tracking-[0.18em]  font-medium"
                                        style={{ fontFamily: "mono", color: tokens.onSurface }}
                                    >
                                        {formatCurrency(cart.totalPrice)}
                                    </span>
                                </div>

                                {/* Primary CTA */}
                                <button
                                    id="proceed-checkout"
                                    className="w-full py-4 mb-3 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                    style={{
                                        backgroundColor: tokens.onSurface,
                                        color: tokens.surface,
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = tokens.primary
                                        e.currentTarget.style.color = tokens.onSurface
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = tokens.onSurface
                                        e.currentTarget.style.color = tokens.surface
                                    }}
                                   onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </button>

                                {/* Secondary ghost CTA */}
                                <button
                                    id="continue-shopping"
                                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: `1px solid ${tokens.outlineVariant}`,
                                        color: tokens.onSurface,
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = tokens.primary
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = tokens.outlineVariant
                                    }}
                                    onClick={() => navigate('/')}
                                >
                                    Continue Shopping
                                </button>

                                {/* Policy footnote */}
                                <p
                                    className="mt-6 text-center text-[9px] uppercase tracking-[0.14em] leading-relaxed"
                                    style={{ color: tokens.muted }}
                                >
                                    Free returns within 14 days · Authenticity guaranteed
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart