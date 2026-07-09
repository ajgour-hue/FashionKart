import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { useWishlist } from "../hook/useWishlist";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from "react-hot-toast";



const Home = () => {
    const products = useSelector(state => state.product.products);
    const user = useSelector(state => state.auth.user);
    const wishlist = useSelector((state) => state.wishlist.items);

    const { handleGetAllProducts } = useProduct();
    const {
        handleAddToWishlist,
        handleRemoveFromWishlist,
    } = useWishlist();

    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            handleGetAllProducts(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const { handleGetWishlist } = useWishlist();

    useEffect(() => {
        handleGetWishlist();
    }, []);



    return (
        <div className="min-h-screen bg-white">
            <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12">

                {/* ── Header ── */}
                <div className="flex flex-col items-center text-center mb-14">

                    <span className="uppercase tracking-[3px] text-xs text-neutral-400 font-medium mb-3">
                        New Arrivals
                    </span>

                    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                        The Collection
                    </h1>

                    <p className="text-neutral-500 mt-4 max-w-md leading-relaxed">
                        Discover our latest curation of premium minimalist pieces,
                        meticulously designed for effortless elegance and enduring quality.
                    </p>

                    {/* Search */}
                    <div className="max-w-md w-full mt-8 relative">
                        <i className="ri-search-line absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 text-lg"></i>
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-5 py-3.5 rounded-full border border-neutral-200 text-sm outline-none focus:border-black focus:ring-4 focus:ring-neutral-100 transition-all"
                        />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 sm:gap-14 mt-10 bg-neutral-50 rounded-full px-8 sm:px-12 py-5">

                        <div className="flex flex-col items-center">
                            <span className="text-xl sm:text-2xl font-bold">250+</span>
                            <span className="text-[10px] uppercase tracking-[2px] text-neutral-500 mt-0.5">
                                Pieces
                            </span>
                        </div>

                        <div className="w-px h-8 bg-neutral-200" />

                        <div className="flex flex-col items-center">
                            <span className="text-xl sm:text-2xl font-bold flex items-center gap-1">
                                4.8 <i className="ri-star-fill text-amber-400 text-sm"></i>
                            </span>
                            <span className="text-[10px] uppercase tracking-[2px] text-neutral-500 mt-0.5">
                                Avg Rating
                            </span>
                        </div>

                        <div className="w-px h-8 bg-neutral-200" />

                        <div className="flex flex-col items-center">
                            <span className="text-xl sm:text-2xl font-bold">10k+</span>
                            <span className="text-[10px] uppercase tracking-[2px] text-neutral-500 mt-0.5">
                                Happy Clients
                            </span>
                        </div>

                    </div>
                </div>

                {/* ── Product Grid ── */}
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                        {products.map((product) => {
                            const imageUrl = product.images && product.images.length > 0
                                ? product.images[0].url
                                : '/snitch_editorial_warm.png';

                            const currentPrice = product.price?.amount;
                            const originalPrice = product.price?.originalAmount || product.originalPrice;
                            const discountPercent = product.price?.discountPercent || product.discount;
                            const isWishlisted = wishlist.some(
                                (item) => item.product._id === product._id
                            );

                            return (
                                <div
                                    key={product._id}
                                    className="group"
                                >

                                    <div className="relative overflow-hidden rounded-xl bg-neutral-100">

                                        <div
                                            className="relative overflow-hidden rounded-xl bg-neutral-100 group/img"
                                        >
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                loading="lazy"
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                className="w-full aspect-[4/5] object-cover cursor-pointer transition duration-500 group-hover/img:scale-105"
                                            />

                                            {/* Hover overlay */}
                                            <div
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-all duration-300 flex items-center justify-center cursor-pointer"
                                            >
                                                <span
                                                    className="bg-white text-black text-xs uppercase tracking-[2px] font-medium px-6 py-3 rounded-full opacity-0 translate-y-3 group-hover/img:opacity-100 group-hover/img:translate-y-0 transition-all duration-300"
                                                >
                                                    View Piece
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();

                                                if (isWishlisted) {
                                                    await handleRemoveFromWishlist(product._id);
                                                    toast.success("Removed to wishlist");
                                                } else {
                                                    await handleAddToWishlist(product._id);
                                                    toast.success("Added to wishlist");
                                                }
                                            }}
                                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                        >
                                            {isWishlisted ? (
                                                <i className="ri-heart-fill text-red-500"></i>
                                            ) : (
                                                <i className="ri-heart-line"></i>
                                            )}
                                        </button>

                                    </div>

                                    <div className="mt-5">

                                        <p className="uppercase tracking-[3px] text-xs text-neutral-400">
                                            {product.category || "Fashion"}
                                        </p>

                                        <h2 className="mt-2 text-lg font-medium line-clamp-1">
                                            {product.title}
                                        </h2>

                                        <p className="mt-1 text-sm text-neutral-500 line-clamp-1">
                                            {product.description || 'A premium minimalist piece from Snitch.'}
                                        </p>

                                        <div className="mt-3 flex items-center flex-wrap gap-x-2 gap-y-1">
                                            <span className="text-xl font-semibold">
                                                ₹ {currentPrice?.toLocaleString()}
                                            </span>

                                            {originalPrice && (
                                                <span className="text-sm text-neutral-400 line-through">
                                                    Rs. {originalPrice?.toLocaleString()}
                                                </span>
                                            )}

                                            {discountPercent && (
                                                <span className="text-sm font-semibold text-orange-600">
                                                    ({discountPercent}% OFF)
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-6 flex gap-3">

                                            {/* <button
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-neutral-800 transition"
                                            >
                                                View Product
                                            </button> */}

                                            {/* <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();

                                                    if (isWishlisted) {
                                                        await handleRemoveFromWishlist(product._id);
                                                        toast.success("Removed to wishlist");
                                                    } else {
                                                        await handleAddToWishlist(product._id);
                                                        toast.success("Added to wishlist");
                                                    }
                                                }}
                                                className="w-14 border rounded-lg hover:bg-neutral-100 transition flex items-center justify-center"
                                            >
                                                {isWishlisted ? (
                                                    <i className="ri-heart-fill text-red-500"></i>
                                                ) : (
                                                    <i className="ri-heart-line"></i>
                                                )}
                                            </button> */}

                                        </div>

                                    </div>

                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="min-h-[50vh] flex flex-col justify-center items-center text-center px-6">
                        <div className="w-28 h-28 rounded-full bg-neutral-100 flex items-center justify-center">
                            <i className="ri-shopping-bag-line text-5xl text-neutral-500"></i>
                        </div>

                        <h1 className="text-3xl font-semibold mt-8">
                            No Pieces Available
                        </h1>

                        <p className="text-neutral-500 mt-3 max-w-md">
                            We are currently preparing our next collection. Please check back later.
                        </p>
                    </div>
                )}

            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-neutral-200 py-8 text-center">
                <p className="text-xs text-neutral-500 tracking-wide">
                    © {new Date().getFullYear()} Snitch. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Home;