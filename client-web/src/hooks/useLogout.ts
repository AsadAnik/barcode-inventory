import { useState } from 'react';

const useLogout = () => {
    const [accessToken, setAccessToken] = useState<string | null>(
        localStorage.getItem('accessToken')
    );

    /**
     * LOGOUT FUNCTION
     * This will logout the user
     */
    const logout = () => {
        setAccessToken(null);
        // localStorage.removeItem('accessToken');
        document.cookie = 'accessToken=; Path=/; Max-Age=0;';
        document.cookie = 'refreshToken=; Path=/; Max-Age=0;';
    };

    return { logout };
};

export default useLogout;