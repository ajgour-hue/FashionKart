import React, { useState } from 'react';
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ContinueWithGoogle from '../component/ContinueWithGoogle';

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await handleLogin({
        email: formData.email,
        password: formData.password
      });

      navigate('/');
    } catch (err) {
      setError(err?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen lg:h-screen overflow-y-auto lg:overflow-hidden bg-[#0e0e0e] text-[#e5e2e1] font-sans selection:bg-[#FFD700] selection:text-[#131313] flex flex-col lg:flex-row">

      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#131313] items-center justify-center overflow-hidden border-r border-[#1c1b1b]">
        <img
          src="/snitch_editorial.png"
          alt="Snitch Fashion Editorial"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:scale-105 transition-transform duration-[20s] ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/50 via-transparent to-[#0e0e0e] opacity-90"></div>

        <div className="relative z-10 p-10 xl:p-16 flex flex-col h-full justify-between w-full max-w-2xl">
          <h2 className="text-[#FFD700] text-lg xl:text-xl font-bold tracking-widest uppercase">
            Snitch.
          </h2>

          <div className="mt-auto">
            <p className="text-4xl xl:text-6xl font-bold tracking-tighter leading-[1.1] text-white mb-4 xl:mb-6">
              Welcome <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e9c400] to-[#ffd700]">
                back.
              </span>
            </p>

            <p className="text-[#d0c6ab] max-w-md text-base xl:text-lg leading-relaxed">
              Sign in to access your account and explore the latest
              collections tailored to your style.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:p-8 xl:p-12 lg:h-screen lg:overflow-y-auto bg-[#0e0e0e]">

        <div className="w-full max-w-sm sm:max-w-md bg-[#131313] lg:bg-transparent p-6 sm:p-9 lg:p-0 rounded-2xl lg:rounded-none shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] lg:shadow-none my-auto">

          {/* Mobile Top Bar */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <span className="text-[#FFD700] text-sm font-bold tracking-widest uppercase">
              Snitch.
            </span>

            <a
              href="/register"
              className="text-xs text-[#999077] hover:text-[#FFD700] transition-colors"
            >
              Sign Up
            </a>
          </div>

          {/* Heading */}
          <div className="mb-6 lg:mb-7">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.4rem] font-bold tracking-tight text-white leading-tight mb-2">
              Welcome Back
            </h1>

            <p className="text-sm text-[#999077]">
              Sign in to continue your journey.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-[#2a1414] border border-[#5c2424] text-[#ff8a8a] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm text-[#d0c6ab] mb-1.5 font-medium"
              >
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
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-sm text-[#d0c6ab] font-medium"
                >
                  Password
                  <span className="text-[#FFD700]">*</span>
                </label>

                <a
                  href="#"
                  className="text-xs text-[#999077] hover:text-[#FFD700] transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="bg-[#1c1b1b] lg:bg-[#161616] text-white text-sm sm:text-base border border-[#3a3833] focus:border-[#FFD700] outline-none px-4 py-3 rounded-full transition-colors duration-200 placeholder:text-[#6b6557]"
                placeholder="Enter your password"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full bg-gradient-to-r from-[#e9c400] to-[#ffd700] text-[#131313] font-bold tracking-wide py-3 sm:py-3.5 px-8 rounded-full hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4 text-[#131313]"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}

              {loading ? "Signing In..." : "Sign In"}
            </button>

            <ContinueWithGoogle />

            {/* Footer */}
            <div className="text-center mt-1">
              <span className="text-sm text-[#999077]">
                Don't have an account?
              </span>{" "}
              <a
                href="/register"
                className="text-sm font-semibold text-[#FFD700] hover:underline"
              >
                Sign Up
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;