import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ProfileMenu from './ProfileMenu'

const Nav = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart.items)
    const wishlist = useSelector((state) => state.wishlist.items);
    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <nav
            className="
                sticky top-0 z-50 w-full h-[72px]
                px-6 md:px-10 lg:px-20
                flex items-center justify-between
                bg-white/80 backdrop-blur-xl
                border-b border-neutral-200/70
            "
        >
            {/* Logo */}
            <Link
                to="/"
                className="flex items-center gap-2.5 group"
            >
                <svg width="24" height="24" viewBox="0 0 100 60" fill="none" className="transition-transform duration-300 group-hover:-translate-y-0.5">
                    <path d="M50 18 L20 44 L80 44 L50 18 Z" stroke="#000000" strokeWidth="3" strokeLinejoin="round" />
                    <line x1="20" y1="44" x2="80" y2="44" stroke="#000000" strokeWidth="3" />
                    <path d="M50 18 C50 12 46 8 40 8" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <span className="text-lg font-semibold tracking-[0.2em] transition-opacity duration-300 group-hover:opacity-70">
                    FashionKart
                </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-5 sm:gap-7">
                {user ? (
                    <>
                        {/* Nav links */}
                        <div className="hidden sm:flex items-center gap-7 uppercase tracking-[2px] text-xs font-medium text-neutral-500">
                            {user?.role === 'seller' && (
                                <Link
                                    to="/seller/dashboard"
                                    className="relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-px after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    Seller Dashboard
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center gap-4 sm:gap-5">
                            {/* Cart */}
                            {user?.role === 'buyer' && (
                                <Link
                                    to="/cart"
                                    className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 transition-colors"
                                    aria-label="Shopping cart"
                                >
                                    <i className="ri-shopping-bag-line text-xl"></i>

                                    {cartItems.length > 0 && (
                                        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-black text-white text-[10px] font-medium flex items-center justify-center leading-none">
                                            {cartItems.length > 9 ? '9+' : cartItems.length}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {/* Wishlist */}
                            {user?.role === 'buyer' && (
                                   <Link
                                to="/wishlist"
                                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 transition-colors"
                                aria-label="Wishlist"
                            >
                                <i className="ri-heart-line text-xl"></i>

                                {wishlist.length > 0 && (
                                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center leading-none">
                                        {wishlist.length > 9 ? '9+' : wishlist.length}
                                    </span>
                                )}
                            </Link>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-6 bg-neutral-200" />

                        {/* Avatar + dropdown (name + logout live inside here, no duplicate button) */}
                        <ProfileMenu user={user} onLogout={handleLogout} />
                    </>
                ) : (
                    <div className="flex items-center gap-3 uppercase tracking-[2px] text-xs font-medium">
                        <Link
                            to="/login"
                            className="text-neutral-500 hover:text-black transition-colors px-4 py-2"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="bg-black text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Nav;