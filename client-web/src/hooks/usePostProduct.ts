import { useState } from "react";
import { axiosApiClient } from "@/lib";
import toast from "react-hot-toast";

const usePostProduct = () => {
    const [product, setProduct] = useState({
        data: null,
        loading: false,
        error: null,
    });

    const postProductToServer = async (barcode: string): Promise<void> => {
        if (product.loading) return; // Prevent overlapping requests

        setProduct((prev) => ({ ...prev, loading: true }));
        
        try {
            const response = await axiosApiClient.post("/products", { barcode });
            if (response.status === 200) {
                setProduct({
                    data: response.data.product,
                    loading: false,
                    error: null,
                });
                toast.success("Product posted successfully!");

            } else {
                throw new Error("Failed to post product");
            }
        } catch (error: any) {
            setProduct({ data: null, loading: false, error, });
            toast.error("Error while posting product");
        }
    };

    return [postProductToServer, product] as const;
};

export default usePostProduct;
