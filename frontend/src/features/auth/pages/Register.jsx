import React, { useState } from 'react';
import { useAuth } from "../hook/useAuth"
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import ContinueWithGoogle from '../component/ContinueWithGoogle';

const Register = () => {

    const { handleRegister } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        email: '',
        password: '',
        isSeller: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await handleRegister({
                email: formData.email,
                contact: formData.contactNumber,
                password: formData.password,
                isSeller: formData.isSeller,
                fullname: formData.fullName
            });
            navigate("/");
        } catch (err) {
            setError(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="h-screen lg:h-screen overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >

                {/* Split Screen - Left Image Section (hidden below lg) */}
                <div
                    className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
                    style={{ backgroundColor: '#f5f3f0', borderRight: '1px solid #e7e2d9' }}
                >
                    <img
                        src="/snitch_editorial_warm.png"
                        alt="Snitch Fashion Editorial"
                        className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity hover:scale-105 transition-transform duration-[20s] ease-out"
                    />

                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, #fbf9f6 0%, transparent 55%)' }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to right, #fbf9f6 0%, transparent 35%, transparent 65%, #fbf9f6 100%)', opacity: 0.6 }}
                    />

                    <div className="relative z-10 p-10 xl:p-16 flex flex-col h-full justify-between w-full max-w-2xl">
                        <span
                            className="text-xs font-medium tracking-[0.32em] uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                        >
                            Snitch.
                        </span>

                        <div className="mt-auto">
                            <p
                                className="text-4xl xl:text-6xl font-light leading-[1.1] mb-4 xl:mb-6"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                Define your <br />
                                <span style={{ color: '#C9A96E' }}>aesthetic.</span>
                            </p>
                            <p
                                className="max-w-md text-base xl:text-lg leading-relaxed"
                                style={{ color: '#7A6E63' }}
                            >
                                Join the exclusive movement of creators and brands redefining the modern fashion landscape.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Split Screen - Right Form Section */}
                <div
                    className="w-full lg:w-1/2 flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:p-8 xl:p-12 lg:h-screen lg:overflow-y-auto"
                    style={{ backgroundColor: '#fbf9f6' }}
                >
                    <div className="w-full max-w-sm sm:max-w-md my-auto">

                        {/* Mobile-only brand mark */}
                        <div className="lg:hidden mb-8 flex items-center justify-between">
                            <span
                                className="text-xs font-medium tracking-[0.32em] uppercase"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                            >
                                Snitch.
                            </span>
                            <a
                                href="/login"
                                className="text-xs uppercase tracking-[0.2em] transition-colors"
                                style={{ color: '#B5ADA3' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                                onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
                            >
                                Sign in
                            </a>
                        </div>

                        <div className="mb-8">
                            <h1
                                className="text-4xl sm:text-5xl lg:text-[2.6rem] font-light leading-tight mb-3"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                Let's join with us
                            </h1>
                            <div className="w-14 h-px mb-4" style={{ backgroundColor: '#C9A96E' }} />
                            <p className="text-sm" style={{ color: '#7A6E63' }}>
                                Create an account to join the community.
                            </p>
                        </div>

                        {error && (
                            <div
                                className="mb-6 px-4 py-3 text-sm"
                                style={{ backgroundColor: '#fbf3f1', border: '1px solid #e3c9c2', color: '#a8463a' }}
                            >
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {/* Full Name */}
                            <div className="flex flex-col">
                                <label
                                    htmlFor="fullName"
                                    className="text-[11px] uppercase tracking-[0.2em] font-medium mb-2"
                                    style={{ color: '#1b1c1a' }}
                                >
                                    Name<span style={{ color: '#C9A96E' }}>*</span>
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                    className="text-sm sm:text-base outline-none px-1 py-3 transition-colors duration-200 bg-transparent"
                                    style={{ color: '#1b1c1a', borderBottom: '1px solid #d8d2c6' }}
                                    onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                                    onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                                    placeholder="Enter your name"
                                />
                            </div>

                            {/* Contact Number */}
                            <div className="flex flex-col">
                                <label
                                    htmlFor="contactNumber"
                                    className="text-[11px] uppercase tracking-[0.2em] font-medium mb-2"
                                    style={{ color: '#1b1c1a' }}
                                >
                                    Contact Number<span style={{ color: '#C9A96E' }}>*</span>
                                </label>
                                <input
                                    id="contactNumber"
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                    autoComplete="tel"
                                    className="text-sm sm:text-base outline-none px-1 py-3 transition-colors duration-200 bg-transparent"
                                    style={{ color: '#1b1c1a', borderBottom: '1px solid #d8d2c6' }}
                                    onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                                    onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col">
                                <label
                                    htmlFor="email"
                                    className="text-[11px] uppercase tracking-[0.2em] font-medium mb-2"
                                    style={{ color: '#1b1c1a' }}
                                >
                                    Email<span style={{ color: '#C9A96E' }}>*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    className="text-sm sm:text-base outline-none px-1 py-3 transition-colors duration-200 bg-transparent"
                                    style={{ color: '#1b1c1a', borderBottom: '1px solid #d8d2c6' }}
                                    onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                                    onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col">
                                <label
                                    htmlFor="password"
                                    className="text-[11px] uppercase tracking-[0.2em] font-medium mb-2"
                                    style={{ color: '#1b1c1a' }}
                                >
                                    Password<span style={{ color: '#C9A96E' }}>*</span>
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    minLength={8}
                                    className="text-sm sm:text-base outline-none px-1 py-3 transition-colors duration-200 bg-transparent"
                                    style={{ color: '#1b1c1a', borderBottom: '1px solid #d8d2c6' }}
                                    onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                                    onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                                    placeholder="Enter your password"
                                />
                            </div>

                            {/* Is Seller Checkbox */}
                            <label htmlFor="isSeller" className="flex items-center gap-3 cursor-pointer group w-max">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isSeller"
                                        id="isSeller"
                                        checked={formData.isSeller}
                                        onChange={handleChange}
                                        className="peer appearance-none w-4.5 h-4.5 sm:w-5 sm:h-5 cursor-pointer transition-colors duration-200"
                                        style={{
                                            border: '1.5px solid #d8d2c6',
                                            backgroundColor: '#fbf9f6',
                                            accentColor: '#C9A96E'
                                        }}
                                        onMouseEnter={e => { if (!e.currentTarget.checked) e.currentTarget.style.borderColor = '#C9A96E'; }}
                                        onMouseLeave={e => { if (!e.currentTarget.checked) e.currentTarget.style.borderColor = '#d8d2c6'; }}
                                    />
                                    <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100" style={{ color: '#1b1c1a' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span
                                    className="text-xs sm:text-sm transition-colors duration-200 select-none"
                                    style={{ color: '#7A6E63' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#7A6E63'}
                                >
                                    Register as a Seller
                                </span>
                            </label>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full py-4 px-8 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6' }}
                                onMouseEnter={e => {
                                    if (!loading) {
                                        e.currentTarget.style.backgroundColor = '#C9A96E';
                                        e.currentTarget.style.color = '#1b1c1a';
                                    }
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '#1b1c1a';
                                    e.currentTarget.style.color = '#fbf9f6';
                                }}
                            >
                                {loading && (
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                )}
                                {loading ? 'Signing Up…' : 'Sign Up'}
                            </button>

                            <ContinueWithGoogle />

                            <div className="lg:block text-center mt-2">
                                <span className="text-sm" style={{ color: '#7A6E63' }}>Already have an account? </span>
                                <a
                                    href="/login"
                                    className="text-sm font-medium transition-colors"
                                    style={{ color: '#C9A96E' }}
                                >
                                    Sign In
                                </a>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;