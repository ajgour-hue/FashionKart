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
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
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
                .fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
                .fade-in { animation: fadeIn 1s ease both; }
                .product-card { transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
                .product-card:hover { transform: translateY(-6px); }
                .product-img-wrap::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(27,28,26,0.15), transparent 40%);
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
                .product-card:hover .product-img-wrap::after { opacity: 1; }
                .view-btn {
                    opacity: 0;
                    transform: translateY(8px);
                    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .product-card:hover .view-btn { opacity: 1; transform: translateY(0); }
                .new-listing-btn {
                    position: relative;
                    overflow: hidden;
                }
            `}</style>

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">

                    {/* ── Page Header ── */}
                    <div className="pt-6 sm:pt-8 pb-5 sm:pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden fade-in">
                        <div>
                            <span
                                className="text-[10px] uppercase tracking-[0.3em] font-medium mb-2 block"
                                style={{ color: '#C9A96E' }}
                            >
                                Seller Dashboard
                            </span>
                            <h1
                                className="text-3xl lg:text-4xl font-light leading-tight"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                Your Vault
                            </h1>
                            {/* Gold rule separator */}
                            <div className="mt-2 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
                        </div>

                        <button
                            onClick={() => navigate('/seller/create-product')}
                            className="new-listing-btn py-3 px-6 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 w-full md:w-auto text-center"
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
                            + New Listing
                        </button>
                    </div>

                    {/* Stats strip */}
                    {sellerProducts && sellerProducts.length > 0 && (
                        <div className="flex items-center gap-8 sm:gap-14 pb-8 sm:pb-10 fade-in">
                            <div className="flex flex-col gap-1">
                                <span
                                    className="text-xl sm:text-2xl font-light"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                                >
                                    {sellerProducts.length}
                                </span>
                                <span
                                    className="text-[9px] uppercase tracking-[0.2em]"
                                    style={{ color: '#7A6E63' }}
                                >
                                    Total Listings
                                </span>
                            </div>
                            <div className="w-px h-8" style={{ backgroundColor: '#e4e2df' }} />
                            <div className="flex flex-col gap-1">
                                <span
                                    className="text-xl sm:text-2xl font-light"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                                >
                                    Active
                                </span>
                                <span
                                    className="text-[9px] uppercase tracking-[0.2em]"
                                    style={{ color: '#7A6E63' }}
                                >
                                    Store Status
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ── Product Grid ── */}
                    {sellerProducts && sellerProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 sm:gap-x-8 gap-y-10 sm:gap-y-16 pb-24">
                            {sellerProducts.map((product, idx) => {
                                const imageUrl = product.images && product.images.length > 0
                                    ? product.images[0].url
                                    : '/snitch_editorial_warm.png'; // Fallback to our warm editorial

                                return (
                                    <div
                                        onClick={() => { navigate(`/seller/product/${product._id}`) }}
                                        key={product._id}
                                        className="product-card group cursor-pointer flex flex-col fade-in-up"
                                        style={{ animationDelay: `${Math.min(idx * 60, 400)}ms` }}
                                    >
                                        {/* Image Container */}
                                        <div
                                            className="product-img-wrap relative aspect-[3/4] max-w-[220px] sm:max-w-[240px] mx-auto overflow-hidden mb-4 sm:mb-6 rounded-sm"
                                            style={{ backgroundColor: '#f5f3f0' }}
                                        >
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            />
                                            <span
                                                className="view-btn absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.2em] font-medium px-4 py-2 bg-white/95 backdrop-blur-sm whitespace-nowrap"
                                                style={{ color: '#1b1c1a' }}
                                            >
                                                Manage Listing
                                            </span>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex flex-col gap-2 px-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <h3
                                                    className="text-xl leading-snug transition-colors duration-300 group-hover:text-[#C9A96E]"
                                                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                                                >
                                                    {product.title}
                                                </h3>
                                            </div>

                                            <p
                                                className="text-[12px] line-clamp-2 leading-relaxed"
                                                style={{ color: '#7A6E63' }}
                                            >
                                                {product.description}
                                            </p>

                                            <div className="mt-2">
                                                <span
                                                    className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                                    style={{ color: '#1b1c1a' }}
                                                >
                                                    {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-20 sm:py-24 text-center flex flex-col items-center fade-in">
                            <span
                                className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4"
                                style={{ color: '#C9A96E' }}
                            >
                                Empty Vault
                            </span>
                            <p
                                className="max-w-md mx-auto text-lg leading-relaxed mb-8"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7A6E63' }}
                            >
                                You haven't added any curated pieces to your archive yet. Begin by creating a new listing.
                            </p>
                            <button
                                onClick={() => navigate('/seller/create-product')}
                                className="py-4 px-8 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300"
                                style={{
                                    backgroundColor: '#1b1c1a',
                                    color: '#fbf9f6',
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
                                Create Listing
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;