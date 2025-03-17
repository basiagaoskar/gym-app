import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

const UserProfilePage = () => {
    const { Profile, findUser } = useAuthStore();
    const { username } = useParams();

    useEffect(() => {
        if (!Profile && username) {
            findUser(username);
        }
    }, [username, Profile]);
    return (
        <div>
            <h1>url data: {username}</h1>
            {Profile && <div>db username: {Profile.username}</div>} 
            {Profile && <div>db email: {Profile.email}</div>} 
            {Profile && <div>db bio: {Profile.bio}</div>} 
        </div>
    );
}

export default UserProfilePage