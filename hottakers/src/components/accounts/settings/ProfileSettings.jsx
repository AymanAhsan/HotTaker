import React, {useState, useEffect, useRef} from 'react';
import { useUser } from '../UserContext.jsx';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import ReactCropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useImageUpload, ImageUploadButton, ImagePreview } from '../../../components/utility/media.jsx'

const ProfileSettings = () => {
    const { user, setUser } = useUser();
    const [bioState, setBioState] = useState(false)
    const [bioInput, setBioInput] = useState("");
    const [bioCharCount, setBioCharCount] = useState(0);
    const [statusCharCount, setStatusCharCount] = useState(0);
    const [showCustomPronouns, setShowCustomPronouns] = useState(false);
    const [customPronouns, setCustomPronouns] = useState("");
    const [showChangePfp, setShowChangePfp] = useState(false);
    const [showRemovePfp, setShowRemovePfp] = useState(false);

    const [statusState, setStatusState] = useState(false)
    const [statusInput, setStatusInput] = useState("");
    const maxLength = 140;


    useEffect(() => {
        if (user) {
            setBioInput(user.bio || "");
            setStatusInput(user.status || "");
            setBioCharCount(user.bio ? user.bio.length : 0);
            setStatusCharCount(user.status ? user.status.length : 0);
        }
    } , [user]);

    const enableBioEdit = () => setBioState(true);
    const saveBio = async () => {
        setBioState(false); // Disable editing
        console.log("New Bio:", bioInput); // Save or send the bio (e.g., API call)
        await changeBio(bioInput);
     };

    const enableStatusEdit = () => setStatusState(true);
    const saveStatus = async () => {
        setStatusState(false);
        console.log("New Status:", statusInput);
        await changeStatus(statusInput);
    };

    const changeBio = async () => {
        try {
            const csrfResponse = await axios.get("/api/csrf/", {
                withCredentials: true
            });
            const csrfToken = csrfResponse.data.csrfToken;

            const response = await axios.post('http://localhost:8000/api/change-bio/', {
                bio: bioInput
            }, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                withCredentials: true // Include credentials in the request
            })
            console.log(response.data);
            if (response.data.success) {
                console.log('Bio updated successfully');
                // setBioInput(response.data.bio);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const changeStatus = async () => {
        try {
            const csrfResponse = await axios.get("/api/csrf/", {
                withCredentials: true
            });
            const csrfToken = csrfResponse.data.csrfToken;

            const response = await axios.post('http://localhost:8000/api/change-status/', {
                status: statusInput
            }, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                withCredentials: true // Include credentials in the request
            })
            console.log(response.data);
            if (response.data.success) {
                console.log('Status updated successfully');
                // setStatusInput(response.data.status);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const setPronouns = async (pronouns) => {
        try {
            const csrfResponse = await axios.get("/api/csrf/", {
                withCredentials: true
            });
            const csrfToken = csrfResponse.data.csrfToken;

            const response = await axios.post('http://localhost:8000/api/change-pronouns/', {
                pronouns: pronouns
            }, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            })

            console.log(response.data);
            if (response.data.success) {
                console.log('Pronouns updated successfully');
                const authResponse = await axios.get('/api/auth/check', { withCredentials: true });
                if (authResponse.data.isAuthenticated) {
                    setUser(authResponse.data.user); // Update user context
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleOtherPronouns = () => {
        setShowCustomPronouns(true);
    };

    const saveCustomPronouns = async () => {
        if (customPronouns.trim()) {
            await setPronouns(customPronouns);
            setShowCustomPronouns(false);
            }
        };

    const handleCancelCustom = () => {
        setShowCustomPronouns(false);
        setCustomPronouns("");
    };
    // Complete the model and pfp change
    const {
      selectedFile,
      previewUrl,
      imageError,
      showCropper,
      fileInputRef,
      cropperRef,
      handleFileClick,
      handleFileChange,
      handleCrop,
      setShowCropper,
      resetUpload
    } = useImageUpload({
      minFileSize: 10 * 1024, // 10KB
      maxFileSize: 5 * 1024 * 1024, // 5MB
      minDimensions: { width: 100, height: 100 },
      maxDimensions: { width: 128, height: 128 },
      allowedTypes: ['image/jpeg', 'image/png'],
      cropDimensions: { width: 400, height: 400 }
    });

    // real slow progress i hate college ts pmo
    // Future improvements: Turn the change profile/bio into a modal
    //TODO: Add CSS ts ugly asf bro 🙏😭
    //TODO: Security tab, add 2FA
    //TODO: Create proper error handling
    //TODO: Make the status and bio modals
    return (
        <div>
            <div>Profile Settings</div>
                <div className='profile-pic'>
                    <img
                        src={`http://localhost:8000${user?.pfp}`}
                        alt="profile"
                        className="w-10 h-10 rounded-full"
                    />
                    {/* make the buttons look cooler later */}
                    <button className="ml-2" onClick={() => setShowChangePfp(true)}>Change Avatar</button>
                    <Modal show={showChangePfp} onHide={() => {
                        setShowChangePfp(false);
                        resetUpload();
                    }}>
                        <Modal.Header closeButton>
                            <Modal.Title>Change Profile Picture</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {!showCropper ? (
                            <div>
                                <p>Upload a new profile picture:</p>
                                <input
                                type="file"
                                accept="image/*"
                                className="d-none"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                />
                                <button
                                    className="btn btn-outline-secondary mb-2"
                                    onClick={handleFileClick}
                                    >
                                    Choose File
                                </button>
                                {imageError && <div className="text-danger mt-2">{imageError}</div>}
                                {selectedFile && (
                                    <div className="mt-2">
                                        <span>Selected file: {selectedFile.name}</span>
                                    </div>
                                )}

                                {previewUrl && (
                                <div className="mt-2">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{ width: "100px", height: "100px" }}
                                        className="rounded-full"
                                    />
                                </div>
                            )}
                            </div>

                            ) : (
                            <div>
                                <p>Crop your image:</p>
                                <ReactCropper
                                    ref={cropperRef}
                                    src={previewUrl}
                                    alt="Crop"
                                    style={{ width: "100%", height: "auto" }}
                                />
                                <button className="btn btn-primary mt-2" onClick={handleCrop}>
                                    Crop
                                </button>
                            </div>
                                    )}

                        </Modal.Body>
                    </Modal>
                    <button className="ml-2" onClick={() => console.log("Remove Profile Picture")}>Remove Avatar</button>
                </div>
                <div className="username">
                    <p>Username: {user.username}</p>
                </div>
                <div className="bio">
                    <label>Bio:</label>
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
                    <label>Status:</label>
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
            <div className="pronouns">
                <label>Pronouns:</label>
                <div className="flex items-center">
                    {showCustomPronouns ? (
                        <div className="flex items-center">
                            <input
                                placeholder="Enter your pronouns"
                                value={customPronouns}
                                onChange={(e) => setCustomPronouns(e.target.value)}
                            />
                            <button className="ml-2" onClick={saveCustomPronouns}>Save</button>
                            <button className="ml-2" onClick={handleCancelCustom}>Cancel</button>
                        </div>
                    ) : (
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {user?.pronouns || "Select Pronouns"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setPronouns("He/Him")}>He/Him</Dropdown.Item>
                            <Dropdown.Item onClick={() => setPronouns("She/Her")}>She/Her</Dropdown.Item>
                            <Dropdown.Item onClick={() => setPronouns("They/Them")}>They/Them</Dropdown.Item>
                            <Dropdown.Item onClick={handleOtherPronouns}>Other</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileSettings;