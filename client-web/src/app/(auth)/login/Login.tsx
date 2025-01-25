'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks';
import toast from 'react-hot-toast';

const Login = () => {
    const router = useRouter();
    const [loginFunc, data]: any = useLogin();
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });

    /**
     * HANDLE CHANGE INPUT TEXT
     * The input bar text change handle
     * @param event 
     */
    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    };

    /**
     * HANDLE LOGIN SUBMIT
     * The login submit here
     * @returns 
     */
    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (loginInfo.email === '' || loginInfo.password === '') {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            await loginFunc(loginInfo);
            if (data.result) {
                // toast.success('Login successful');
                router.push('/');
            }

        } catch (error) {
            console.error('Login error - ', error);
            toast.error('Login Server Timeout!');
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={loginInfo.email}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            onChange={handleChangeText}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={loginInfo.password}
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            onChange={handleChangeText}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                        disabled={data.loading}
                    >
                        {data.loading ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a className="text-blue-500 hover:underline cursor-pointer" onClick={() => router.push('/register')}>
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;