import { useState } from 'react';
import { axiosApiClient } from '@/lib';
import toast from 'react-hot-toast';

const useRegister = () => {
    const [data, setData] = useState<{ result: any, loading: boolean, error: boolean }>({
        result: null,
        loading: false,
        error: false,
    });

    type UserInfoType = {
        name?: string;
        email: string;
        password: string;
    };

    /**
     * LOGIN FUNCTION
     * This will login the user
     * @param userInfo 
     */
    const registerFunc = async (userInfo: UserInfoType): Promise<void> => {
        setData({ ...data, loading: true });

        try {
            const response = await axiosApiClient.post('/auth/register', userInfo);
            console.log('RESPONSE FOR LOGIN HERE - ', response);
            toast.success('Registered successful');
            setData({ ...data, result: response.data, loading: false, error: false });

        } catch (error) {
            setData({ ...data, loading: false, error: true });
            toast.error('Invalid email or password');
        }
    }

    return [registerFunc, data];
};

export default useRegister;