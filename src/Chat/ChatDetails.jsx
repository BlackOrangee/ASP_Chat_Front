import React, { useEffect, useState, useCallback } from 'react';
import { fetchChatById, fetchMediaLink, FetchAndStoreImage, LoadImageFromLocalStorage } from '../api';
import PropTypes from 'prop-types';

const ChatDetails = ({ chatId, setChatId }) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const [chat, setChat] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [chatDescription, setChatDescription] = useState(null);
    const [chatName, setChatName] = useState(null);
    const [chatImageId, setChatImageId] = useState(null);
    const [chatImage, setChatImage] = useState(null);
    const [chatOrAponentId, setChatOrAponentId] = useState(null);
    const [tag, setTag] = useState(null);
    const [chatType, setChatType] = useState(null);

    ChatDetails.propTypes = {
        chatId: PropTypes.number.isRequired,
        setChatId: PropTypes.func.isRequired,
    };

    useEffect(() => {
        if (!chat) {
            return;
        }

        if (chat.type?.name === 'P2P') {
            const user = chat.users.filter(user => user.id != userId);
            setTag(user[0].username);
            setChatType('P2P');
        } else {
            setTag(chat.tag);
        }
    }, [chat]);

    const fetchChat = async () => {
        if (!chatId || !token) { 
            return;
        }

        try {
            const response = await fetchChatById(chatId, token);
            setChat(response);
        } catch (error) {
            console.error('Error fetching chat details:', error);
        }
    };

    useEffect(() => {
        fetchChat();
        setChatImage(null);
    }, [chatId]);

    const fetchMediaLinkc = useCallback(async (chatImageId) => {
        if (!chatImageId || !token) {
            return;
        }

        try {
            const response = await fetchMediaLink(chatImageId, token);
            setImageUrl(response);
        } catch (error) {
            console.error('Error fetching profile image:', error);
        }
    }, [chatImageId]);

    useEffect(() => {
        if (!chat) {
            return;
        }

        if (chat.type?.name === 'P2P') {
            const user = chat.users.filter(user => user.id != userId);
            setChatDescription(user[0].description || '');
        } else {
            setChatDescription(chat.description);
        }

    }, [chat]);

    useEffect(() => {
        if (!chat) {
            return;
        }

        if (chat.type?.name === 'P2P') {
            const user = chat.users.filter(user => user.id != userId);
            setChatImageId(user[0].image?.id);
            setChatOrAponentId(user[0].id);
        } else {
            setChatImageId(chat.image?.id);
            setChatOrAponentId(chat.id);

        }

    }, [chat]);

    useEffect(() => {
        if (!chat) {
            return;
        }

        if (chat.type?.name === 'P2P') {
            const user = chat.users.filter(user => user.id != userId);
            setChatName(user[0].name);
        } else {
            setChatName(chat.name);
        }
    }, [chat]);

    useEffect(() => {
        if (imageUrl) {
            fetchMediaLinkc(imageUrl);
        }
    }, [imageUrl]);

    useEffect(() => {
        if (!chatImageId || !chatOrAponentId) {
            return;
        }

        const base64Image = LoadImageFromLocalStorage(chatOrAponentId, chatImageId);
        if (!base64Image) {
            console.log('Image not found in local storage');
            return;
        }
        
        if (base64Image.startsWith("data:application/octet-stream")) {
            setChatImage(base64Image.replace("data:application/octet-stream", "data:image/png"));
        }
        else {
            setChatImage(base64Image);
        }

        setChatImage(base64Image);
    }, [chatImageId, chatOrAponentId]);
    
    useEffect(() => {
        if (!chatOrAponentId || !imageUrl || !chatImageId) {
            return;
        }

        if(!chatImage) {
            FetchAndStoreImage(imageUrl, chatOrAponentId, chatImageId);
        }
    }, [imageUrl, chatOrAponentId, chatImageId]);

    const defaultImageUrl = imageUrl || 'https://via.placeholder.com/60';

    return (
        <div className="col-3 chat-details">
            <div className="d-flex align-items-center p-3">
                {(chatImage || defaultImageUrl)  &&  (
                    <img
                        className="rounded-circle"
                        style={{ width: '60px', height: '60px' }}
                        src={ chatImage?.startsWith("data:application/octet-stream") 
                            ? chatImage.replace("data:application/octet-stream", "data:image/png") 
                            : chatImage ||  defaultImageUrl}
                        alt="User"
                    />
                )}
                <h5 className="p-3 border-bottom">{chatName}</h5>
            </div>
            {tag && <p className="p-3 border-bottom">{chatType === 'P2P' ? 'Username: ' : 'Tag: ' + tag}</p>}
            <p className="p-3 border-bottom">{chatDescription}</p>
        </div>
    );
};

export default ChatDetails;
