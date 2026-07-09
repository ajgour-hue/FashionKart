import React, { useEffect, useState } from 'react'
import { useProduct } from '../hook/useProduct';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus as PlusIcon, Trash2 as TrashIcon, ArrowLeft } from 'lucide-react';

const SellerProductDetails = () => {
  const [ product, setProduct ] = useState(null);
  const [ localVariants, setLocalVariants ] = useState([]);
  const [ isAddingVariant, setIsAddingVariant ] = useState(false);
  const [ loading, setLoading ] = useState(true);

  // UI state for inputs to maintain focus
  const [ attributeInputs, setAttributeInputs ] = useState([ { key: '', value: '' } ]);

  // New variant state
  const [ newVariant, setNewVariant ] = useState({
    images: [],
    stock: 0,
    attributes: {}, // Strictly an object
    price: { amount: '', currency: 'INR' }
  });

  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById, handleAddProductVariant } = useProduct();
async function fetchProductDetails() {
    setLoading(true);
    try {
      const data = await handleGetProductById(productId);
      const prod = data?.product || data;
      setProduct(prod);
      // Initialize variants locally
      if (prod?.variants) {
        setLocalVariants(prod.variants);
      }
    } catch (error) {
      console.error("Failed to fetch product details", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [ productId ]);

  // Handlers for modifying existing variant stock natively
  const handleStockChange = (index, newStock) => {
    const updatedVariants = [ ...localVariants ];
    updatedVariants[ index ] = { ...updatedVariants[ index ], stock: Number(newStock) };
    setLocalVariants(updatedVariants);
  };

  // Handlers for New Variant Form
  const handleAddNewVariant = async () => {
    // Validate required at least one attribute to be filled
    const hasValidAttribute = attributeInputs.some(attr => attr.key.trim() && attr.value.trim());
    if (!hasValidAttribute) {
      alert("At least one valid attribute is required.");
      return;
    }

    // Maps preview URL so the variant list can display the image locally
    const cleanImages = newVariant.images.map(img => ({ url: img.previewUrl, file: img.file }));

    // Attributes is already an object in newVariant, just use it safely
    const cleanAttributes = { ...newVariant.attributes };

    const variantToSave = {
      images: cleanImages,
      stock: Number(newVariant.stock),
      attributes: cleanAttributes,
      price: newVariant.price.amount
        ? Number(newVariant.price.amount)
        : undefined // price is optional
    };

    setLocalVariants([ ...localVariants, variantToSave ]);
    setIsAddingVariant(false);

    await handleAddProductVariant(productId, variantToSave)

    console.log(res);

    // Reset form
    // Note: should ideally revoke old object URLs as well to prevent memory leaks if it were a long-lived SPA
    setAttributeInputs([ { key: '', value: '' } ]);
    setNewVariant({
      images: [],
      stock: 0,
      attributes: {},
      price: { amount: '', currency: 'INR' }
    });
  };

  const handleAddAttribute = () => {
    setAttributeInputs(prev => [ ...prev, { key: '', value: '' } ]);
  };

  const handleAttributeChange = (index, field, value) => {
    const updatedInputs = [ ...attributeInputs ];
    updatedInputs[ index ][ field ] = value;
    setAttributeInputs(updatedInputs);

    // Synchronize to object format
    const newAttrsObj = {};
    updatedInputs.forEach(attr => {
      if (attr.key.trim() !== '') {
        newAttrsObj[ attr.key.trim() ] = attr.value;
      }
    });
    setNewVariant(prev => ({ ...prev, attributes: newAttrsObj }));
  };

  const handleRemoveAttribute = (index) => {
    const updatedInputs = attributeInputs.filter((_, i) => i !== index);
    setAttributeInputs(updatedInputs);

    // Synchronize to object format
    const newAttrsObj = {};
    updatedInputs.forEach(attr => {
      if (attr.key.trim() !== '') {
        newAttrsObj[ attr.key.trim() ] = attr.value;
      }
    });
    setNewVariant(prev => ({ ...prev, attributes: newAttrsObj }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const availableSlots = 7 - newVariant.images.length;
    const filesToAdd = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      alert(`You can only upload up to 7 images. ${filesToAdd.length} added.`);
    }

    const newImageObjects = filesToAdd.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setNewVariant(prev => ({
      ...prev,
      images: [ ...prev.images, ...newImageObjects ]
    }));

    // Clear the input so identical files can be selected again if needed
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = newVariant.images[ index ];
    if (imageToRemove?.previewUrl) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }
    const updatedImages = newVariant.images.filter((_, i) => i !== index);
    setNewVariant(prev => ({ ...prev, images: updatedImages }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-neutral-500">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-neutral-500">Product not found.</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12">

      {/* ── Page Header ── */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="w-11 h-11 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="uppercase tracking-[3px] text-xs text-neutral-400">
            Seller Dashboard
          </p>
          <h1 className="mt-1 text-4xl font-semibold">
            Product Details
          </h1>
        </div>
      </div>

      {/* Base Product Info */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 pb-16">
        <div className="w-full md:w-1/2">
          {/* Gallery */}
          <div className="w-full aspect-[4/5] max-w-[420px] mx-auto md:mx-0 overflow-hidden rounded-xl bg-neutral-100">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[ 0 ].url} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
            )}
          </div>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto max-w-[420px] mx-auto md:mx-0">
              {product.images.slice(1).map((img, i) => (
                <img key={i} src={img.url} alt={`Thumb ${i}`} className="w-16 h-20 object-cover rounded-lg shrink-0 bg-neutral-100" />
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <p className="uppercase tracking-[3px] text-xs text-neutral-400 mb-2">
            Listing
          </p>
          <h2 className="text-4xl font-semibold leading-tight mb-4">
            {product.title}
          </h2>
          <p className="text-neutral-500 mb-8 leading-relaxed max-w-md">
            {product.description}
          </p>
          <div className="text-xl font-semibold">
            {product.price?.amount} {product.price?.currency}
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate(`/seller/edit-product/${product._id}`)}
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-800 transition"
            >
              Edit Product
            </button>
          </div>
        </div>
      </div>

      {/* Variants & Inventory */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <p className="uppercase tracking-[3px] text-xs text-neutral-400">
              Inventory
            </p>
            <h2 className="mt-1 text-3xl font-semibold">
              Variants
            </h2>
          </div>
          {!isAddingVariant && (
            <button
              onClick={() => setIsAddingVariant(true)}
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-neutral-800 transition flex items-center gap-2 shrink-0"
            >
              <PlusIcon size={14} /> New Variant
            </button>
          )}
        </div>

        {/* Add New Variant Form */}
        {isAddingVariant && (
          <div className="p-6 md:p-10 mb-14 rounded-xl border border-neutral-200 bg-white">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-semibold">
                Create Variant
              </h3>
              <button
                onClick={() => setIsAddingVariant(false)}
                className="text-xs uppercase tracking-[2px] text-neutral-400 hover:text-black transition"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Form Left Col: Attributes & Basics */}
              <div className="flex flex-col gap-8">

                {/* Dynamic Attributes */}
                <div>
                  <label className="block uppercase tracking-[2px] text-xs text-neutral-400 mb-3">
                    Attributes (e.g. Size, Color) *
                  </label>
                  <div className="flex flex-col gap-3">
                    {attributeInputs.map((attr, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Key (e.g., Size)"
                          value={attr.key}
                          onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                          className="w-1/2 bg-neutral-100 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-black transition"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g., M)"
                          value={attr.value}
                          onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                          className="w-1/2 bg-neutral-100 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-black transition"
                        />
                        {attributeInputs.length > 1 && (
                          <button
                            onClick={() => handleRemoveAttribute(index)}
                            className="p-2 rounded-full text-red-500 hover:bg-red-50 transition"
                          >
                            <TrashIcon size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleAddAttribute}
                    className="mt-4 text-xs uppercase tracking-[2px] font-medium flex items-center gap-1 text-neutral-500 hover:text-black transition"
                  >
                    <PlusIcon size={12} /> Add Attribute
                  </button>
                </div>

                {/* Stock & Price */}
                <div className="flex gap-6">
                  <div className="w-1/2 flex flex-col gap-2">
                    <label className="uppercase tracking-[2px] text-xs text-neutral-400">
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      value={newVariant.stock}
                      onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                      className="w-full bg-neutral-100 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-black transition"
                    />
                  </div>
                  <div className="w-1/2 flex flex-col gap-2">
                    <label className="uppercase tracking-[2px] text-xs text-neutral-400">
                      Price (Optional)
                    </label>
                    <input
                      type="number"
                      value={newVariant.price.amount}
                      onChange={(e) => setNewVariant({ ...newVariant, price: { ...newVariant.price, amount: e.target.value } })}
                      placeholder="Default if empty"
                      className="w-full bg-neutral-100 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-black transition"
                    />
                  </div>
                </div>
              </div>

              {/* Form Right Col: Images */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="uppercase tracking-[2px] text-xs text-neutral-400">
                    Images (Max 7, Optional)
                  </label>
                  <span className="text-xs text-neutral-400">{newVariant.images.length}/7</span>
                </div>

                {newVariant.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {newVariant.images.map((img, index) => (
                      <div key={index} className="relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100">
                        <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-white shadow-md text-red-500"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {newVariant.images.length < 7 && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-neutral-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                onClick={handleAddNewVariant}
                className="bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-800 transition"
              >
                Save Variant
              </button>
            </div>
          </div>
        )}

        {/* Variants List */}
        {localVariants.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-neutral-400">
              No variants have been created yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {localVariants.map((variant, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="w-full aspect-[4/5] overflow-hidden mb-4 rounded-xl bg-neutral-100">
                  {variant.images && variant.images.length > 0 ? (
                    <img src={variant.images[ 0 ].url} alt="Variant" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">No Image</div>
                  )}
                </div>

                {/* Attributes */}
                <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
                  {Object.entries(variant.attributes || {}).map(([ key, val ], i, arr) => (
                    <span key={key} className="text-xs uppercase tracking-[1px] text-neutral-500">
                      <span className="text-neutral-400">{key}:</span> {val}{i < arr.length - 1 ? ' /' : ''}
                    </span>
                  ))}
                </div>

                <div className="text-base font-semibold mb-4">
                  {variant.price?.amount ? `${variant.price.amount} ${variant.price.currency}` : 'Base Price'}
                </div>

                {/* Stock Management Row */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                  <label className="uppercase tracking-[2px] text-xs text-neutral-400">Stock</label>
                  <input
                    type="number"
                    value={variant.stock || 0}
                    onChange={(e) => handleStockChange(idx, e.target.value)}
                    className="w-16 bg-neutral-100 rounded-lg px-2 py-1 outline-none border border-transparent focus:border-black transition text-right"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
  )
}

export default SellerProductDetails;