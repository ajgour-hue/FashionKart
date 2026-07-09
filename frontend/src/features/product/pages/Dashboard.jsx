import React, { useEffect } from 'react';
import { useProduct } from '../hook/useProduct.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { handleGetSellerProduct } = useProduct();
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const navigate = useNavigate();

    useEffect(() => {
        handleGetSellerProduct();
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12">

            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <p className="uppercase tracking-[3px] text-xs text-neutral-400">
                        Seller Dashboard
                    </p>
                    <h1 className="mt-1 text-4xl font-semibold">
                        Your Vault
                    </h1>
                </div>

                <button
                    onClick={() => navigate('/seller/create-product')}
                    className="bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-800 transition w-full md:w-auto"
                >
                    + New Listing
                </button>
            </div>

            {/* Stats strip */}
            {sellerProducts && sellerProducts.length > 0 && (
                <div className="flex items-center gap-8 sm:gap-14 mb-10">
                    <div className="flex flex-col gap-1">
                        <span className="text-2xl font-semibold">
                            {sellerProducts.length}
                        </span>
                        <span className="uppercase tracking-[2px] text-xs text-neutral-400">
                            Total Listings
                        </span>
                    </div>
                    <div className="w-px h-8 bg-neutral-200" />
                    <div className="flex flex-col gap-1">
                        <span className="text-2xl font-semibold">
                            Active
                        </span>
                        <span className="uppercase tracking-[2px] text-xs text-neutral-400">
                            Store Status
                        </span>
                    </div>
                </div>
            )}

            {/* ── Product Grid ── */}
            {sellerProducts && sellerProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                    {sellerProducts.map((product) => {
                        const imageUrl = product.images && product.images.length > 0
                            ? product.images[0].url
                            : '/snitch_editorial_warm.png'; // Fallback to our warm editorial

                        return (
                            <div
                                key={product._id}
                                className="group"
                            >
                                <div className="relative overflow-hidden rounded-xl bg-neutral-100">
                                    <img
                                        src={imageUrl}
                                        alt={product.title}
                                        loading="lazy"
                                        onClick={() => navigate(`/seller/product/${product._id}`)}
                                        className="w-full aspect-[4/5] object-cover cursor-pointer transition duration-500 group-hover:scale-105"
                                    />

                                    <span
                                        onClick={() => navigate(`/seller/product/${product._id}`)}
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[2px] font-medium px-4 py-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition cursor-pointer whitespace-nowrap"
                                    >
                                        Manage Listing
                                    </span>
                                </div>

                                <div className="mt-5">
                                    <h2 className="mt-2 text-lg font-medium line-clamp-1">
                                        {product.title}
                                    </h2>

                                    <p className="mt-2 text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>

                                    <p className="mt-3 text-xl font-semibold">
                                        {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="min-h-[60vh] flex flex-col justify-center items-center text-center px-6">
                    <div className="w-28 h-28 rounded-full bg-neutral-100 flex items-center justify-center">
                        <i className="ri-store-2-line text-5xl text-neutral-500"></i>
                    </div>

                    <h1 className="text-4xl font-semibold mt-8">
                        Your Vault is Empty
                    </h1>

                    <p className="text-neutral-500 mt-3 max-w-md">
                        You haven't added any curated pieces to your archive yet. Begin by creating a new listing.
                    </p>

                    <button
                        onClick={() => navigate('/seller/create-product')}
                        className="mt-8 bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-800 transition"
                    >
                        Create Listing
                    </button>
                </div>
            )}
        </section>
    );
};

export default Dashboard;