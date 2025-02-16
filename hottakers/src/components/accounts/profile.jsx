import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from './UserContext';
import axios from 'axios';

const Profile = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [profileState, setProfileState] = useState({
        userExists: false,
        userInfo: null,
        hasPosts: false,
        posts: [],
        error: null
    });
    const { username } = useParams();
    const isOwnProfile = user?.username === username;
    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/api/${username}/`);
                setProfileState({
                    userExists: true,
                    userInfo: response.data.account,
                    hasPosts: response.data.posts.length > 0,
                    posts: response.data.posts,
                    error: null
                });
            } catch (err) {
                setProfileState({
                    userExists: false,
                    userInfo: null,
                    hasPosts: false,
                    posts: [],
                    error: err.response?.status === 404 
                    ? 'User not found' 
                    : 'An error occurred while fetching user data'
                });
        } finally {
            setLoading(false);
        }
    };

        fetchPosts();
    }, [username]);
   

   if (loading) {
        return <div>Loading...</div>;
    }
    if (!profileState.userExists) {
        return <div>User not found</div>;
    }

    return (
        <div className="profile-container">
            <div>
                <h1>{profileState.userInfo.username}</h1>
                <p>{profileState.userInfo.status}</p>
                <p>{profileState.userInfo.bio}</p>
                {isOwnProfile && (
                    <div id="authenticated">
                        <p>{profileState.userInfo.email}</p>
                        <Link to="/edit">Edit Profile</Link>
                    </div>
                )}
                
                {!profileState.hasPosts ? (
                    <p>No posts yet</p>
                ) : (
                    <div className="feed-container">
                        {profileState.posts.map((post) => (
                            <div key={post.id} className="post-card">
                                <h1>{post.title}</h1>
                                <p>By: {post.author}</p>
                                <p>{post.description}</p>
                                {post?.image && (
                                    <img 
                                        src={`http://localhost:8000${post.image}`} 
                                        alt={post.title} 
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;