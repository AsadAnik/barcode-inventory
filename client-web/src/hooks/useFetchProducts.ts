import { useState, useEffect } from 'react';
import { axiosApiClient } from '@/lib';
import toast from 'react-hot-toast';

const useFetchProducts = () => {
    const [data, setData] = useState<{ result: any, loading: boolean, error: boolean }>({
        result: {},
        loading: false,
        error: false,
    });

    // Function to fetch products
    const fetchProducts = async () => {
        try {
            setData({ ...data, loading: true });
            const response = await axiosApiClient.get('/products');
            // console.log('RESPONSE FOR FETCH PRODUCTS HERE - ', response);

            const categorizedProducts = response.data.products.reduce((acc: any, product: any) => {
                const category = (product.category === null || product.category === 'null') ? 'Uncategorized' : product.category;
                acc[category] = acc[category] || [];
                acc[category].push(product);
                return acc;
            }, {}) ?? {};
            // console.log('Categorized Products:', categorizedProducts);

            setData({ ...data, result: categorizedProducts, loading: false, error: false });

        } catch (error) {
            console.error('Error fetching products:', error);
            setData({ ...data, loading: false, error: true });
            toast.error('Error while fetching products');
        }
    };

    // // Fetch products when the component mounts
    useEffect(() => {
        fetchProducts();
    }, []);


    return [data.result, data.loading, data.error, fetchProducts];
};


export default useFetchProducts;