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
    const [similarProducts, setSimilarProducts] = useState([]);
    const {
        
        handleGetSimilarProducts
    } = useProduct();
    useEffect(() => {

        async function load() {

            const data = await handleGetSimilarProducts(productId);

            setSimilarProducts(data);

        }

        load();

    }, [productId]);

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
            <div className="h-screen flex items-center justify-center bg-white">
                <p className="text-xs uppercase tracking-[2px] text-neutral-400 font-medium animate-pulse">
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
        <div className="min-h-screen bg-white">

            {/* ── Main content ── */}
            <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-16 xl:px-24 py-8">
                <div className="w-full h-full max-h-full flex flex-col lg:flex-row gap-6 lg:gap-12 xl:gap-16 items-center lg:items-stretch">

                    {/* ── LEFT: Image Gallery ── */}
                    <div className="w-full lg:w-[48%] xl:w-[46%] h-[34vh] sm:h-[38vh] lg:h-full flex flex-row-reverse lg:flex-row gap-2.5 lg:gap-3 shrink-0">

                        {/* Main Image */}
                        <div className="relative flex-1 h-full max-w-sm mx-auto lg:mx-0 overflow-hidden group rounded-xl bg-neutral-100">
                            <img
                                src={displayImages[selectedImage]?.url || displayImages[0].url}
                                alt={product.title}
                                className="w-full h-full object-cover transition-opacity duration-500"
                            />
                            {displayImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                                        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition"
                                        aria-label="Previous image"
                                    >
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
                                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition"
                                        aria-label="Next image"
                                    >
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 5l7 7-7 7" /></svg>
                                    </button>

                                    {/* Image counter */}
                                    <span className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 text-[10px] uppercase tracking-[2px] font-medium px-2 py-0.5 sm:py-1 rounded-full bg-white/90 text-neutral-700">
                                        {selectedImage + 1} / {displayImages.length}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Thumbnails — vertical strip, scrolls internally if many images */}
                        {displayImages.length > 1 && (
                            <div className="flex flex-col gap-2 overflow-y-auto w-12 sm:w-14 lg:w-16 flex-shrink-0 h-full">
                                {displayImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`flex-shrink-0 w-full aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100 ${selectedImage === idx ? 'ring-2 ring-black' : 'opacity-50 hover:opacity-100'}`}
                                    >
                                        <img
                                            src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Product Details ── */}
                    <div className="w-full lg:w-[52%] xl:w-[54%] flex-1 min-h-0 flex flex-col justify-center lg:pr-1">

                        <span className="uppercase tracking-[3px] text-xs text-neutral-400 mb-2 block">
                            Snitch
                        </span>

                        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-[2.25rem] font-semibold leading-[1.08] mb-2">
                            {product.title}
                        </h1>

                        <div className="mb-3 sm:mb-4">
                            <span className="text-lg sm:text-xl font-semibold">
                                {displayPrice?.currency} {displayPrice?.amount?.toLocaleString()}
                            </span>
                        </div>

                        <div className="h-px w-full mb-3 sm:mb-4 flex-shrink-0 bg-neutral-200" />

                        <div className="mb-4 sm:mb-5">
                            <h3 className="text-xs uppercase tracking-[2px] font-medium mb-1.5 sm:mb-2 text-neutral-400">
                                The Details
                            </h3>
                            <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 lg:line-clamp-3 text-neutral-500">
                                {product.description}
                            </p>
                        </div>

                        {/* Options/Variants */}
                        {Object.entries(availableAttributes).map(([attrName, values]) => (
                            <div key={attrName} className="mb-3 sm:mb-4">
                                <h3 className="text-xs uppercase tracking-[2px] font-medium mb-2 text-neutral-400">
                                    {attrName}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {values.map(val => {
                                        const isSelected = selectedAttributes[attrName] === val;
                                        return (
                                            <button
                                                key={val}
                                                onClick={() => handleAttributeChange(attrName, val)}
                                                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] uppercase tracking-[0.15em] font-medium border rounded-lg transition ${isSelected ? 'border-black bg-black text-white' : 'border-neutral-200 text-black hover:border-black'}`}
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
                                    className={`w-1.5 h-1.5 rounded-full ${activeVariant.stock > 0 ? 'bg-green-700' : 'bg-red-700'}`}
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
                                className="w-full py-3 rounded-lg bg-black text-white text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-neutral-800 transition"
                            >
                                Add to Cart
                            </button>

                            <button
                                className="w-full py-3 rounded-lg border border-neutral-200 text-black text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-neutral-100 transition"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Extra details */}
                        <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-[10px] uppercase tracking-[0.1em] flex-shrink-0 text-neutral-400">
                            <div className="flex justify-between border-b border-neutral-200 pb-1.5 sm:pb-2">
                                <span>Shipping</span>
                                <span className="text-right">Complimentary over INR 15,000</span>
                            </div>
                            <div className="flex justify-between border-b border-neutral-200 pb-1.5 sm:pb-2">
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

            {/* Similar Products */}

            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 xl:px-24 pb-20">

                <h2 className="text-4xl font-semibold mb-10">
                    You May Also Like
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

                    {similarProducts.map((item) => (

                        <div
                            key={item._id}
                            onClick={() => navigate(`/product/${item._id}`)}
                            className="cursor-pointer group"
                        >
                            <div className="overflow-hidden rounded-xl bg-neutral-100">
                                <img
                                    src={item.images[0]?.url}
                                    className="w-full aspect-[4/5] object-cover transition duration-500 group-hover:scale-105"
                                />
                            </div>

                            <h3 className="mt-4 font-semibold">
                                {item.title}
                            </h3>

                            <p className="text-neutral-500">
                                ₹ {item.price.amount}
                            </p>

                        </div>

                    ))}

                </div>

            </div>
        </div>
    );
};

export default ProductDetail;