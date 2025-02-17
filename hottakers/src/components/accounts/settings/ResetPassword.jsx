import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from '../../accounts/UserContext';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import '../../../css/ChangePassword.css';

//Properly set up the change password stuff
const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { uid: uidb64, token } = useParams();
    const [isVerifying, setIsVerifying] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);



    const { 
        register,            // Use this instead of registerPassword
        handleSubmit,
        formState: {
            errors, // Use this instead of isPasswordSubmitting
        },
        watch
    } = useForm({
        defaultValues: {
            password1: "",
            password2: ""
        }
    });

    useEffect(() => {
        const verifyToken = async () => {


            try {
                const response = await axios.get(`/api/reset-password/${uidb64}/${token}/`);
                console.log(response.data);
                if (response.data.success) {
                    console.log('Token is valid');
                    setIsVerified(true);
                }
            }
            catch(error){
                console.log(error);
                console.log('Token is invalid');
                setError(error.response?.data?.error || 'Invalid or expired link');
                setIsVerified(false);
            } finally {
                setIsLoading(false);
            }
        };
            verifyToken();
        },[uidb64, token, navigate]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try{
            const responseData= {
                password1: data.password1,
                password2: data.password2,
                uidb64: uidb64,
                token: token,
            }
            const csrfResponse = await axios.get("/api/csrf/", {
                withCredentials: true
            });
            const csrfToken = csrfResponse.data.csrfToken;

            const response = await axios.post('/api/reset-password/reset/' , responseData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true
            });
            if(response.data.success){
                console.log('Password reset successful');
            }
            }
            catch(err){
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
                setIsSubmitted(false);
            } finally {
                setIsSubmitting(false);
        }
        }
        return(
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            {isSubmitted ? (
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Password Changed Successfully!</h2>
                </div>

            ): isSubmitting ? (
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Changing Password...</h2>
                </div>
        ) : (
        isVerified ? (
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
                            name="password1"
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
                            name="password2"
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
                       Change Password
                    </button>
                </form>
            </div>
        ) : (
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="text-red-600 text-center">
                    Verification failed. Please request a new password reset link.
                </div>
            </div>
        )
    )}


        </div>
    )
    }





export default ResetPassword;

