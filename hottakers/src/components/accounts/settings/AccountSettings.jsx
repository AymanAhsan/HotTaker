import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from '../../accounts/UserContext';
import Modal from 'react-bootstrap/Modal';
import '../../../css/AccountSettings.css';
import axios from 'axios';


const AccountSettings = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState(null); // State to track which modal is open
    const [error, setError] = useState(null);
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
    const { 
        register: registerUsername, 
        handleSubmit: handleSubmitUsername, 
        formState: { errors: usernameErrors, isSubmitting: isUsernameSubmitting },
        watch: watchUsername,
        setValue: setUsernameValue,
        reset: resetUsername
    } = useForm({
        defaultValues: {
          username: "",
          password: ""
        }
    });
    
    const { 
        register: registerEmail, 
        handleSubmit: handleSubmitEmail, 
        formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
        watch: watchEmail,
        setValue: setEmailValue,
        reset: resetEmail
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const {
    register: registerDelete,
    handleSubmit: handleSubmitDelete,
    formState: { errors: deleteErrors, isSubmitting: isDeleteSubmitting },
    reset: resetDelete
} = useForm({
    defaultValues: {
        password: ""
    }
});


    const handleClose = () => {
        console.log('Modal closing, current type:', modalType);
        setModalType(null);
        setError(null);
        resetUsername();
        resetEmail();
    };
    
    const handleShow = (type) => {
        console.log('Opening modal for:', type);
        setModalType(type);
    };

    const onSubmit = async (data) => {
        console.log("=== Form Submission Started ===");
        console.log("Form Data:", data);
        console.log("Modal Type:", modalType);

        try {
            //CSRF token stuff idk ngl
            console.log("Fetching CSRF token...");
            const csrfResponse = await axios.get("/api/csrf/", {
                withCredentials: true
            });
            console.log("CSRF Response:", csrfResponse);
            const csrfToken = csrfResponse.data.csrfToken;

            let endpoint
            switch(modalType){
                case 'username':
                    endpoint = '/api/change-username/';
                    break;
                case 'email':
                    endpoint = '/api/change-email/';
                    break;
                case 'phone':
                    endpoint = '/api/change-phone/';
                    break;
                case 'delete':
                    endpoint = '/api/delete-account/';
                    break;
                default:
                    console.log('Invalid modal type');
                    return;
            }

            const response = await axios.post(endpoint, data, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'X-CSRFToken': csrfToken,
                },
                withCredentials: true
              });
              
            console.log('API Response:', response);
            if(response.data){
                console.log('Form submission successful');
                setError(null);
                reset();
                handleClose();
            }
        }
        catch (err) {
            console.error('Form submission error:', err);
            console.error('Error response:', err.response?.data);
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

    const handlePasswordChange = async () => {
        setIsPasswordSubmitting(true);
        try{
            const csrfResponse = await axios.get("/api/csrf/", {
                withCredentials: true
            });
            const csrfToken = csrfResponse.data.csrfToken;
            const response = await axios.post('/api/change-password-request/', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true
            });

            if (response.data.success){
                handleShow('password');
            }
        } catch(err) {
            console.error('Password change initiation error:', err);
            setError(err.response?.data?.error || 'Failed to initiate password change');
        } finally{
            setIsPasswordSubmitting(false);
        }
    }


    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }

        setLoading(false);
    }, [isAuthenticated]);

    if (loading || !user) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <div>Account Settings</div>
            <img
                src={`http://localhost:8000${user?.pfp}`}
                alt="profile"
                className="w-10 h-10 rounded-full"
            />
            <div className="username">
                <p>Username: {user.username}</p>
                <button className="edit_button" onClick={() => handleShow('username')}>Edit</button>
            </div>
            <div className="email">
                <p>Email: {user.email}</p>
                <button className="edit_button" onClick={() => handleShow('email')}>Edit</button>
            </div>
            {user.phone ? (
                <>
                    <p>Phone: {user.phone}</p>
                    <button className="ml-10">Edit</button>
                </>
            ) : (
                <p>Phone number not provided</p>
            )}
            <p>Member since: {user.date_joined}</p>

            <div className = "change_password" onClick={handlePasswordChange}>
                <button className={`submit_button ${isPasswordSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>Change Password</button>
            </div>

            <div className="delete-account">
                <button className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                onClick={() => handleShow('delete')}>
                    Delete Account</button>
            </div>

            {/* Username Modal */}
            <Modal show={modalType === 'username'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Username</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter your new username and existing password</p>
                    {error && typeof error === 'string' && (
                        <div className="error">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmitUsername(onSubmit)}>
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="New Username"
                                className="input_field" 
                                {...registerUsername("username", { required: "Username is required" })}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="input_field"
                                {...registerUsername("password", { required: "Password is required" })}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`submit_button ${isUsernameSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isUsernameSubmitting}
                        >
                            Save Changes
                        </button>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Email Modal */}
            <Modal show={modalType === 'email'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter new Email and password</p>
                    {error && typeof error === 'string' && (
                        <div className="error">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmitEmail(onSubmit)}>
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="New Email"
                                className="input_field" 
                                {...registerEmail("email", { required: "Email is required" })}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="input_field" 
                                {...registerEmail("password", { required: "Password is required" })}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`submit_button ${isEmailSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isEmailSubmitting}
                        >
                            Save Changes
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
            
            {/* Password Modal */}
            <Modal show={modalType === 'password'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>A verification message has been sent to you</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Please check your email to change your password
                </Modal.Body>
            </Modal>

            {/* Delete Account Modal */}
            <Modal show={modalType === 'delete'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Enter your password to confirm account deletion
                    {error && typeof error === 'string' && (
                        <div className="error">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmitDelete(onSubmit)}>
                        <div className="mb-3">
                            <input
                                type="password"
                                className={`form-control ${deleteErrors.password ? 'is-invalid' : ''}`}
                                {...registerDelete('password', {
                                    required: 'Password is required'
                                })}
                            />
                            {deleteErrors.password && (
                                <div className="invalid-feedback">
                                    {deleteErrors.password.message}
                                </div>
                            )}
                        </div>
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-danger"
                                disabled={isDeleteSubmitting}
                            >
                                {isDeleteSubmitting ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
    }

export default AccountSettings;