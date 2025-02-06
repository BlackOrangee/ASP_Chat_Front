import React, { useEffect, useState } from 'react';
import UserInfo from './UserInfo/UserInfo.jsx';
import ContactInfo from './ContactInfo';
import { fetchUserChats, searchUsersByUsername } from '../api.js';
import PropTypes from 'prop-types';
import { useChatHub } from '../HubContext';
import SearchResult from './SearchResult.jsx';
import { RxCross1 } from "react-icons/rx";

export default function Sidebar({ selectedChatId, setChatId }) {
    Sidebar.propTypes = {
        selectedChatId: PropTypes.number,
        setChatId: PropTypes.func
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const [contacts, setContacts] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState({});
    const chatHub = useChatHub();
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!chatHub) {
            return;
        }
        console.log("Selected chat ID: ", selectedChatId);
        // chatHub.connection.off("ReceiveMessage");
        // chatHub.connection.off("ReadedMessage");

        chatHub.onReceiveMessage((message, chatId) => {
            if (message.user.id !== parseInt(userId)) {
                console.log("Adding unread message: ", message, chatId.chatId);
                addUnreadMessage(chatId.chatId, message.id);
            }
        });
        chatHub.onError((error) => console.error(error));

        chatHub.onReadedMessage((readedMessage, chatId) => {
            console.log("Removing unread message: ", readedMessage, chatId.chatId);
            removeUnreadMessage(chatId.chatId, readedMessage.id);
        });

        chatHub.onNewChat((chat) => {
            console.log("New chat: ", chat);
            setContacts((prevContacts) => [...prevContacts, chat]);
            // addUnreadMessage(chat.id, null);
        });

    }, [chatHub, selectedChatId]);

    const updateUnreadMessages = (chatId, messageIds) => {
        setUnreadMessages(prevState => ({
            ...prevState,
            [chatId]: messageIds
        }));
    };

    const addUnreadMessage = (chatId, messageId) => {
        setUnreadMessages(prevState => ({
            ...prevState,
            [chatId]: [...(prevState[chatId] || []), messageId]
        }));
    };

    const removeUnreadMessage = (chatId, messageId) => {
        setUnreadMessages(prevState => {
            if (!prevState[chatId]) return prevState;

            const newMessageList = prevState[chatId].filter(id => id !== messageId);

            if (newMessageList.length === 0) {
                const newState = { ...prevState };
                delete newState[chatId];
                return newState;
            }

            return {
                ...prevState,
                [chatId]: newMessageList
            };
        });
    };

    const resetUnreadMessages = (chatId) => {
        setUnreadMessages(prevState => {
            const newState = { ...prevState };
            delete newState[chatId];
            return newState;
        });
    };

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const fetchedChats = await fetchUserChats(token);
                if (Array.isArray(fetchedChats)) {
                    setContacts(fetchedChats);
                } else {
                    console.error('Expected an array of contacts, but got:', fetchedChats);
                }
            } catch (error) {
                console.error('Error fetching user chats:', error);
            }
        };
        fetchChats();
    }, [token]);

    useEffect(() => {
        if (search === '') {
            return;
        }

        const fetchSearchResults = async () => {
            try {
                const fetchedChats = await searchUsersByUsername(search, token);
                if (Array.isArray(fetchedChats)) {
                    setSearchResults(fetchedChats);
                } else {
                    console.error('Expected an array of contacts, but got:', fetchedChats);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        fetchSearchResults();
    }, [search]);

    useEffect(() => {
        if (search === '') {
            setSearchResults([]);
        }

    }, [search]);

    const handleClearSearch = () => setSearch('');

    const contactList = contacts.length === 0 ? (
        <p>Loading contacts...</p>
    ) : (
        contacts.map((contact) => (
            <ContactInfo
                key={contact.id}
                contact={contact}
                setChatId={setChatId}
                unreadMessagesCount={unreadMessages[contact.id] ? unreadMessages[contact.id].length : 0}
            />
        ))
    );

    const searchResultsList = searchResults.length === 0 ? (
        <p>Loading search results...</p>
    ) : (
        searchResults.map((result) => (
            <SearchResult
                key={result.id}
                user={result}
                setChatId={setChatId}
                setSearch={setSearch}
            />
        ))
    );

    return (
        <div className="col-3 chat-sidebar custom-scrollbar">
            <div className="sidebar-header" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                <UserInfo />
                <div style={{display: 'flex'}}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search !== '' && <button
                        style={{
                            // float: "right",
                            // clear: "both",
                            cursor: "pointer",
                            color: "red",
                            backgroundColor: "transparent",
                            border: "none",
                            borderRadius: "5px",
                            marginLeft: "4px",
                            // marginRight: "4px"
                            position: "relative",
                            right: "4px",
                            // top: "10px"
                        }}
                        onClick={handleClearSearch}>
                        <RxCross1 />
                    </button>}
                </div>
            </div>
            <ul className="list-group list-group-flush">
                {search === '' ? contactList : searchResultsList}
            </ul>
        </div>
    );
}
