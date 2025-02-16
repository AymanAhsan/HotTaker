import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from '../UserContext.jsx';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();

    return (
        <div>
            <div>Profile Settings</div>
            <img
                    src={`http://localhost:8000${user?.pfp}`}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                />
                <div className="username">
                    <p>Username: {user.username}</p>
                </div>
                {user.bio ? (
                    <>
                    <p>{user.bio}</p>
                    <button className="ml-10">Edit</button>
                    </>
                    ):(
                        <input></input>
                    )}
                <div className='status'>
                    <p>{user.status}</p>
                </div>
        </div>
    )
}

export default ProfileSettings;