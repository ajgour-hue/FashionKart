import React, { useEffect, useState } from 'react'
import { useProduct } from '../hook/useProduct';
import { useParams, useNavigate } from 'react-router';
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
      <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center">
        <p className="text-[#6e6258] italic font-serif">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center">
        <p className="text-[#6e6258] italic font-serif">Product not found.</p>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-sans pb-24">
      {/* Top Banner / Header */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-[#e9e5dd]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#c9a96e] tracking-[0.2em] text-sm uppercase hover:text-[#745a27] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span className="font-serif">Snitch.</span>
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 mt-10">

        {/* Base Product Info */}
        <section className="flex flex-col md:flex-row gap-10 md:gap-16 mb-20">
          <div className="w-full md:w-1/2">
            {/* Gallery placeholder */}
            <div className="w-full aspect-[4/5] bg-[#f5f3f0] overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[ 0 ].url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#7f7668] italic font-serif">No Image</div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {product.images.slice(1).map((img, i) => (
                  <img key={i} src={img.url} alt={`Thumb ${i}`} className="w-16 h-20 object-cover bg-[#f5f3f0] shrink-0" />
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h1 className="font-serif italic text-4xl md:text-5xl leading-tight mb-3">{product.title}</h1>
            <div className="w-12 h-px bg-[#c9a96e] mb-6" />
            <p className="text-[#6e6258] text-base mb-8 leading-relaxed max-w-md">{product.description}</p>
            <div className="text-xl tracking-wide font-light">
              {product.price?.amount} {product.price?.currency}
            </div>
          </div>
        </section>

        {/* Variants & Inventory */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
            <div>
              <h2 className="font-serif italic text-3xl">Variants & Inventory</h2>
              <div className="w-12 h-px bg-[#c9a96e] mt-3" />
            </div>
            {!isAddingVariant && (
              <button
                onClick={() => setIsAddingVariant(true)}
                className="bg-[#1b1c1a] text-white px-6 py-3 uppercase tracking-[0.15em] text-xs hover:bg-[#3a3a36] transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <PlusIcon size={14} /> New Variant
              </button>
            )}
          </div>

          {/* Add New Variant Form */}
          {isAddingVariant && (
            <div className="bg-white p-6 md:p-10 mt-10 mb-14 border border-[#e9e5dd]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif italic text-2xl">Create Variant</h3>
                <button
                  onClick={() => setIsAddingVariant(false)}
                  className="text-[#7f7668] hover:text-[#1b1c1a] text-xs uppercase tracking-[0.15em] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Form Left Col: Attributes & Basics */}
                <div className="space-y-8">

                  {/* Dynamic Attributes */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#a8a094] mb-3">Attributes (e.g. Size, Color) *</label>
                    <div className="space-y-3">
                      {attributeInputs.map((attr, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Key (e.g., Size)"
                            value={attr.key}
                            onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                            className="w-1/2 bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#c9a96e] placeholder:text-[#d0c5b5] font-light"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g., M)"
                            value={attr.value}
                            onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                            className="w-1/2 bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#c9a96e] placeholder:text-[#d0c5b5] font-light"
                          />
                          {attributeInputs.length > 1 && (
                            <button onClick={() => handleRemoveAttribute(index)} className="text-[#ba1a1a] p-2 hover:bg-[#fbeceb] transition-colors cursor-pointer">
                              <TrashIcon size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleAddAttribute}
                      className="mt-4 text-[#745a27] text-xs uppercase tracking-[0.15em] flex items-center gap-1 hover:text-[#5a4312] cursor-pointer"
                    >
                      <PlusIcon size={12} /> Add Attribute
                    </button>
                  </div>

                  {/* Stock & Price */}
                  <div className="flex gap-6">
                    <div className="w-1/2">
                      <label className="block text-xs uppercase tracking-[0.15em] text-[#a8a094] mb-2">Initial Stock</label>
                      <input
                        type="number"
                        value={newVariant.stock}
                        onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                        className="w-full bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#c9a96e] font-light"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-xs uppercase tracking-[0.15em] text-[#a8a094] mb-2">Price (Optional)</label>
                      <input
                        type="number"
                        value={newVariant.price.amount}
                        onChange={(e) => setNewVariant({ ...newVariant, price: { ...newVariant.price, amount: e.target.value } })}
                        placeholder="Default if empty"
                        className="w-full bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#c9a96e] placeholder:text-[#d0c5b5] font-light"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Right Col: Images */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-xs uppercase tracking-[0.15em] text-[#a8a094]">Images (Max 7, Optional)</label>
                    <span className="text-xs text-[#a8a094]">{newVariant.images.length}/7</span>
                  </div>

                  {newVariant.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {newVariant.images.map((img, index) => (
                        <div key={index} className="relative aspect-[4/5] bg-[#f5f3f0]">
                          <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-white/80 p-1 text-[#ba1a1a] hover:bg-white transition-colors cursor-pointer"
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
                        className="block w-full text-sm text-[#6e6258]
                          file:mr-4 file:py-2 file:px-4
                          file:border-0 file:bg-[#f5f3f0] file:text-[#1b1c1a]
                          hover:file:bg-[#e9e5dd] file:cursor-pointer file:uppercase file:text-xs file:tracking-[0.15em] file:font-serif
                          cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={handleAddNewVariant}
                  className="bg-[#1b1c1a] text-white px-8 py-3 uppercase tracking-[0.15em] text-xs hover:bg-[#3a3a36] transition-colors cursor-pointer"
                >
                  Save Variant
                </button>
              </div>
            </div>
          )}

          {/* Variants List */}
          {localVariants.length === 0 ? (
            <div className="py-16 text-center text-[#a8a094] italic font-serif">
              <p>No variants have been created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10">
              {localVariants.map((variant, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="w-full aspect-[4/5] bg-[#f5f3f0] overflow-hidden mb-4">
                    {variant.images && variant.images.length > 0 ? (
                      <img src={variant.images[ 0 ].url} alt="Variant" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#a8a094] italic font-serif">No Image</div>
                    )}
                  </div>

                  {/* Attributes */}
                  <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
                    {Object.entries(variant.attributes || {}).map(([ key, val ], i, arr) => (
                      <span key={key} className="text-xs uppercase tracking-[0.1em] text-[#6e6258]">
                        <span className="text-[#a8a094]">{key}:</span> {val}{i < arr.length - 1 ? ' /' : ''}
                      </span>
                    ))}
                  </div>

                  <div className="text-base font-light mb-4">
                    {variant.price?.amount ? `${variant.price.amount} ${variant.price.currency}` : 'Base Price'}
                  </div>

                  {/* Stock Management Row */}
                  <div className="flex items-center justify-between border-t border-[#e9e5dd] pt-3">
                    <label className="text-xs text-[#a8a094] uppercase tracking-[0.15em]">Stock</label>
                    <input
                      type="number"
                      value={variant.stock || 0}
                      onChange={(e) => handleStockChange(idx, e.target.value)}
                      className="w-16 bg-transparent border-b border-[#d0c5b5] py-1 text-right focus:outline-none focus:border-[#c9a96e] font-serif text-base"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

      </main>
    </div>
  )
}

export default SellerProductDetails;