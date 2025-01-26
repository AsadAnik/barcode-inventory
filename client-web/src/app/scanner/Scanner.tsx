"use client";
import React, { useState, useRef } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { usePostProduct } from "@/hooks";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import debounce from 'lodash/debounce';

const BarcodeScanner: React.FC = () => {
    const router = useRouter();
    const [scannerActive, setScannerActive] = useState<boolean>(false);
    const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [postProductToServer, productServerData] = usePostProduct();
    const barcodeCache = useRef<Set<string>>(new Set()); // Caches barcodes to avoid duplicate requests

    // console.log("productServerData.data: ------- ", productServerData.data);

    // Debounced handler for fetching product details
    const handleFetchProductDetails = debounce(async (barcode: string) => {
        if (barcodeCache.current.has(barcode)) {
            toast("Barcode already scanned");
            return;
        }
        barcodeCache.current.add(barcode);

        try {
            await postProductToServer(barcode);
        } catch (err) {
            console.error("Error in fetching product details:", err);
        }
    }, 500); // 500ms debounce duration

    const handleScannerToggle = () => {
        setScannerActive((prev) => !prev);
        setError(null);
        setScannedBarcode(null);
    };

    const handleSaveToUncategorized = () => {
        if (productServerData.data) {
            router.push("/kanban");
        }
    };

    return (
        <div className="h-screen p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6 text-center">Barcode Scanner</h1>

            <div className="flex flex-col items-center mb-6">
                <button
                    onClick={handleScannerToggle}
                    className={`px-4 py-2 rounded mb-4 ${scannerActive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                        } text-white`}
                >
                    {scannerActive ? "Stop Scanner" : "Start Scanner"}
                </button>

                {scannerActive && (
                    <div className="w-full max-w-md">
                        <BarcodeScannerComponent
                            constraints={{
                                facingMode: "environment",
                                width: 1280,
                                height: 720,
                            }}
                            onUpdate={(err, result) => {
                                if (err) {
                                    console.error(err);
                                    setError("Scanning error. Please try again.");
                                }

                                console.log('result here -- ', result);

                                if (result && result.text) {
                                    const barcode = result.text;
                                    setScannedBarcode(barcode);
                                    handleFetchProductDetails(barcode); // Debounced API call
                                    setScannerActive(false);
                                }
                            }}
                        />
                    </div>
                )}
            </div>

            {scannedBarcode && (
                <div className="text-center mb-4">
                    <p className="text-lg font-semibold">
                        Detected Barcode: <span className="text-blue-500">{scannedBarcode}</span>
                    </p>
                </div>
            )}

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            {productServerData.loading && <p className="text-center text-gray-600">Fetching product details...</p>}

            {productServerData.data && !productServerData.loading && (
                <div className="p-4 bg-white rounded shadow mt-6">
                    <h2 className="text-lg font-bold mb-2">Product Details</h2>
                    <p>
                        <strong>Name:</strong> {(productServerData.data as any).name}
                    </p>
                    <p>
                        <strong>Barcode:</strong> {(productServerData.data as any).barcode}
                    </p>
                    <button
                        onClick={handleSaveToUncategorized}
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
