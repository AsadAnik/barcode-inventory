import { useState } from 'react';
import { axiosApiClient } from '@/lib';
import toast from 'react-hot-toast';


const useLogin = () => {
    const [data, setData] = useState<{ result: any, loading: boolean, error: boolean }>({
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
            
            if (response.status === 200) {
                const { data } = response.data;
                setData({ ...data, result: data.user, loading: false, error: false });
                toast.success('Login successful');
            }

        } catch (error) {
            setData({ ...data, loading: false, error: true });
            toast.error('Invalid email or password');
        }
    }

    return [loginFunc, data];
};

export default useLogin;