import { useState } from 'react';
import { axiosApiClient } from '@/lib';
import toast from 'react-hot-toast';

const useAddCategory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    /**
     * ADD CATEGORY
     * Add category to database
     * @param categoryName 
     * @returns 
     */
    const addCategory = async (categoryName: string) => {
        try {
            setLoading(true);
            setError(false);
            const response = await axiosApiClient.post('/categories', { name: categoryName });
            toast.success('Category added successfully!');
            return response.data; // Return data if necessary

        } catch (err) {
            console.error('Error adding category:', err);
            setError(true);
            toast.error('Failed to add category');
            throw err;

        } finally {
            setLoading(false);
        }
    };

    return { addCategory, loading, error };
};

export default useAddCategory;
