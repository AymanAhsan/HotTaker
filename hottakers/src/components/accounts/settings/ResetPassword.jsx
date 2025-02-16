import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from '../../accounts/UserContext';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import '../../../css/ChangePassword.css';

//Properly set up the change password stuff
const ResetPassword = () => {
    const [isValidToken, setIsValidToken] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { uidb64, token } = useParams();


    const { 
        register,            // Use this instead of registerPassword
        handleSubmit,
        formState: {
            errors,
            isSubmitting    // Use this instead of isPasswordSubmitting
        },
        watch
    } = useForm();

    useEffect(() => {
        const verifyToken = async () => {
        try {
            const response = await axios.get(`/api/reset-password/${uidb64}/${token}/`);
            console.log(response.data);
            if (response.data.success) {
                console.log('Token is valid');
                setIsValidToken(true);
                navigate('/reset-password/reset/');
            }
        }
        catch(error){
            console.log(error);
            console.log('Token is invalid');
            setError(error.response?.data?.error || 'Invalid or expired link');
                navigate('/verification-failed');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);

        } finally {
            setIsLoading(false);
        }
    };
        if(uidb64 && token){
            verifyToken();
        }
    },[uidb64, token, navigate]);

    const onSubmit = async (data) => {
        try{
            const response = await axios.get('/api/reset-password/reset/', {
                uidb64,
                token,
                password1: data.password1,
                password2: data.password2
            });
            navigate('/login');
            }
            catch(error){
                setError(
                    error.response?.data?.error ||
                    error.response?.data?.password1?.[0] ||
                    error.response?.data?.password2?.[0] ||
                    'An error occurred while resetting password'
            );

            }
        }
        return(
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Change Password</h2>
                {error && typeof error === 'string' && (
                    <div className="error">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="password1" className="text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            id="password1"
                            {...register("password1", {
                            required: "Please confirm your password",
                        })}
                            placeholder="Enter your new password"
                            className="input_field"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password2" className="text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            id="password2"
                            {...register("password2", {
                                required: "Please confirm your password",
                            })}
                            placeholder="Confirm your new password"
                            className="input_field"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Changing password...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    )
    }





export default ResetPassword;

