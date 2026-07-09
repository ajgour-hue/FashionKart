import React, {
    useState,
    useRef,
    useCallback,
    useEffect
} from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from '../hook/useProduct';
import toast from 'react-hot-toast';

const CURRENCIES = [ 'INR', 'USD', 'EUR', 'GBP' ];
const MAX_IMAGES = 7;

const CreateProduct = () => {
    const {
    handleCreateProduct,
    handleGetProductById,
    handleUpdateProduct
} = useProduct();

const { productId } = useParams();

const isEdit = !!productId;

useEffect(() => {

    if (!isEdit) return;

    async function loadProduct() {

        const product = await handleGetProductById(productId);

        setFormData({
            title: product.title,
            description: product.description,
            priceAmount: product.price.amount,
            priceCurrency: product.price.currency
        });

    }

    loadProduct();

}, [productId]);

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
            
            if (isEdit) {

    await handleUpdateProduct(productId, data);

    toast.success("Product updated successfully 🎉");

} else {

    await handleCreateProduct(data);

    toast.success("Product created successfully 🎉");

}

navigate("/");

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
        <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12">

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                        className="w-11 h-11 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition"
                    >
                        <i className="ri-arrow-left-line text-lg"></i>
                    </button>
                    <div>
                        <p className="uppercase tracking-[3px] text-xs text-neutral-400">
                            Seller Dashboard
                        </p>
                        <h1 className="mt-1 text-4xl font-semibold">
                            {isEdit ? "Edit Product" : "New Listing"}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-start">

                    {/* ── LEFT COLUMN — text fields ── */}
                    <div className="flex flex-col gap-8">

                        {/* Product Title */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="title"
                                className="uppercase tracking-[3px] text-xs text-neutral-400"
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
                                className="bg-neutral-100 rounded-lg px-4 py-3 outline-none border border-transparent focus:border-black transition"
                            />
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="description"
                                className="uppercase tracking-[3px] text-xs text-neutral-400"
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
                                className="bg-neutral-100 rounded-lg px-4 py-3 outline-none border border-transparent focus:border-black transition resize-none leading-relaxed"
                            />
                        </div>

                        {/* Price — Amount + Currency */}
                        <div className="flex flex-col gap-2">
                            <label className="uppercase tracking-[3px] text-xs text-neutral-400">
                                Price
                            </label>
                            <div className="flex gap-4">
                                {/* Amount */}
                                <div className="flex flex-col gap-1 flex-[2]">
                                    <span className="text-xs text-neutral-400">Amount</span>
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
                                        className="bg-neutral-100 rounded-lg px-4 py-3 outline-none border border-transparent focus:border-black transition w-full"
                                    />
                                </div>
                                {/* Currency */}
                                <div className="flex flex-col gap-1 flex-[1]">
                                    <span className="text-xs text-neutral-400">Currency</span>
                                    <select
                                        id="priceCurrency"
                                        name="priceCurrency"
                                        value={formData.priceCurrency}
                                        onChange={handleChange}
                                        className="bg-neutral-100 rounded-lg px-4 py-3 outline-none border border-transparent focus:border-black transition w-full cursor-pointer"
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
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <label className="uppercase tracking-[3px] text-xs text-neutral-400">
                                Images
                            </label>
                            <span className="text-xs text-neutral-400">
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
                                className={`rounded-xl border-2 border-dashed px-6 py-12 lg:py-16 flex flex-col items-center gap-3 cursor-pointer transition ${
                                    isDragging
                                        ? "border-black bg-neutral-100"
                                        : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100"
                                }`}
                            >
                                <i className="ri-upload-cloud-2-line text-4xl text-neutral-400"></i>
                                <p className="text-sm text-center text-neutral-500 leading-relaxed">
                                    Drop images here or{' '}
                                    <span className="text-black underline underline-offset-2">
                                        tap to upload
                                    </span>
                                </p>
                                <p className="uppercase tracking-wider text-xs text-neutral-400">
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

                        {/* Image Previews — matches Wishlist product-card rounded style */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100"
                                    >
                                        <img
                                            src={img.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            aria-label={`Remove image ${index + 1}`}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <i className="ri-close-line text-red-500"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>{/* end RIGHT COLUMN */}

                </div>{/* end two-column grid */}

                {/* Submit — full-width below both columns, matches Wishlist button style */}
                <div className="mt-12">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white py-4 rounded-full hover:bg-neutral-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting
                            ? (isEdit ? "Updating..." : "Publishing...")
                            : (isEdit ? "Update Product" : "Publish Listing")}
                    </button>
                </div>
            </form>

        </section>
    );
};

export default CreateProduct;