import { useState } from 'react';
import { axiosApiClient } from '@/lib';
import toast from 'react-hot-toast';

const usePostProduct = () => {
    const [product, setProduct] = useState({
        data: {},
        loading: false,
        error: null,
    });

    /**
     * POST PRODUCT TO SERVER
     * This will post the product to the server
     * @param barcode 
     */
    const postProductToServer = async (barcode: string = '1234567890138'): Promise<void> => {
        try {
            setProduct({ ...product, loading: true });

            const response = await axiosApiClient.post('/products', { barcode });
            console.log(`Product Post Response here - ${response}`);

            if (response.status === 200) {
                setProduct({
                    data: response.data,
                    loading: false,
                    error: null,
                });

                toast.success('Product posted successfully!');

            } else {
                console.log('Error while posting product:', response);
                setProduct({ ...product, loading: true });
                toast.error('Error while posting product');
                throw new Error('Failed to post product');
            }

        } catch (error) {
            console.error('Error fetching product:', error);
            setProduct({ ...product, loading: true });
            toast.error('Error while posting product');
            throw error;

        } finally {
            setProduct({ ...product, loading: true });
        }
    }

    // Return the product data, loading state, and error state
    return [postProductToServer, product];
}

export default usePostProduct;