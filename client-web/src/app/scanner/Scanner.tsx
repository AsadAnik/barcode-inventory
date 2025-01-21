'use client';
import React, { useState } from 'react';

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState<any>(null);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`https://products-test-aci.onrender.com/product/${barcode}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details", error);
    }
  };

  return (
    <div className="h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Barcode Scanner</h1>
      <div className="mb-6">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Enter Barcode"
          className="px-4 py-2 border border-gray-300 rounded w-full mb-4"
        />
        <button
          onClick={fetchProduct}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        >
          Fetch Product
        </button>
      </div>
      {product && (
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-bold mb-2">Product Details</h2>
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Barcode:</strong> {product.barcode}</p>
          <button className="px-4 py-2 bg-green-500 text-white rounded mt-4 hover:bg-green-600">
            Save to Uncategorized
          </button>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;