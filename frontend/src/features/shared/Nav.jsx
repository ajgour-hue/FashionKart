import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ProfileMenu from './ProfileMenu'

const Nav = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart.items)

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <nav
            className="
                z-50 w-full h-[72px]
                px-6 md:px-10 lg:px-20
                flex items-center justify-between
                bg-[#fbf9f6]/95 backdrop-blur-lg
                border-b border-[#e8e5e1]
                shadow-sm
            "
        >
            {/* Logo */}
            <Link
                to="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
                <svg width="22" height="22" viewBox="0 0 100 60" fill="none">
                    <path d="M50 18 L20 44 L80 44 L50 18 Z" stroke="#C9A96E" strokeWidth="3" strokeLinejoin="round" />
                    <line x1="20" y1="44" x2="80" y2="44" stroke="#C9A96E" strokeWidth="3" />
                    <path d="M50 18 C50 12 46 8 40 8" fill="none" stroke="#C9A96E" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <span
                    className="text-lg font-medium tracking-[0.35em]"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                >
                    FashionKart
                </span>
            </Link>

            

            {/* Right side */}
            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        {/* Nav links — uppercase/tracked style stays only on these, not on the avatar */}
                        <div
                            className="hidden sm:flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-medium"
                            style={{ color: '#7A6E63' }}
                        >
                            {user?.role === 'seller' && (
                                <Link to="/seller/dashboard" className="transition-colors hover:text-[#C9A96E]">
                                    Seller Dashboard
                                </Link>
                            )}
                        </div>

                        {/* Cart */}
                        {user?.role === 'buyer' && (
                            <Link
                                to="/cart"
                                className="relative flex items-center hover:opacity-70 transition-opacity"
                                style={{ color: '#1b1c1a' }}
                                aria-label="Shopping cart"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>

                                {cartItems.length > 0 && (
                                    <span
                                        className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white"
                                        style={{
                                            backgroundColor: '#C9A96E',
                                            width: '16px',
                                            height: '16px',
                                            fontSize: '9px',
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 600,
                                            letterSpacing: 0,
                                        }}
                                    >
                                        {cartItems.length > 9 ? '9+' : cartItems.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Avatar + dropdown (name + logout live inside here, no duplicate button) */}
                        <ProfileMenu user={user} onLogout={handleLogout} />
                    </>
                ) : (
                    <div
                        className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-medium"
                        style={{ color: '#7A6E63' }}
                    >
                        <Link to="/login" className="transition-colors hover:text-[#C9A96E]">
                            Sign In
                        </Link>
                        <Link to="/register" className="transition-colors hover:text-[#C9A96E]">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Nav;