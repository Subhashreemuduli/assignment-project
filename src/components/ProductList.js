import React, { useState } from "react";
import { FiEdit2, FiSearch, FiX } from "react-icons/fi";
import { sampleProducts } from "../constants";
import { v4 as uuidv4 } from "uuid";

const ProductList = () => {
  const [products, setProducts] = useState([{ id: 1, name: "Select Product" }]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [discounts, setDiscounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const openProductPicker = (index) => {
    setEditingIndex(index);
    setSearchQuery("");
    setIsPickerOpen(true);
  };

  const toggleExpand = (productId) => {
    setExpandedProducts((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleVariantSelect = (product, variant) => {
    const key = `${product.id}-${variant.id}`;
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.key === key);
      return isSelected
        ? prev.filter((p) => p.key !== key)
        : [...prev, { key, product, variant }];
    });
  };

  const applySelection = () => {
    if (editingIndex !== null) {
      const updatedProducts = [...products];
      updatedProducts[editingIndex] = selectedProducts.map((p) => ({
        id: p.product.id,
        name: `${p.product.title} - ${p.variant.title}`,
        price: p.variant.price,
      }));
      setProducts(updatedProducts.flat());
    }
    setIsPickerOpen(false);
    setSelectedProducts([]);
  };

  const toggleDiscount = (index) => {
    setDiscounts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const removeProduct = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredProducts = sampleProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-3/4">
        <h1 className="text-xl font-semibold mb-4">Add Products</h1>
        <div className="grid grid-cols-2 gap-4 mb-4 font-medium">
          <span>Product</span>
          <span>Discount</span>
        </div>
        {products.map((product, index) => (
          <div
            key={uuidv4()}
            className="flex items-center space-x-4 mb-2 border rounded p-2 bg-gray-50"
          >
            <div className="relative flex items-center border px-4 py-2 rounded w-1/2 bg-white">
              <span>{product.name}</span>
              <FiEdit2
                className="absolute right-2 cursor-pointer text-gray-500 hover:text-black"
                onClick={() => openProductPicker(index)}
              />
            </div>
            {discounts[index] ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="0"
                  className="border p-2 w-16 rounded"
                  value={discounts[index]?.value}
                  onChange={(e) =>
                    setDiscounts((prev) => ({
                      ...prev,
                      [index]: { ...prev[index], value: e.target.value },
                    }))
                  }
                />
                <select
                  className="border p-2 rounded"
                  value={discounts[index]?.type || "flat off"}
                  onChange={(e) =>
                    setDiscounts((prev) => ({
                      ...prev,
                      [index]: { ...prev[index], type: e.target.value },
                    }))
                  }
                >
                  <option value="flat off">flat off</option>
                  <option value="% off">% off</option>
                </select>
              </div>
            ) : (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => toggleDiscount(index)}
              >
                Add Discount
              </button>
            )}
            {products.length > 1 && (
              <FiX
                className="cursor-pointer text-xl hover:text-red-700"
                onClick={() => removeProduct(index)}
              />
            )}
          </div>
        ))}
        <div className="mt-4 flex justify-end">
          <button
            className="border-2 border-green-800 text-green-900 px-4 py-2 w-1/2 rounded"
            onClick={() =>
              setProducts([
                ...products,
                { id: products.length + 1, name: "Select Product" },
              ])
            }
          >
            Add Product
          </button>
        </div>
      </div>

      {isPickerOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h2 className="text-lg font-semibold mb-4">Add Products</h2>
            <div className="flex items-center border p-2 rounded mb-4">
              <FiSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search product..."
                className="border-none outline-none w-full"
                value={searchQuery}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setSearchQuery(e.target.value);
                  }
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <button
                className="text-gray-500 hover:text-black"
                onClick={() => setIsPickerOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="max-h-60 overflow-auto">
              {filteredProducts.map((product) => (
                <div key={uuidv4()} className="border-b py-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={product.image.src}
                      alt={product.title}
                      className="w-10 h-10 object-cover"
                    />
                    <p className="font-medium">{product.title}</p>
                    {product.variants.length > 1 && (
                      <button
                        className="text-blue-600 ml-auto"
                        onClick={() => toggleExpand(product.id)}
                      >
                        {expandedProducts[product.id]
                          ? "Hide Variants"
                          : "Show Variants"}
                      </button>
                    )}
                  </div>
                  {(expandedProducts[product.id] ||
                    product.variants.length === 1) && (
                    <div className="ml-6 mt-2">
                      {product.variants.map((variant) => (
                        <div
                          key={uuidv4()}
                          className="flex items-center space-x-2 py-1"
                        >
                          <input
                            type="checkbox"
                            checked={selectedProducts.some(
                              (p) => p.key === `${product.id}-${variant.id}`
                            )}
                            onChange={() =>
                              handleVariantSelect(product, variant)
                            }
                          />
                          <span>
                            {variant.title} - ${variant.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              {selectedProducts.length > 0 && (
                <div className="absolute right-[65%] mt-2 font-medium">
                  {selectedProducts.length} product
                  {selectedProducts.length > 1 ? "s" : ""} selected
                </div>
              )}
              <button
                className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                onClick={applySelection}
              >
                Add
              </button>
              <button
                className="border border-gray-400 px-4 py-2 rounded"
                onClick={() => setIsPickerOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
