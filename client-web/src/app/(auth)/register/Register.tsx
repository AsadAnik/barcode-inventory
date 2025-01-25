'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks';
import toast from 'react-hot-toast';

const Register = () => {
    const router = useRouter();
    const [registerFunc, data]: any = useRegister();
    const [registerInfo, setRegisterInfo] = useState({
        name: '',
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
        setRegisterInfo({ ...registerInfo, [name]: value });
    };

    /**
     * HANDLE LOGIN SUBMIT
     * The login submit here
     * @returns 
     */
    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (registerInfo.name === '' || registerInfo.email === '' || registerInfo.password === '') {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            await registerFunc(registerFunc);
            if (data.result) {
                router.push('/login');
            }

        } catch (error) {
            console.error('Login error - ', error);
            toast.error('Login Server Timeout!');
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

                <form className="space-y-4" onSubmit={handleRegister}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={registerInfo.name}
                            onChange={handleChangeText}
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={registerInfo.email}
                            onChange={handleChangeText}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
                            value={registerInfo.password}
                            onChange={handleChangeText}
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                    >
                        Register
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <a className="text-blue-500 hover:underline cursor-pointer" onClick={() => router.push('/login')}>
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;