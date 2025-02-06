import React, { useEffect, useState } from 'react'
import '../Styles/Body.scss'
import Sidebar from '../Sidebar/Sidebar'
import ChatArea from './ChatArea'
import ChatDetails from './ChatDetails'
import Auth from '../Auth/Auth'

export default function Body() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const lastSelectedContact = localStorage.getItem('lastSelectedContact');
    const [chatId, setChatId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthorized(true);
        }
    }, []);

    const handleAuthSuccess = () => {
        setIsAuthorized(true);
    };

    return (
        <>
            {isAuthorized ?
                <div className="container-fluid chat-container">
                    <Sidebar selectedChatId={chatId} setChatId={setChatId}/>
                    <ChatArea chatId={chatId} setChatId={setChatId}/>
                    <ChatDetails chatId={chatId} setChatId={setChatId}/>
                </div>
                :
                <Auth onAuthSuccess={handleAuthSuccess}/>
            }
        </>
    )
}
