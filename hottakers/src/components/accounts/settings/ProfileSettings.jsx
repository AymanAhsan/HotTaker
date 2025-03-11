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
    const [bioCharCount, setBioCharCount] = useState(0);
    const [statusCharCount, setStatusCharCount] = useState(0);

    const [statusState, setStatusState] = useState(false)
    const [statusInput, setStatusInput] = useState("");
    const maxLength = 140;

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


    // TODO: add status and bio to the db
    // TODO: display them on the profile page
    // real slow progress i hate college
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
                    <div className="flex items-center">
                    <input
                        placeholder="Enter your bio"
                        value={bioInput}
                        disabled={!bioState} // Field is only enabled in edit mode
                        maxLength={maxLength}
                        onChange={
                            (e) => {
                                const value = e.target.value;
                                if (value.length <= maxLength) {
                                    setBioInput(value);
                                    setBioCharCount(value.length);
                                }

                            }

                        } // Update input value
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
                    <p className="text-sm text-gray-500 mt-1">{maxLength - bioCharCount}</p>
                </div>
                <div className='status'>
                    <div className="flex items-center">
                     <input
                        placeholder="Enter your Status"
                        value={statusInput}
                        disabled={!statusState} // Field is only enabled in edit mode
                        onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= maxLength) {
                                    setStatusInput(value);
                                    setStatusCharCount(value.length);
                                }

                            }}
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
                    <p className="text-sm text-gray-500 mt-1">{maxLength - statusCharCount}</p>
                </div>
        </div>
    )
}

export default ProfileSettings;