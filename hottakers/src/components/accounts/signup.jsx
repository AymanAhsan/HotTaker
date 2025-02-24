import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from './UserContext';
import axios from 'axios';

const Signup = () => {
    const { setIsAuthenticated, setUser, isAuthenticated } = useUser();
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
        watch,
        setValue
    } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password1: '',
            password2: ''
        }
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/feed');
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data) => {

        try {
            const response = await axios.post('/api/signup/', data);
            if (response.data.success) {
                setShowModal(true);
            }
        } catch (err) {
            console.log('Error response:', err.response?.data);
            
            const errorMessages = [];

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
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
                {(error || errors.email || errors.password) && (
                    <div className="error">
                        {error || errors.email?.message || errors.password?.message}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="username" className="text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            {...register("username", { 
                                required: "Username is required",
                                minLength: {
                                    value: 3,
                                    message: "Username must be at least 3 characters"
                                }
                            })}
                            className="border rounded-md p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            className="border rounded-md p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password1" className="text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password1"
                            name="password1"
                            {...register("password1", { 
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                            className="border rounded-md p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password2" className="text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            id="password2"
                            name="password2"
                            {...register("password2", { 
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                            className="border rounded-md p-2"
                        />
                    </div>
                    <button 
                        className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-md w-96">
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up Successful</h2>
                        <p className="text-gray-700 mb-4 text-center">Your account has been created. Please check your email for verification.</p>
                        <Link to="/login" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 block text-center">
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;