import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from '../UserContext.jsx';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();
    const [bioState, setBioState] = useState(false)
    const [bioInput, setBioInput] = useState("");

    const [statusState, setStatusState] = useState(false)
    const [statusInput, setStatusInput] = useState("");

    const enableBioEdit = () => setBioState(true);
    const saveBio = () => {
        setBioState(false); // Disable editing
        console.log("New Bio:", bioInput); // Save or send the bio (e.g., API call)
     };

    const enableStatusEdit = () => setStatusState(true);
    const saveStatus = () => {
        setStatusState(false);
        console.log("New Status:", statusInput);
    }


    // Have a seperate state after pressing edit

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
                <div className="bio">
                    <input
                        placeholder="Enter your bio"
                        value={bioInput}
                        disabled={!bioState} // Field is only enabled in edit mode
                        onChange={(e) => setBioInput(e.target.value)} // Update input value
                      />
                      {bioState ? (
                        <button className="ml-10" onClick={saveBio}>
                          Save
                        </button>
                      ) : (
                        <button className="ml-10" onClick={enableBioEdit}>
                          Edit
                        </button>
                      )}

                </div>
                <div className='status'>
                     <input
                        placeholder="Enter your Status"
                        value={statusInput}
                        disabled={!statusState} // Field is only enabled in edit mode
                        onChange={(e) => setStatusInput(e.target.value)} // Update input value
                      />
                    {statusState ? (
                        <button className="ml-10" onClick={saveStatus}>
                          Save
                        </button>
                      ) : (
                        <button className="ml-10" onClick={enableStatusEdit}>
                          Edit
                        </button>
                      )}
                </div>
        </div>
    )
}

export default ProfileSettings;