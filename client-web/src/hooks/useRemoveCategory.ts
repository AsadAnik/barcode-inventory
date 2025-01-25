import { useState } from 'react';
import { axiosApiClient } from '@/lib';
import toast from 'react-hot-toast';

const useRemoveCategory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    /**
     * REMOVE CATEGORY
     * Remove category from database
     * @param categoryName 
     * @returns 
     */
    const removeCategory = async (categoryId: string) => {
        try {
            setLoading(true);
            setError(false);
            const response = await axiosApiClient.delete(`/categories/${categoryId}`);
            toast.success('Category Removed successfully!');
            return response.data; // Return data if necessary

        } catch (err) {
            console.error('Error removing category:', err);
            setError(true);
            toast.error('Failed to remove category');
            throw err;

        } finally {
            setLoading(false);
        }
    };

    return { removeCategory, loading, error };
};

export default useRemoveCategory;
