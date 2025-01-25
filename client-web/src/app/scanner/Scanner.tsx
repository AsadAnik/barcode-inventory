"use client";

import React, { useState, useEffect } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { usePostProduct } from '@/hooks';
import toast from 'react-hot-toast';

interface Product {
    name: string;
    barcode: string;
    [key: string]: any;
}

const BarcodeScanner: React.FC = () => {
    const [scannedBarcode, setScannedBarcode] = useState<string>("");
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [scannerActive, setScannerActive] = useState<boolean>(true);
    const [postProductToServerAction, productServerData]: any = usePostProduct();

    useEffect(() => {
        fetchProductDetails('1234567890138');    
    }, []);

    console.log('PRODUCT SERVICE DATA HERE - ', productServerData);

    
    /**
     * FETCHING PRODUCT DETAILS
     * This will fetch the details for the product
     * @param barcode 
     */
    // region Fetch Product Details
    const fetchProductDetails = async (barcode: string) => {
      await postProductToServerAction(barcode);
    };

    // region Save to Uncategorized
    const saveToUncategorized = async () => {
        if (!product) return;

        try {
            const response = await fetch("/api/saveProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...product, category: "Uncategorized" }),
            });

            if (!response.ok) {
                throw new Error("Failed to save product.");
            }

            toast.success("Product saved to Uncategorized successfully!");

        } catch (err) {
            toast.error(err instanceof Error
                ? err.message
                : "An unknown error occurred while saving the product."
            );
        }
    };

    // region UI
    return (
        <div className="h-screen p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6 text-center">Barcode Scanner</h1>

            <div className="flex flex-col items-center mb-6">
                {/* Toggle Scanner */}
                <button
                    onClick={() => setScannerActive((prev) => !prev)}
                    className={`px-4 py-2 rounded mb-4 ${scannerActive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                        } text-white`}
                >
                    {scannerActive ? "Stop Scanner" : "Start Scanner"}
                </button>

                {/* Scanner Component */}
                {scannerActive && (
                    <div className="w-full max-w-md">
                        <BarcodeScannerComponent
                            constraints={{
                                facingMode: "environment",
                                width: 1280,
                                height: 720,
                            }}
                            onUpdate={(err: unknown, result: any): void => {

                                // this is result..
                                // console.log('RESULT IS HERE - ', result);
                                // console.log('error is here - ', err);

                                if (result) {
                                    console.log('result here -- ', result);

                                    const detectedBarcode = result.text;
                                    setScannedBarcode(detectedBarcode);
                                    fetchProductDetails(detectedBarcode);
                                    setScannerActive(false); // Stop scanner after successful scan

                                } else if (err) {
                                    console.error('err error here - ', err);
                                    setError("Scanning error. Please try again.");
                                }
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Display Detected Barcode */}
            {scannedBarcode && (
                <p className="text-lg font-semibold text-gray-700 mb-4 text-center">
                    Detected Barcode: <span className="text-blue-500">{scannedBarcode}</span>
                </p>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            {/* Loading Indicator */}
            {loading && <p className="text-center text-gray-600">Fetching product details...</p>}

            {/* Product Details */}
            {product && (
                <div className="p-4 bg-white rounded shadow mt-6">
                    <h2 className="text-lg font-bold mb-2">Product Details</h2>
                    <p>
                        <strong>Name:</strong> {product.name}
                    </p>
                    <p>
                        <strong>Barcode:</strong> {product.barcode}
                    </p>
                    <button
                        onClick={saveToUncategorized}
                        className="px-4 py-2 bg-green-500 text-white rounded mt-4 hover:bg-green-600"
                    >
                        Save to Uncategorized
                    </button>
                </div>
            )}
        </div>
    );
};

export default BarcodeScanner;
