import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import toast from 'react-hot-toast';

const CURRENCIES = [ 'INR', 'USD', 'EUR', 'GBP' ];
const MAX_IMAGES = 7;

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();

    const [ formData, setFormData ] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });
    const [ images, setImages ] = useState([]); // [{ file, preview }]
    const [ isDragging, setIsDragging ] = useState(false);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [ name ]: value }));
    };

    const addFiles = (files) => {
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) return;
        const toAdd = Array.from(files).slice(0, remaining);
        const newImages = toAdd.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages(prev => [ ...prev, ...newImages ]);
    };

    const handleFileChange = (e) => {
        addFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) {
            addFiles(e.dataTransfer.files);
        }
    }, [ images ]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const removeImage = (index) => {
        setImages(prev => {
            const updated = [ ...prev ];
            URL.revokeObjectURL(updated[ index ].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            images.forEach(img => data.append('images', img.file));
            await handleCreateProduct(data);

            toast.success("Product created successfully 🎉");

            navigate('/');
        } catch (err) {
             toast.error(
            err?.response?.data?.message ||
            err?.message ||
            "Failed to create product"
        );
        } finally {
            setIsSubmitting(false);
        }
    };

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
                .field-input {
                    transition: border-color 0.3s ease;
                }
                .preview-card {
                    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .preview-card:hover { transform: translateY(-3px); }
                .drop-zone {
                    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .submit-btn {
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
                    <div className="pt-6 sm:pt-8 pb-5 sm:pb-6 flex items-end gap-5 overflow-hidden fade-in">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-xl leading-none transition-colors duration-200 mb-1"
                            style={{ color: '#B5ADA3' }}
                            aria-label="Go back"
                            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                            onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
                        >
                            ←
                        </button>
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
                                New Listing
                            </h1>
                            <div className="mt-2 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="pt-8 pb-24 fade-in-up">

                        {/* ── Two-column grid on desktop ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-start">

                            {/* ── LEFT COLUMN — text fields ── */}
                            <div className="flex flex-col gap-10">

                                {/* Product Title */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="title"
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#C9A96E' }}
                                    >
                                        Product Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Oversized Linen Shirt"
                                        className="field-input bg-transparent text-base outline-none px-1 py-3"
                                        style={{ color: '#1b1c1a', borderBottom: '1px solid #d8d2c6' }}
                                        onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                                        onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="description"
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#C9A96E' }}
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Describe the product — material, fit, details..."
                                        className="field-input bg-transparent text-base outline-none px-1 py-3 resize-none leading-relaxed"
                                        style={{ color: '#1b1c1a', borderBottom: '1px solid #d8d2c6' }}
                                        onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                                        onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                                    />
                                </div>

                                {/* Price — Amount + Currency */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#C9A96E' }}
                                    >
                                        Price
                                    </label>
                                    <div className="flex gap-4 items-end">
                                        {/* Amount */}
                                        <div className="flex flex-col gap-1 flex-[2]">
                                            <span
                                                className="text-[9px] uppercase tracking-widest"
                                                style={{ color: '#B5ADA3' }}
                                            >
                                                Amount
                                            </span>
                                            <input
                                                id="priceAmount"
                                                type="number"
                                                name="priceAmount"
                                                value={formData.priceAmount}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="field-input bg-transparent text-base outline-none px-1 py-3 w-full"
                                                style={{ color: '#1b1c1a', borderBottom: '1px solid #d8d2c6' }}
                                                onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                                                onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                                            />
                                        </div>
                                        {/* Currency */}
                                        <div className="flex flex-col gap-1 flex-[1]">
                                            <span
                                                className="text-[9px] uppercase tracking-widest"
                                                style={{ color: '#B5ADA3' }}
                                            >
                                                Currency
                                            </span>
                                            <select
                                                id="priceCurrency"
                                                name="priceCurrency"
                                                value={formData.priceCurrency}
                                                onChange={handleChange}
                                                className="field-input bg-transparent text-base outline-none px-1 py-3 w-full cursor-pointer appearance-none"
                                                style={{ color: '#1b1c1a', borderBottom: '1px solid #d8d2c6' }}
                                                onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                                                onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                                            >
                                                {CURRENCIES.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>{/* end LEFT COLUMN */}

                            {/* ── RIGHT COLUMN — images ── */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <label
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#C9A96E' }}
                                    >
                                        Images
                                    </label>
                                    <span className="text-[10px]" style={{ color: '#B5ADA3' }}>
                                        {images.length}/{MAX_IMAGES}
                                    </span>
                                </div>

                                {/* Drop Zone */}
                                {images.length < MAX_IMAGES && (
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="drop-zone px-6 py-12 lg:py-16 flex flex-col items-center gap-3 cursor-pointer rounded-sm"
                                        style={{
                                            border: `1px dashed ${isDragging ? '#C9A96E' : '#d8d2c6'}`,
                                            backgroundColor: isDragging ? 'rgba(201,169,110,0.06)' : '#fbf9f6'
                                        }}
                                        onMouseEnter={e => { if (!isDragging) { e.currentTarget.style.borderColor = '#B5ADA3'; e.currentTarget.style.backgroundColor = '#f5f3f0'; } }}
                                        onMouseLeave={e => { if (!isDragging) { e.currentTarget.style.borderColor = '#d8d2c6'; e.currentTarget.style.backgroundColor = '#fbf9f6'; } }}
                                    >
                                        <span className="text-3xl" style={{ color: '#B5ADA3' }}>↑</span>
                                        <p className="text-sm text-center leading-relaxed" style={{ color: '#7A6E63' }}>
                                            Drop images here or{' '}
                                            <span style={{ color: '#C9A96E', textDecoration: 'underline', textUnderlineOffset: '2px' }}>tap to upload</span>
                                        </p>
                                        <p className="text-[10px] uppercase tracking-wider" style={{ color: '#B5ADA3' }}>
                                            Up to {MAX_IMAGES} images
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}

                                {/* Image Previews — matches Dashboard product-card rounded style */}
                                {images.length > 0 && (
                                    <div className="grid grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-1">
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="preview-card relative aspect-square overflow-hidden group rounded-sm fade-in-up"
                                                style={{ backgroundColor: '#f5f3f0' }}
                                            >
                                                <img
                                                    src={img.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Remove overlay */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-bold"
                                                    style={{ backgroundColor: 'rgba(27,28,26,0.55)', color: '#fbf9f6' }}
                                                    aria-label={`Remove image ${index + 1}`}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>{/* end RIGHT COLUMN */}

                        </div>{/* end two-column grid */}

                        {/* Submit — full-width below both columns, matches Dashboard button hover */}
                        <div className="mt-10 lg:mt-12">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="submit-btn w-full py-4 px-8 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6' }}
                                onMouseEnter={e => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.backgroundColor = '#C9A96E';
                                        e.currentTarget.style.color = '#1b1c1a';
                                    }
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '#1b1c1a';
                                    e.currentTarget.style.color = '#fbf9f6';
                                }}
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                            </button>
                        </div>
                    </form>

                </div>{/* end max-w-7xl container */}
            </div>
        </>
    );
};

export default CreateProduct;