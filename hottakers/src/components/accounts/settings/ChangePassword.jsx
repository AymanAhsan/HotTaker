import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from '../../accounts/UserContext';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import '../../../css/ChangePassword.css';
//Properly setup the change password stuff
const ChangePassword = () => {

    const { 
        register: registerPassword, 
        handleSubmit: handleSubmitPassword, 
        formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
        watch: watchPassword,
        setValue: setPasswordValue,
        reset: resetPassword
    } = useForm({
        defaultValues: {
            password1: "",
            password2: ""
        }
    });

    return(
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Change Password</h2>
                {error && typeof error === 'string' && (
                    <div className="error">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmitPassword(onSubmit)} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="password1" className="text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            id="password1"
                            {...registerPassword("password1", { 
                                required: "New password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
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
                            {...registerPassword("password2", { 
                                required: "Please confirm your password",
                                validate: value => 
                                    value === watchPassword("password1") || "Passwords do not match"
                            })}
                            placeholder="Confirm your new password"
                            className="input_field"
                        />
                    </div>
                    <button
                        type="submit" 
                        className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${isPasswordSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isPasswordSubmitting}
                    >
                        {isPasswordSubmitting ? 'Changing password...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}

