import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { useForm } from "react-hook-form";
import axios from 'axios';
import '../../css/login.css';

const Login = () => {
    const { setIsAuthenticated, setUser, isAuthenticated } = useUser();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
        watch,
        setValue
    } = useForm({
        defaultValues: {
        email: "",
        password: ""
        }
    });

  // Check authentication
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/feed');
        }
    }, [isAuthenticated, navigate]);


    const onSubmit = async (data) => {
        try {
            const response = await axios.post('/api/login/', data);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setIsAuthenticated(true);
                setUser(response.data);
                navigate('/feed');
            }
        } catch (err) {
            console.log('Error response:', err.response?.data);
            const errorMessages = []

            if(err.response?.data){
                Object.entries(err.response.data).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        errorMessages.push(...messages);
                    } else if (typeof messages === 'string') {
                        errorMessages.push(messages);
                    }
                });

            }
            setError(errorMessages[0]);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                {error && typeof error === 'string' && (
                    <div className="error">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="email" className=" text-gray-700 mb-1">Email</label>
                        <input
                            type="text"
                            id="email"
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            placeholder="Enter your email"
                            className="input_field"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className=" text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", { 
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                            placeholder="Enter your password"
                            className="input_field"
                        />
                    </div>
                    <button
                        type="submit" 
                        className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
