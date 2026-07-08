import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
    const products = useSelector(state => state.product.products);
    const user = useSelector(state => state.auth.user);
    const { handleGetAllProducts } = useProduct();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    useEffect(() => {
    const timer = setTimeout(() => {
        handleGetAllProducts(search);
    }, 400);

    return () => clearTimeout(timer);
}, [search]);


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
                .hero-underline {
                    width: 40px;
                    height: 1px;
                    background: #C9A96E;
                    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .hero-underline:hover { width: 80px; }

                
            `}</style>

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">
                    {/* ── Hero / Header ── */}
                 <div className="relative pt-14 sm:pt-16 pb-10 sm:pb-14 text-center flex flex-col items-center fade-in overflow-hidden">

    {/* Decorative background glow */}
    <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
            background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
        }}
    />

    {/* Eyebrow badge */}
    <div
        className="relative inline-flex items-center gap-2 mb-5 px-4 py-1.5 border rounded-full"
        style={{
            borderColor: "#e4e2df",
            backgroundColor: "rgba(255,255,255,0.6)",
        }}
    >
        <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#C9A96E" }}
        />
        <span
            className="text-[10px] uppercase tracking-[0.3em] font-medium"
            style={{ color: "#C9A96E" }}
        >
            The Collection
        </span>
    </div>

    {/* Heading */}
    <h1
        className="relative font-light leading-none mb-3"
        style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#1b1c1a",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
        }}
    >
        Curated{" "}
        <span
            className="italic"
            style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#C9A96E",
            }}
        >
            Archive
        </span>
    </h1>

    <div className="hero-underline mb-5" />

    {/* Description */}
    <p
        className="relative max-w-lg mx-auto text-[13px] sm:text-sm leading-relaxed px-4 mb-8"
        style={{ color: "#7A6E63" }}
    >
        Discover our latest curation of premium minimalist pieces,
        meticulously designed for effortless elegance and enduring quality.
    </p>

    <div className="max-w-md w-full mx-auto mb-10">
    <input
        type="text"
        placeholder="Search for products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-5 py-3 rounded-full border text-sm outline-none transition-all"
        style={{
            borderColor: "#d0c5b5",
            backgroundColor: "#fff",
            color: "#1b1c1a"
        }}
    />
</div>

    {/* Stats */}
    <div className="relative flex items-center gap-8 sm:gap-12">

        <div className="flex flex-col items-center">
            <span
                className="text-xl sm:text-2xl font-light"
                style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "#1b1c1a",
                }}
            >
                250+
            </span>
            <span
                className="text-[9px] uppercase tracking-[0.2em]"
                style={{ color: "#7A6E63" }}
            >
                Pieces
            </span>
        </div>

        <div
            className="w-px h-8"
            style={{ backgroundColor: "#e4e2df" }}
        />

        <div className="flex flex-col items-center">
            <span
                className="text-xl sm:text-2xl font-light"
                style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "#1b1c1a",
                }}
            >
                4.8
            </span>
            <span
                className="text-[9px] uppercase tracking-[0.2em]"
                style={{ color: "#7A6E63" }}
            >
                Avg Rating
            </span>
        </div>

        <div
            className="w-px h-8"
            style={{ backgroundColor: "#e4e2df" }}
        />

        <div className="flex flex-col items-center">
            <span
                className="text-xl sm:text-2xl font-light"
                style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "#1b1c1a",
                }}
            >
                10k+
            </span>
            <span
                className="text-[9px] uppercase tracking-[0.2em]"
                style={{ color: "#7A6E63" }}
            >
                Happy Clients
            </span>
        </div>

    </div>
</div>

                    {/* ── Product Grid ── */}
                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 sm:gap-x-8 gap-y-10 sm:gap-y-16 pb-24 sm:pb-32">
                            {products.map((product, idx) => {
                                const imageUrl = product.images && product.images.length > 0
                                    ? product.images[0].url
                                    : '/snitch_editorial_warm.png'; // Fallback

                                const currentPrice = product.price?.amount;
                                const currency = product.price?.currency;
                                const originalPrice = product.price?.originalAmount || product.originalPrice;
                                const discountPercent = product.price?.discountPercent || product.discount;

                                return (
                                    <div
                                        key={product._id}
                                        onClick={() => { navigate(`/product/${product._id}`) }}
                                        className="product-card group cursor-pointer flex flex-col fade-in-up"
                                        style={{ animationDelay: `${Math.min(idx * 60, 400)}ms` }}
                                    >
                                        {/* Image Container */}
                                        <div
                                            className="product-img-wrap relative aspect-[4/5] overflow-hidden mb-4 sm:mb-5 rounded-sm"
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
                                                View Piece
                                            </span>
                                        </div>

                                        {/* Product Details — Snitch style */}
                                        <div className="flex flex-col gap-1 px-1">
                                            <h3
                                                className="text-[15px] sm:text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-[#C9A96E]"
                                                style={{ color: '#1b1c1a' }}
                                            >
                                                {product.title || 'Snitch'}
                                            </h3>
                                            

                                            <p
                                                className="text-[12px] sm:text-[13px] leading-relaxed"
                                                style={{ color: '#7A6E63' }}
                                            >
                                                {product.description || 'A premium minimalist piece from Snitch.'}
                                            </p>

                                            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1.5">
                                                <span
                                                    className="text-[13px] sm:text-sm font-bold"
                                                    style={{ color: '#1b1c1a' }}
                                                >
                                                     ₹ {currentPrice?.toLocaleString()}
                                                </span>

                                                {originalPrice && (
                                                    <span
                                                        className="text-[12px] sm:text-[13px] line-through"
                                                        style={{ color: '#a8a29c' }}
                                                    >
                                                        Rs. {originalPrice?.toLocaleString()}
                                                    </span>
                                                )}

                                                {discountPercent && (
                                                    <span
                                                        className="text-[12px] sm:text-[13px] font-semibold"
                                                        style={{ color: '#E07A3F' }}
                                                    >
                                                        ({discountPercent}% OFF)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-20 sm:py-24 text-center flex flex-col items-center fade-in">
                            <h2
                                className="text-2xl mb-4"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                No pieces available.
                            </h2>
                            <p className="max-w-md mx-auto text-sm leading-relaxed px-4" style={{ color: '#7A6E63' }}>
                                We are currently preparing our next collection. Please check back later.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <footer
                    className="border-t py-8 text-center"
                    style={{ borderColor: "#e4e2df" }}
                >
                    <p
                        className="text-[11px] tracking-wide"
                        style={{ color: "#7A6E63" }}
                    >
                        © {new Date().getFullYear()} <span style={{ color: "#C9A96E" }}>Snitch.</span> All rights reserved.
                    </p>
                </footer>
            </div>
        </>
    );
};

export default Home;