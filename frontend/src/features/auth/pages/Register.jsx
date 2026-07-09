import React, { useState } from 'react';
import { useAuth } from "../hook/useAuth"
import { useNavigate } from 'react-router-dom';
import ContinueWithGoogle from '../component/ContinueWithGoogle';
import toast from "react-hot-toast";

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
            toast.success("Account created successfully 🎉");
            navigate("/");
        } catch (err) {
            setError(err?.message || 'Something went wrong. Please try again.');
            toast.error(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen lg:h-screen overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row bg-white">

            {/* Split Screen - Left Image Section (hidden below lg) */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-neutral-100 border-r border-neutral-200">
                <img
                    src="/snitch_editorial_warm.png"
                    alt="Snitch Fashion Editorial"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-[20s] ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-60" />

                <div className="relative z-10 p-10 xl:p-16 flex flex-col h-full justify-between w-full max-w-2xl">
                    <span className="text-xs font-medium tracking-[0.32em] uppercase text-neutral-900">
                        Snitch.
                    </span>

                    <div className="mt-auto">
                        <p className="text-4xl xl:text-6xl font-semibold leading-[1.1] mb-4 xl:mb-6 text-neutral-900">
                            Define your <br />
                            <span className="text-neutral-500">aesthetic.</span>
                        </p>
                        <p className="max-w-md text-base xl:text-lg leading-relaxed text-neutral-500">
                            Join the exclusive movement of creators and brands redefining the modern fashion landscape.
                        </p>
                    </div>
                </div>
            </div>

            {/* Split Screen - Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:p-8 xl:p-12 lg:h-screen lg:overflow-y-auto bg-white">
                <div className="w-full max-w-sm sm:max-w-md my-auto">

                    {/* Mobile-only brand mark */}
                    <div className="lg:hidden mb-8 flex items-center justify-between">
                        <span className="text-xs font-medium tracking-[0.32em] uppercase text-neutral-900">
                            Snitch.
                        </span>
                        <a
                            href="/login"
                            className="text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors"
                        >
                            Sign in
                        </a>
                    </div>

                    <div className="mb-8">
                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
                            <i className="ri-user-add-line text-2xl text-neutral-500"></i>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-[2.6rem] font-semibold leading-tight mb-3 text-neutral-900">
                            Let's join with us
                        </h1>
                        <p className="text-sm text-neutral-500">
                            Create an account to join the community.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Full Name */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="fullName"
                                className="text-xs uppercase tracking-[3px] text-neutral-400"
                            >
                                Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-lg bg-neutral-100 outline-none focus:ring-2 focus:ring-black transition"
                            />
                        </div>

                        {/* Contact Number */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="contactNumber"
                                className="text-xs uppercase tracking-[3px] text-neutral-400"
                            >
                                Contact Number
                            </label>
                            <input
                                id="contactNumber"
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                required
                                autoComplete="tel"
                                placeholder="Enter your phone number"
                                className="w-full px-4 py-3 rounded-lg bg-neutral-100 outline-none focus:ring-2 focus:ring-black transition"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="email"
                                className="text-xs uppercase tracking-[3px] text-neutral-400"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg bg-neutral-100 outline-none focus:ring-2 focus:ring-black transition"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="password"
                                className="text-xs uppercase tracking-[3px] text-neutral-400"
                            >
                                Password
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
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-lg bg-neutral-100 outline-none focus:ring-2 focus:ring-black transition"
                            />
                        </div>

                        {/* Is Seller Checkbox */}
                        <label htmlFor="isSeller" className="flex items-center gap-3 cursor-pointer w-max">
                            <input
                                type="checkbox"
                                name="isSeller"
                                id="isSeller"
                                checked={formData.isSeller}
                                onChange={handleChange}
                                className="w-5 h-5 rounded accent-black cursor-pointer"
                            />
                            <span className="text-sm text-neutral-600">
                                Register as a Seller
                            </span>
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full bg-black text-white py-3 rounded-full hover:bg-neutral-800 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

                        <div className="text-center mt-2">
                            <span className="text-sm text-neutral-500">Already have an account? </span>
                            <a
                                href="/login"
                                className="text-sm font-medium text-black hover:underline"
                            >
                                Sign In
                            </a>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;