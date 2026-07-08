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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fbf9f6' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7A6E63' }} className="italic text-lg">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fbf9f6' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7A6E63' }} className="italic text-lg">Product not found.</p>
      </div>
    );
  }

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
        .field-input { transition: border-color 0.3s ease; }
        .variant-card { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        .variant-card:hover { transform: translateY(-4px); }
        .action-btn { transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>

      <div
        className="min-h-screen pb-24"
        style={{ backgroundColor: '#fbf9f6', color: '#1b1c1a', fontFamily: "'Inter', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">

          {/* ── Page Header ── */}
          <div className="pt-6 sm:pt-8 pb-5 sm:pb-6 flex items-end gap-5 overflow-hidden fade-in">
            <button
              onClick={() => navigate(-1)}
              className="text-xl leading-none transition-colors duration-200 mb-1 cursor-pointer"
              style={{ color: '#B5ADA3' }}
              aria-label="Go back"
              onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
              onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
            >
              <ArrowLeft size={20} />
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
                Product Details
              </h1>
              <div className="mt-2 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
            </div>
          </div>

          {/* Base Product Info */}
          <section className="flex flex-col md:flex-row gap-10 md:gap-16 pt-4 pb-16 fade-in-up">
            <div className="w-full md:w-1/2">
              {/* Gallery */}
              <div className="w-full aspect-[3/4] max-w-[420px] mx-auto md:mx-0 overflow-hidden rounded-sm" style={{ backgroundColor: '#f5f3f0' }}>
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[ 0 ].url} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center italic" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#B5ADA3' }}>No Image</div>
                )}
              </div>
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto max-w-[420px] mx-auto md:mx-0">
                  {product.images.slice(1).map((img, i) => (
                    <img key={i} src={img.url} alt={`Thumb ${i}`} className="w-16 h-20 object-cover rounded-sm shrink-0" style={{ backgroundColor: '#f5f3f0' }} />
                  ))}
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <span
                className="text-[10px] uppercase tracking-[0.3em] font-medium mb-3 block"
                style={{ color: '#C9A96E' }}
              >
                Listing
              </span>
              <h2
                className="text-4xl md:text-5xl font-light leading-tight mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
              >
                {product.title}
              </h2>
              <div className="w-14 h-px mb-6" style={{ backgroundColor: '#C9A96E' }} />
              <p className="text-base mb-8 leading-relaxed max-w-md" style={{ color: '#7A6E63' }}>{product.description}</p>
              <div
                className="text-xl tracking-wide font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
              >
                {product.price?.amount} {product.price?.currency}
              </div>

              <div className="mt-8">
    <button
        onClick={() => navigate(`/seller/edit-product/${product._id}`)}
        className="py-3 px-8 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300"
        style={{
            backgroundColor: "#1b1c1a",
            color: "#fbf9f6"
        }}
        onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "#C9A96E";
            e.currentTarget.style.color = "#1b1c1a";
        }}
        onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "#1b1c1a";
            e.currentTarget.style.color = "#fbf9f6";
        }}
    >
        Edit Product
    </button>
</div> 
            </div>
          </section>

          {/* Variants & Inventory */}
          <section className="fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
              <div>
                <span
                  className="text-[10px] uppercase tracking-[0.3em] font-medium mb-2 block"
                  style={{ color: '#C9A96E' }}
                >
                  Inventory
                </span>
                <h2
                  className="text-3xl font-light leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                >
                  Variants
                </h2>
                <div className="mt-2 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
              </div>
              {!isAddingVariant && (
                <button
                  onClick={() => setIsAddingVariant(true)}
                  className="action-btn py-3 px-6 text-[11px] uppercase tracking-[0.3em] font-medium flex items-center gap-2 cursor-pointer shrink-0"
                  style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#C9A96E';
                    e.currentTarget.style.color = '#1b1c1a';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#1b1c1a';
                    e.currentTarget.style.color = '#fbf9f6';
                  }}
                >
                  <PlusIcon size={14} /> New Variant
                </button>
              )}
            </div>

            {/* Add New Variant Form */}
            {isAddingVariant && (
              <div className="p-6 md:p-10 mt-8 mb-14 fade-in-up" style={{ backgroundColor: '#ffffff', border: '1px solid #e9e5dd' }}>
                <div className="flex justify-between items-center mb-8">
                  <h3
                    className="text-2xl font-light"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                  >
                    Create Variant
                  </h3>
                  <button
                    onClick={() => setIsAddingVariant(false)}
                    className="text-[10px] uppercase tracking-[0.2em] cursor-pointer transition-colors duration-200"
                    style={{ color: '#B5ADA3' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#1b1c1a'}
                    onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Form Left Col: Attributes & Basics */}
                  <div className="flex flex-col gap-8">

                    {/* Dynamic Attributes */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] font-medium mb-3" style={{ color: '#C9A96E' }}>
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
                              className="field-input w-1/2 bg-transparent outline-none py-2 font-light"
                              style={{ borderBottom: '1px solid #d8d2c6', color: '#1b1c1a' }}
                              onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                              onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                            />
                            <input
                              type="text"
                              placeholder="Value (e.g., M)"
                              value={attr.value}
                              onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                              className="field-input w-1/2 bg-transparent outline-none py-2 font-light"
                              style={{ borderBottom: '1px solid #d8d2c6', color: '#1b1c1a' }}
                              onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                              onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                            />
                            {attributeInputs.length > 1 && (
                              <button
                                onClick={() => handleRemoveAttribute(index)}
                                className="p-2 cursor-pointer transition-colors duration-200"
                                style={{ color: '#ba1a1a' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fbeceb'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <TrashIcon size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={handleAddAttribute}
                        className="mt-4 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-1 cursor-pointer transition-colors duration-200"
                        style={{ color: '#C9A96E' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#a68950'}
                        onMouseLeave={e => e.currentTarget.style.color = '#C9A96E'}
                      >
                        <PlusIcon size={12} /> Add Attribute
                      </button>
                    </div>

                    {/* Stock & Price */}
                    <div className="flex gap-6">
                      <div className="w-1/2 flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#C9A96E' }}>
                          Initial Stock
                        </label>
                        <input
                          type="number"
                          value={newVariant.stock}
                          onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                          className="field-input w-full bg-transparent outline-none py-2 font-light"
                          style={{ borderBottom: '1px solid #d8d2c6', color: '#1b1c1a' }}
                          onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                          onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                        />
                      </div>
                      <div className="w-1/2 flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#C9A96E' }}>
                          Price (Optional)
                        </label>
                        <input
                          type="number"
                          value={newVariant.price.amount}
                          onChange={(e) => setNewVariant({ ...newVariant, price: { ...newVariant.price, amount: e.target.value } })}
                          placeholder="Default if empty"
                          className="field-input w-full bg-transparent outline-none py-2 font-light"
                          style={{ borderBottom: '1px solid #d8d2c6', color: '#1b1c1a' }}
                          onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                          onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Right Col: Images */}
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#C9A96E' }}>
                        Images (Max 7, Optional)
                      </label>
                      <span className="text-[10px]" style={{ color: '#B5ADA3' }}>{newVariant.images.length}/7</span>
                    </div>

                    {newVariant.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {newVariant.images.map((img, index) => (
                          <div key={index} className="relative aspect-[3/4] overflow-hidden rounded-sm" style={{ backgroundColor: '#f5f3f0' }}>
                            <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 p-1 cursor-pointer transition-colors duration-200"
                              style={{ backgroundColor: 'rgba(255,255,255,0.85)', color: '#ba1a1a' }}
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
                          className="block w-full text-sm cursor-pointer"
                          style={{ color: '#7A6E63' }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    onClick={handleAddNewVariant}
                    className="action-btn py-3 px-8 text-[11px] uppercase tracking-[0.3em] font-medium cursor-pointer"
                    style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#C9A96E';
                      e.currentTarget.style.color = '#1b1c1a';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#1b1c1a';
                      e.currentTarget.style.color = '#fbf9f6';
                    }}
                  >
                    Save Variant
                  </button>
                </div>
              </div>
            )}

            {/* Variants List */}
            {localVariants.length === 0 ? (
              <div className="py-16 text-center fade-in">
                <p className="italic text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#B5ADA3' }}>
                  No variants have been created yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10 pb-8">
                {localVariants.map((variant, idx) => (
                  <div key={idx} className="variant-card flex flex-col fade-in-up" style={{ animationDelay: `${Math.min(idx * 60, 400)}ms` }}>
                    <div className="w-full aspect-[3/4] overflow-hidden mb-4 rounded-sm" style={{ backgroundColor: '#f5f3f0' }}>
                      {variant.images && variant.images.length > 0 ? (
                        <img src={variant.images[ 0 ].url} alt="Variant" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs italic" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#B5ADA3' }}>No Image</div>
                      )}
                    </div>

                    {/* Attributes */}
                    <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
                      {Object.entries(variant.attributes || {}).map(([ key, val ], i, arr) => (
                        <span key={key} className="text-[11px] uppercase tracking-[0.15em]" style={{ color: '#7A6E63' }}>
                          <span style={{ color: '#B5ADA3' }}>{key}:</span> {val}{i < arr.length - 1 ? ' /' : ''}
                        </span>
                      ))}
                    </div>

                    <div
                      className="text-base font-light mb-4"
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                    >
                      {variant.price?.amount ? `${variant.price.amount} ${variant.price.currency}` : 'Base Price'}
                    </div>

                    {/* Stock Management Row */}
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #e9e5dd' }}>
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#C9A96E' }}>Stock</label>
                      <input
                        type="number"
                        value={variant.stock || 0}
                        onChange={(e) => handleStockChange(idx, e.target.value)}
                        className="field-input w-16 bg-transparent outline-none py-1 text-right"
                        style={{ borderBottom: '1px solid #d8d2c6', fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                        onFocus={e => e.currentTarget.style.borderBottom = '1px solid #C9A96E'}
                        onBlur={e => e.currentTarget.style.borderBottom = '1px solid #d8d2c6'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </section>

        </div>
      </div>
    </>
  )
}

export default SellerProductDetails;