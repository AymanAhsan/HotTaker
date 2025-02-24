import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { useForm } from "react-hook-form";
import axios from 'axios';
import '../../css/login.css';
import Modal from "react-bootstrap/Modal";
import {data} from "autoprefixer";

const Login = () => {
    const { setIsAuthenticated, setUser, isAuthenticated } = useUser();
    const [loginError, setLoginError] = useState(null);
    const [forgetPasswordError, setForgetPasswordError] = useState(null);
    const navigate = useNavigate();
    const [modalType, setModalType] = useState(null);
    const [forgetPasswordSuccess, setForgetPasswordSuccess] = useState(false);
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
        email: "",
        password: ""
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit"
    });

    const {
        register: forgetPassword,
        handleSubmit: handleForgetPasswordSubmit,
        formState: { isSubmitting: isForgetPasswordSubmitting },
    } = useForm(
        {
            defaultValues: {
                email: ""
            }
        }
    );

  // Check authentication
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/feed');
        }
    }, [isAuthenticated, navigate]);

    const handleShow = (type) => {
        console.log('Opening modal for:', type);
        setModalType(type);
    }

    const handleClose = () => {
        setModalType(null);
    }

    const onSubmit = async (data) => {
        console.log("=== Form Submission Started ===");
        setLoginError(null);
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
            setLoginError(errorMessages[0]);
        }
    };


    const handleForgetPassword = async (data) => {
        console.log("=== Form Submission Started ===");
        console.log("Form Data:", data);
        console.log("=== Form Submission Finished ===");
        setForgetPasswordError(null);
        setForgetPasswordSuccess(true);

        try {
            const response = await axios.post('/api/forget-password/', data);
            if (response.data) {
                console.log('Form submission successful');
                setForgetPasswordSuccess(true);
            }
        }catch (err) {
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
            setForgetPasswordError(errorMessages[0]);
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                {(loginError || errors.email || errors.password) && (
                    <div className="error">
                        {loginError || errors.email?.message || errors.password?.message}
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
                    <div>
                        <button className="text-blue-500 hover:underline" onClick={(e) => {
                            e.preventDefault();
                            handleShow("forget-password")
                        }}>Forgot password?</button>
                    </div>
                    <button
                        type="submit" 
                        className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                        onClick={() => console.log('Clicked')}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
            <Modal show={modalType === 'forget-password'} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Forgot your password?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {forgetPasswordSuccess ? (
                        <div className="success bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            Password reset link has been sent to your email
                        </div>
                    ) : (
                        <>
                            {forgetPasswordError && (
                            <div className="error">
                                {forgetPasswordError}
                            </div>
                            )}
                        </>
                        )}

                    <p>Please type in your account email</p>
                    <form onSubmit={handleForgetPasswordSubmit(handleForgetPassword)} className="space-y-4">
                        <input
                            className ="input_field w-full mb-4"
                            type="text"
                            name = "email"
                            placeholder="Email"
                        {...forgetPassword("email", { required: "Email is required" })}/>
                        <button className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200'>
                            {isForgetPasswordSubmitting ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Login;
