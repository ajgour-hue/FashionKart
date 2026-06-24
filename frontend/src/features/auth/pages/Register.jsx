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
        <div className="h-screen lg:h-screen overflow-y-auto lg:overflow-hidden bg-[#0e0e0e] text-[#e5e2e1] font-sans selection:bg-[#FFD700] selection:text-[#131313] flex flex-col lg:flex-row">

            {/* Split Screen - Left Image Section (hidden below lg) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#131313] items-center justify-center overflow-hidden border-r border-[#1c1b1b]">
                <img
                    src="/snitch_editorial.png"
                    alt="Snitch Fashion Editorial"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:scale-105 transition-transform duration-[20s] ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/50 via-transparent to-[#0e0e0e] opacity-90"></div>

                <div className="relative z-10 p-10 xl:p-16 flex flex-col h-full justify-between w-full max-w-2xl">
                    <h2 className="text-[#FFD700] text-lg xl:text-xl font-bold tracking-widest uppercase">Snitch.</h2>

                    <div className="mt-auto">
                        <p className="text-4xl xl:text-6xl font-bold tracking-tighter leading-[1.1] text-white mb-4 xl:mb-6">
                            Define your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e9c400] to-[#ffd700]">aesthetic.</span>
                        </p>
                        <p className="text-[#d0c6ab] max-w-md text-base xl:text-lg leading-relaxed">
                            Join the exclusive movement of creators and brands redefining the modern fashion landscape.
                        </p>
                    </div>
                </div>
            </div>

            {/* Split Screen - Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:p-8 xl:p-12 lg:h-screen lg:overflow-y-auto bg-[#0e0e0e]">
                <div className="w-full max-w-sm sm:max-w-md bg-[#131313] lg:bg-transparent p-6 sm:p-9 lg:p-0 rounded-2xl lg:rounded-none shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] lg:shadow-none my-auto">

                    {/* Mobile-only brand mark */}
                    <div className="lg:hidden mb-6 flex items-center justify-between">
                        <span className="text-[#FFD700] text-sm font-bold tracking-widest uppercase">Snitch.</span>
                        <a href="/login" className="text-xs text-[#999077] hover:text-[#FFD700] transition-colors">
                            Sign in
                        </a>
                    </div>

                    <div className="mb-6 lg:mb-7">
                        <h1 className="text-3xl sm:text-4xl lg:text-[2.4rem] font-bold tracking-tight text-white leading-tight mb-2">Let's join with us</h1>
                        <p className="text-sm text-[#999077]">Create an account to join the community.</p>
                    </div>

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl bg-[#2a1414] border border-[#5c2424] text-[#ff8a8a] text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Full Name */}
                        <div className="flex flex-col">
                            <label htmlFor="fullName" className="text-sm text-[#d0c6ab] mb-1.5 font-medium">
                                Name<span className="text-[#FFD700]">*</span>
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                                className="bg-[#1c1b1b] lg:bg-[#161616] text-white text-sm sm:text-base border border-[#3a3833] focus:border-[#FFD700] outline-none px-4 py-3 rounded-full transition-colors duration-200 placeholder:text-[#6b6557]"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Contact Number */}
                        <div className="flex flex-col">
                            <label htmlFor="contactNumber" className="text-sm text-[#d0c6ab] mb-1.5 font-medium">
                                Contact Number<span className="text-[#FFD700]">*</span>
                            </label>
                            <input
                                id="contactNumber"
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                required
                                autoComplete="tel"
                                className="bg-[#1c1b1b] lg:bg-[#161616] text-white text-sm sm:text-base border border-[#3a3833] focus:border-[#FFD700] outline-none px-4 py-3 rounded-full transition-colors duration-200 placeholder:text-[#6b6557]"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-sm text-[#d0c6ab] mb-1.5 font-medium">
                                Email<span className="text-[#FFD700]">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                className="bg-[#1c1b1b] lg:bg-[#161616] text-white text-sm sm:text-base border border-[#3a3833] focus:border-[#FFD700] outline-none px-4 py-3 rounded-full transition-colors duration-200 placeholder:text-[#6b6557]"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col">
                            <label htmlFor="password" className="text-sm text-[#d0c6ab] mb-1.5 font-medium">
                                Password<span className="text-[#FFD700]">*</span>
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
                                className="bg-[#1c1b1b] lg:bg-[#161616] text-white text-sm sm:text-base border border-[#3a3833] focus:border-[#FFD700] outline-none px-4 py-3 rounded-full transition-colors duration-200 placeholder:text-[#6b6557]"
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
                                    className="peer appearance-none w-4.5 h-4.5 sm:w-5 sm:h-5 border-2 border-[#4d4732] rounded bg-[#1c1b1b] lg:bg-[#161616] checked:bg-[#FFD700] checked:border-[#FFD700] cursor-pointer transition-colors duration-200 group-hover:border-[#FFD700]"
                                />
                                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-[#221b00]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className="text-xs sm:text-sm text-[#999077] group-hover:text-[#FFD700] transition-colors duration-200 select-none">Register as a Seller</span>
                        </label>



                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 w-full bg-gradient-to-r from-[#e9c400] to-[#ffd700] text-[#131313] font-bold tracking-wide py-3 sm:py-3.5 px-8 rounded-full hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <svg className="animate-spin h-4 w-4 text-[#131313]" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                            )}
                            {loading ? 'Signing Up…' : 'Sign Up'}
                        </button>

                        <ContinueWithGoogle />

                        <div className="lg:block text-center mt-1">
                            <span className="text-sm text-[#999077]">Already have an account? </span>
                            <a href="/login" className="text-sm font-semibold text-[#FFD700] hover:underline">
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