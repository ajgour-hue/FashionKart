import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { useCart } from '../../cart/hook/useCart.js';
import toast from "react-hot-toast";                 
const ProductDetail = () => {


    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const { handleGetProductById } = useProduct();
    const { handleAddItem } = useCart();
    const navigate = useNavigate();

    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            // Handle both cases depending on how API is structured
            setProduct(data?.product || data);
        } catch (error) {
            console.error("Failed to fetch product details", error);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);



    // useEffect(() => {
    //     if (product?.variants?.length > 0) {
    //         setSelectedAttributes(product.variants[0].attributes || {});
    //     }
    // }, [product]);



    const activeVariant = useMemo(() => {
        if (!product?.variants) return null;

        if (Object.keys(selectedAttributes).length === 0) {
            return null;
        }

        return (
            product.variants.find(variant =>
                Object.entries(selectedAttributes).every(
                    ([key, value]) =>
                        variant.attributes?.[key] === value
                )
            ) || null
        );
    }, [product, selectedAttributes]);


    const availableAttributes = useMemo(() => {
        if (!product?.variants) return {};
        const attrs = {};
        product.variants.forEach(variant => {
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([key, value]) => {
                    if (!attrs[key]) attrs[key] = new Set();
                    attrs[key].add(value);
                });
            }
        });
        Object.keys(attrs).forEach(key => {
            attrs[key] = Array.from(attrs[key]);
        });
        return attrs;
    }, [product]);

    useEffect(() => {
        setSelectedImage(0);
    }, [activeVariant]);

    const handleAttributeChange = (attrName, value) => {
        const newAttrs = { ...selectedAttributes, [attrName]: value };

        // Find if an exact match exists for this combination
        const exactMatch = product.variants.find(v => {
            const vAttrs = v.attributes || {};
            return Object.keys(newAttrs).every(k => newAttrs[k] === vAttrs[k]) &&
                Object.keys(vAttrs).every(k => newAttrs[k] === vAttrs[k]);
        });

        if (exactMatch) {
            setSelectedAttributes(exactMatch.attributes);
        } else {
            // Find any variant that has this newly selected attribute to fallback nicely
            const fallbackVariant = product.variants.find(v => v.attributes && v.attributes[attrName] === value);
            if (fallbackVariant) {
                setSelectedAttributes(fallbackVariant.attributes);
            } else {
                setSelectedAttributes(newAttrs);
            }
        }
    };


    if (!product) {
        return (
            <div className="h-screen flex items-center justify-center selection:bg-[#C9A96E]/30" style={{ backgroundColor: '#fbf9f6' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", color: '#B5ADA3' }} className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse">
                    Retrieving piece...
                </p>
            </div>
        );
    }

    // const images = product.images && product.images.length > 0 ? product.images : [ { url: '/snitch_editorial_warm.png' } ];

    // console.log(product)

    // Fallbacks
    const displayImages = (activeVariant?.images && activeVariant.images.length > 0)
        ? activeVariant.images
        : (product.images && product.images.length > 0 ? product.images : [{ url: '/snitch_editorial_warm.png' }]);

    const displayPrice = activeVariant?.price?.amount
        ? activeVariant.price
        : product.price;

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />

            <style>{`
            ::selection { background-color: rgba(201, 169, 110, 0.3); }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(16px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .fade-in { animation: fadeIn 0.6s ease both; }
            .fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            .main-image-wrap img {
                transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .main-image-wrap:hover img {
                transform: scale(1.03);
            }
            .thumb-btn {
                transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .variant-btn {
                transition: all 0.3s ease;
            }
            .action-btn {
                position: relative;
                overflow: hidden;
            }
        `}</style>

            <div
                className="h-screen overflow-hidden selection:bg-[#C9A96E]/30 flex flex-col"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >

                {/* ── Main content (fills remaining viewport, no scroll anywhere) ── */}
                <div className="flex-1 min-h-0 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-16 xl:px-24 py-4 sm:py-6 lg:py-8 flex items-center">
                    <div className="w-full h-full max-h-full flex flex-col lg:flex-row gap-6 lg:gap-12 xl:gap-16 items-center lg:items-stretch">

                        {/* ── LEFT: Image Gallery ── */}
                        <div className="w-full lg:w-[48%] xl:w-[46%] h-[34vh] sm:h-[38vh] lg:h-full flex flex-row-reverse lg:flex-row gap-2.5 lg:gap-3 fade-in shrink-0">

                            {/* Main Image */}
                            <div className="main-image-wrap relative flex-1 h-full max-w-sm mx-auto lg:mx-0 overflow-hidden group rounded-sm" style={{ backgroundColor: '#f5f3f0' }}>
                                <img
                                    src={displayImages[selectedImage]?.url || displayImages[0].url}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />
                                {/* Subtle bottom gradient for depth */}
                                <div
                                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ background: 'linear-gradient(to top, rgba(27,28,26,0.12), transparent 35%)' }}
                                />
                                {displayImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                                            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                                            style={{ backgroundColor: 'rgba(251,249,246,0.8)', borderColor: '#e4e2df', color: '#1b1c1a' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fbf9f6'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(251,249,246,0.8)'}
                                            aria-label="Previous image"
                                        >
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 19l-7-7 7-7" /></svg>
                                        </button>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
                                            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                                            style={{ backgroundColor: 'rgba(251,249,246,0.8)', borderColor: '#e4e2df', color: '#1b1c1a' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fbf9f6'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(251,249,246,0.8)'}
                                            aria-label="Next image"
                                        >
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 5l7 7-7 7" /></svg>
                                        </button>

                                        {/* Image counter */}
                                        <span
                                            className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-medium px-2 py-0.5 sm:py-1"
                                            style={{ backgroundColor: 'rgba(251,249,246,0.85)', color: '#1b1c1a' }}
                                        >
                                            {selectedImage + 1} / {displayImages.length}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails — vertical strip, scrolls internally if many images */}
                            {displayImages.length > 1 && (
                                <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide w-12 sm:w-14 lg:w-16 flex-shrink-0 h-full">
                                    {displayImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`thumb-btn flex-shrink-0 w-full aspect-[4/5] overflow-hidden rounded-sm ${selectedImage === idx ? 'opacity-100 ring-1 ring-[#C9A96E] ring-offset-1' : 'opacity-50 hover:opacity-100'}`}
                                            style={{ backgroundColor: '#f5f3f0', '--tw-ring-offset-color': '#fbf9f6' }}
                                        >
                                            <img
                                                src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── RIGHT: Product Details (no scroll — fits within viewport) ── */}
                        <div className="w-full lg:w-[52%] xl:w-[54%] flex-1 min-h-0 flex flex-col justify-center lg:pr-1 fade-in-up">

                            <span
                                className="text-[10px] uppercase tracking-[0.3em] font-medium mb-2 block"
                                style={{ color: '#C9A96E' }}
                            >
                                Snitch
                            </span>

                            <h1
                                className="text-xl sm:text-2xl lg:text-3xl xl:text-[2.25rem] font-light leading-[1.08] mb-2"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                {product.title}
                            </h1>

                            <div className="mb-3 sm:mb-4">
                                <span
                                    className="text-xs sm:text-sm uppercase tracking-[0.2em] font-medium"
                                    style={{ color: '#1b1c1a' }}
                                >
                                    {displayPrice?.currency} {displayPrice?.amount?.toLocaleString()}
                                </span>
                            </div>

                            <div className="h-px w-full mb-3 sm:mb-4 flex-shrink-0" style={{ backgroundColor: '#e4e2df' }} />

                            <div className="mb-4 sm:mb-5">
                                <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-1.5 sm:mb-2" style={{ color: '#C9A96E' }}>
                                    The Details
                                </h3>
                                <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 lg:line-clamp-3" style={{ color: '#7A6E63' }}>
                                    {product.description}
                                </p>
                            </div>

                            {/* Options/Variants */}
                            {Object.entries(availableAttributes).map(([attrName, values]) => (
                                <div key={attrName} className="mb-3 sm:mb-4">
                                    <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-2" style={{ color: '#C9A96E' }}>
                                        {attrName}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {values.map(val => {
                                            const isSelected = selectedAttributes[attrName] === val;
                                            return (
                                                <button
                                                    key={val}
                                                    onClick={() => handleAttributeChange(attrName, val)}
                                                    className={`variant-btn px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] uppercase tracking-[0.15em] font-medium border ${isSelected ? 'border-[#1b1c1a] bg-[#1b1c1a] text-[#fbf9f6]' : 'border-[#d0c5b5] text-[#1b1c1a] hover:border-[#1b1c1a]'}`}
                                                    style={isSelected ? {} : { backgroundColor: 'transparent' }}
                                                >
                                                    {val}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Stock Information */}
                            {activeVariant && activeVariant.stock !== undefined && (
                                <div className="mb-3 sm:mb-4 flex items-center gap-2">
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: activeVariant.stock > 0 ? '#15803d' : '#b91c1c' }}
                                    />
                                    <span className={`text-[10px] uppercase tracking-[0.2em] font-medium ${activeVariant.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                        {activeVariant.stock > 0 ? `${activeVariant.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col gap-2 sm:gap-2.5 flex-shrink-0">
                                <button
                                    onClick={async () => {
                                        if (!activeVariant) {
                                            toast.error("Please select a variant");
                                            return;
                                        }

                                        try {
                                            await handleAddItem({
                                                productId: product._id,
                                                variantId: activeVariant._id,
                                            });

                                            toast.success("Added to cart 🛒");
                                        } catch (err) {
                                            toast.error(err.response?.data?.message || "Something went wrong");
                                        }
                                    }}

                                    
                                    className="action-btn w-full py-2.5 sm:py-3 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                    style={{
                                        backgroundColor: '#1b1c1a',
                                        color: '#fbf9f6',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = '#C9A96E';
                                        e.currentTarget.style.color = '#1b1c1a';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = '#1b1c1a';
                                        e.currentTarget.style.color = '#fbf9f6';
                                    }}
                                >
                                    Add to Cart
                                </button>

                                <button
                                    className="action-btn w-full py-2.5 sm:py-3 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border"
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: '#d0c5b5',
                                        color: '#1b1c1a',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#C9A96E';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = '#d0c5b5';
                                    }}
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Extra elegant details */}
                            <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-[9px] sm:text-[10px] uppercase tracking-[0.1em] flex-shrink-0" style={{ color: '#B5ADA3' }}>
                                <div className="flex justify-between border-b pb-1.5 sm:pb-2" style={{ borderColor: '#e4e2df' }}>
                                    <span>Shipping</span>
                                    <span className="text-right">Complimentary over INR 15,000</span>
                                </div>
                                <div className="flex justify-between border-b pb-1.5 sm:pb-2" style={{ borderColor: '#e4e2df' }}>
                                    <span>Returns</span>
                                    <span className="text-right">Within 14 days</span>
                                </div>
                                <div className="flex justify-between pb-1">
                                    <span>Authenticity</span>
                                    <span className="text-right">100% Guaranteed</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;