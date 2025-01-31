import React, { useCallback, useEffect, useState } from 'react';
import { fetchProfile, FetchAndStoreImage, LoadImageFromLocalStorage, fetchMediaLink } from '../../api.js';
import UserModal from './UserModal.jsx';

export default function UserInfo() {
    const token = localStorage.getItem('token');

    const [name, setName] = useState(null);
    const [username, setUsername] = useState(null);
    const [imageId, setImageId] = useState();
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [userId, setUserId] = useState(null);
    // const [localImageURL, setLocalImageURL] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const LoadVariablesFromLocalStorage = useCallback(() => {
        setName(localStorage.getItem('name'));
        setUsername(localStorage.getItem('username'));
        setImageId(parseInt(localStorage.getItem('imageId')));
        setUserId(parseInt(localStorage.getItem('userId')));
        console.log('name, username, imageId, userId:', name, username, imageId, userId);
    }, [name, username, imageId, userId]);

    useEffect(() => {
        LoadVariablesFromLocalStorage();
    }, [LoadVariablesFromLocalStorage]);

    const FetchUserById = useCallback(async (userId, token) => {
        if (!userId || !token) {
            return;
        }

        fetchProfile(userId, token)
            .then((response) => {
                console.log('response:', response);
                console.log('name, username, imageId, userId:', name, username, imageId, userId);
                if (name === 'undefined' || response.name !== name) {
                    localStorage.setItem('name', response.name);
                    setName(response.name);
                }
                if (username === 'undefined' || response.username !== username) {
                    localStorage.setItem('username', response.username);
                    setUsername(response.username);
                }
                if (description === 'undefined' || response.description !== description) {
                    localStorage.setItem('description', response.description);
                    setDescription(response.description);
                }
                if (imageId === 'undefined' || response.image?.id !== imageId) {
                    localStorage.setItem('imageId', response.image.id);
                    setImageId(response.image.id);
                }
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
            });
    }, [name, username, description, imageId]);

    useEffect(() => {
        FetchUserById(userId, token);
        console.log('username and name:', username, name, description);
    }, [userId, FetchUserById, token, username, name, description]);

    useEffect(() => {

        if (!imageUrl) {
            fetchMediaLink(imageId, token)
                .then((response) => {
                    setImageUrl(response);
                })
                .catch((error) => {
                    console.error('Error fetching profile image:', error);
                });
            console.log(imageUrl);
        }

    }, [imageId, token, imageUrl]);

    // useEffect(() => {
    //     if (!imageId || !userId) {
    //         return;
    //     }

    //     const base64Image = LoadImageFromLocalStorage(userId, imageId);
    //     if (!base64Image) {
    //         console.log('Image not found in local storage');
    //         return;
    //     }

    //     if (base64Image.startsWith("data:application/octet-stream")) {
    //         setLocalImageURL(base64Image.replace("data:application/octet-stream", "data:image/png"));
    //     }
    //     else {
    //         setLocalImageURL(base64Image);
    //     }

    //     setLocalImageURL(base64Image);
    // }, [imageId, userId]);

    // useEffect(() => {
    //     if (!userId || !imageUrl || !imageId) {
    //         return;
    //     }

    //     if (!localImageURL) {
    //         FetchAndStoreImage(imageUrl, userId, imageId);
    //     }
    // }, [imageUrl, userId, imageId, localImageURL]);

    const defaultImageUrl = imageUrl || 'https://placehold.co/60x60';

    return (
        <>

            <button
                className="btn d-flex align-items-center p-3 short-user-info"
                onClick={() => setIsModalOpen(true)}
            >
                {/* {localImageURL &&  */}
                <img
                    style={{ objectFit: 'cover', width: '60px', height: '60px' }}
                    className="rounded-circle"
                    src={defaultImageUrl}
                    alt="User"
                />
                {/* } */}
                <h5 className="ms-3 mb-0">{name || 'User Name'}</h5>
            </button>

            <UserModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                imageUrl={defaultImageUrl}
                userData={{
                    name,
                    username,
                    description,
                    imageId
                }}
                setUserDataHandlers={{
                    setName,
                    setUsername,
                    setDescription,
                    setImageId
                }}
            />
        </>
    );
}
