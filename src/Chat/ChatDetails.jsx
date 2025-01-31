import React, { useEffect, useState, useCallback } from 'react';
import { fetchChatById, fetchMediaLink, FetchAndStoreImage, LoadImageFromLocalStorage } from '../api';
import PropTypes from 'prop-types';

const ChatDetails = ({ chatId, setChatId }) => {
    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('userId'));
    const [chat, setChat] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [chatImageId, setChatImageId] = useState(null);
    // const [chatImage, setChatImage] = useState(null);
    const [chatOrAponentId, setChatOrAponentId] = useState(null);
    const [chatObject, setChatObject] = useState(
        {
            name: null,
            description: null,
            image: null,
            type: null,
            tag: null,
            username: null
        });

    ChatDetails.propTypes = {
        chatId: PropTypes.number.isRequired,
        setChatId: PropTypes.func.isRequired,
    };

    useEffect(() => {
        if (!chat) {
            return;
        }
        let imageId = null;

        if (chat.type?.name === 'P2P') {
            const user = chat.users.filter(user => user.id !== userId);
            const usernameTemp = user[0].username;
            setChatObject({
                name: user[0].name,
                description: user[0].description || '',
                type: 'P2P',
                tag: null,
                username: usernameTemp
            });
            setChatOrAponentId(user[0].id);
            imageId = user[0].image?.id;
        } else if (chat.type?.name === 'Group') {
            setChatObject({
                name: chat.name,
                description: chat.description,
                type: 'Group',
                tag: null,
                username: null
            });
            imageId = chat.image?.id;
            setChatOrAponentId(chat.id);
        }
        else {
            setChatObject({
                name: chat.name,
                description: chat.description,
                type: 'Channel',
                users: [chatOrAponentId],
                tag: chat.tag,
                username: null
            });
            imageId = chat.image?.id;
            setChatOrAponentId(chat.id);
        }
        setChatImageId(imageId);

    }, [chat, userId, chatOrAponentId]);

    const fetchChat = useCallback(async (chatIdParam, tokenParam) => {
        if (!chatIdParam || !tokenParam) {
            return;
        }

        try {
            const response = await fetchChatById(chatIdParam, tokenParam);
            setChat(response);
        } catch (error) {
            console.error('Error fetching chat details:', error);
        }
    }, []);

    useEffect(() => {
        fetchChat(chatId, token);
        setImageUrl(null);
    }, [chatId, fetchChat, token]);

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
    }, [token, chatImageId]);


    useEffect(() => {
        if (chatImageId) {
            fetchMediaLinkc(chatImageId);
        }
    }, [chatImageId, fetchMediaLinkc]);

    // useEffect(() => {
    //     if (!chatImageId || !chatOrAponentId) {
    //         setChatImage(null);
    //         return;
    //     }

    //     const base64Image = LoadImageFromLocalStorage(chatOrAponentId, chatImageId);
    //     if (!base64Image) {
    //         console.log('Image not found in local storage');
    //         return;
    //     }

    //     if (base64Image.startsWith("data:application/octet-stream")) {
    //         setChatImage(base64Image.replace("data:application/octet-stream", "data:image/png"));
    //     }
    //     else {
    //         setChatImage(base64Image);
    //     }

    //     setChatImage(base64Image);
    // }, [chatImageId, chatOrAponentId, chatImage]);

    // useEffect(() => {
    //     if (!chatOrAponentId || !imageUrl || !chatImageId) {
    //         return;
    //     }

    //     if (!chatImage) {
    //         FetchAndStoreImage(imageUrl, chatOrAponentId, chatImageId);
    //     }
    // }, [imageUrl, chatOrAponentId, chatImageId, chatImage]);

    const defaultImageUrl = imageUrl || 'https://placehold.co/60x60';

    return (
        <div className="col-3 chat-details">
            <div className="d-flex align-items-center p-3">
                {/* {(chatImage || defaultImageUrl) && ( */}
                    <img
                        className="rounded-circle"
                        style={{ width: '60px', height: '60px' }}
                        src={defaultImageUrl}
                        alt="User"
                    />
                {/* )} */}
                <h5 className="p-3 border-bottom">{chatObject.name}</h5>
            </div>
            {chatObject.chatType && <p className="p-3 border-bottom">{chatObject.chatType}</p>}
            {chatObject.tag && <p className="p-3 border-bottom">{'@' + chatObject.tag}</p>}
            {chatObject.username && <p className="p-3 border-bottom">{'@' + chatObject.username}</p>}
            <p className="p-3 border-bottom">{chatObject.description}</p>
        </div>
    );
};

export default ChatDetails;
