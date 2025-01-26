import { useState, useEffect } from "react";
import { axiosApiClient } from "@/lib";

const useFetchProducts = () => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axiosApiClient.get('/categories/kanban');
            // console.log('RESPONSE - ', response.data);
            setData(response.data.kanbanList);

        } catch (error) {
            setError("Error fetching products");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return [data, loading, error, fetchProducts];
}


export default useFetchProducts;    