import { useState } from "react";
import toast from "react-hot-toast";
import { axiosApiClient } from '@/lib';

const useUpdateProductCategory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * UPDATE PRODUCT CATEGORY
     * Updates the category of the product
     * @param productId - The ID of the product to update
     * @param newCategory - The new category to assign to the product
     * @returns 
     */
    const updateCategory = async (productId: string, newCategoryId: string) => {
        try {
            setLoading(true);
            setError(null);

            // Make API call to update the category
            const response = await axiosApiClient.patch(`/products/${productId}/update-category`, {
                categoryId: newCategoryId,
            });

            toast.success("Product moved to new category!");
            return response.data;

        } catch (err) {
            console.error("Error moving product to new category:", err);
            setError("Failed to update category");
            toast.error("Failed to update product's category");
            throw err;

        } finally {
            setLoading(false);
        }
    };

    return { updateCategory, loading, error };
};

export default useUpdateProductCategory;
