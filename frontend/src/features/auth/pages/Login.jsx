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
      const user = await handleLogin({
        email: formData.email,
        password: formData.password
      });

      if (user.role == "buyer") {
        navigate("/");
      } else if (user.role == "seller") {
        navigate("/seller/dashboard");
      }
    } catch (err) {
      setError(err?.message || 'Invalid credentials');
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

        {/* Left Section */}
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
                Welcome <br />
                <span style={{ color: '#C9A96E' }}>back.</span>
              </p>

              <p
                className="max-w-md text-base xl:text-lg leading-relaxed"
                style={{ color: '#7A6E63' }}
              >
                Sign in to access your account and explore the latest
                collections tailored to your style.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div
          className="w-full lg:w-1/2 flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:p-8 xl:p-12 lg:h-screen lg:overflow-y-auto"
          style={{ backgroundColor: '#fbf9f6' }}
        >

          <div className="w-full max-w-sm sm:max-w-md my-auto">

            {/* Mobile Top Bar */}
            <div className="lg:hidden mb-8 flex items-center justify-between">
              <span
                className="text-xs font-medium tracking-[0.32em] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
              >
                Snitch.
              </span>

              <a
                href="/register"
                className="text-xs uppercase tracking-[0.2em] transition-colors"
                style={{ color: '#B5ADA3' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
              >
                Sign Up
              </a>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1
                className="text-4xl sm:text-5xl lg:text-[2.6rem] font-light leading-tight mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
              >
                Welcome Back
              </h1>
              <div className="w-14 h-px mb-4" style={{ backgroundColor: '#C9A96E' }} />
              <p className="text-sm" style={{ color: '#7A6E63' }}>
                Sign in to continue your journey.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="mb-6 px-4 py-3 text-sm"
                style={{ backgroundColor: '#fbf3f1', border: '1px solid #e3c9c2', color: '#a8463a' }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

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
                  style={{
                    color: '#1b1c1a',
                    borderBottom: '1px solid #d8d2c6',
                  }}
                  onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                  onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="text-[11px] uppercase tracking-[0.2em] font-medium"
                    style={{ color: '#1b1c1a' }}
                  >
                    Password<span style={{ color: '#C9A96E' }}>*</span>
                  </label>

                  <a
                    href="#"
                    className="text-xs transition-colors"
                    style={{ color: '#B5ADA3' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                    onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
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
                  className="text-sm sm:text-base outline-none px-1 py-3 transition-colors duration-200 bg-transparent"
                  style={{
                    color: '#1b1c1a',
                    borderBottom: '1px solid #d8d2c6',
                  }}
                  onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                  onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                  placeholder="Enter your password"
                />
              </div>

              {/* Button */}
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
                  <svg
                    className="animate-spin h-4 w-4"
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
              <div className="text-center mt-2">
                <span className="text-sm" style={{ color: '#7A6E63' }}>
                  Don't have an account?
                </span>{" "}
                <a
                  href="/register"
                  className="text-sm font-medium transition-colors"
                  style={{ color: '#C9A96E' }}
                >
                  Sign Up
                </a>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;