import { useState } from 'react';
import { axiosApiClient } from '@/lib';
import toast from 'react-hot-toast';

const useLogin = () => {
    const [data, setData] = useState<{result: any, loading: boolean, error: boolean}>({
        result: null,
        loading: false,
        error: false,
    });

    type UserInfoType = {
        email: string;
        password: string;
    };

    /**
     * LOGIN FUNCTION
     * This will login the user
     * @param userInfo 
     */
    const loginFunc = async (userInfo: UserInfoType): Promise<void> => {
        setData({ ...data, loading: true });

        try {
            const response = await axiosApiClient.post('/auth/login', userInfo);
            console.log('RESPONSE FOR LOGIN HERE - ', response);
            toast.success('Login successful');
            setData({ ...data, result: response.data, loading: false, error: false });

        } catch (error) {
            setData({ ...data, loading: false, error: true });
            toast.error('Invalid email or password');
        }
    }

    return [loginFunc, data];
};

export default useLogin;