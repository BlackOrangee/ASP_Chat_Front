import React, { useEffect, useState } from 'react';
import { FetchAndStoreImage, LoadImageFromLocalStorage, fetchMediaLink } from '../api.js';

export default function UserInfo() {
    const name = localStorage.getItem('name');
    const token = localStorage.getItem('token');

    const [imageUrl, setImageUrl] = useState(null);
    const [imageId, setImageId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [image, setImage] = useState(null);
    const [localImageURL, setLocalImageURL] = useState(null);

    useEffect(() => {
        const imageId = localStorage.getItem('imageId');
        if (imageId) {
            setImageId(imageId);
        }
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setUserId(userId);
        }
    }, []);
    
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

    }, [imageId]);

    // useEffect(() => {
    //     if (!imageId || !userId) {
    //         return;
    //     }

    //     const base64Image = LoadImageFromLocalStorage(userId, imageId);
    //     if (!base64Image) {
    //         console.log('Image not found in local storage 1');
    //         return;
    //     }
    //     const img = document.createElement("img");
    //     img.src = base64Image;

    //     setImage(img);
    // }, [imageId, userId]);

    useEffect(() => {
        if (!imageId || !userId) {
            return;
        }

        const base64Image = LoadImageFromLocalStorage(userId, imageId);
        if (!base64Image) {
            console.log('Image not found in local storage');
            return;
        }
        
        if (base64Image.startsWith("data:application/octet-stream")) {
            setLocalImageURL(base64Image.replace("data:application/octet-stream", "data:image/png"));
        }
        else {
            setLocalImageURL(base64Image);
        }

        setLocalImageURL(base64Image);
    }, [imageId, userId]);
    
    useEffect(() => {
        if (!userId || !imageUrl || !imageId) {
            return;
        }

        if(!image) {
            FetchAndStoreImage(imageUrl, userId, imageId);
        }
    }, [imageUrl, userId, imageId]);

    // useEffect(() => {
    //     if (image) {
    //         setLocalImageURL(URL.createObjectURL(image));
    //     }
    // }, [FetchAndStoreImage, image]);

    const defaultImageUrl = imageUrl || 'https://via.placeholder.com/40';

    return (
        <div className="d-flex align-items-center p-3 short-user-info">
            { localImageURL && <img
                style={{ objectFit: 'cover', width: '60px', height: '60px' }}
                className="rounded-circle"
                src={ localImageURL && localImageURL.startsWith("data:application/octet-stream") 
                        ? localImageURL.replace("data:application/octet-stream", "data:image/png") 
                        : localImageURL ||  defaultImageUrl}
                alt="User"
            />}
            <h5 className="ms-3 mb-0">{name || 'User Name'}</h5>
        </div>
    );
}
