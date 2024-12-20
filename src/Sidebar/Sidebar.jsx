import React, { useEffect, useState } from 'react';
import UserInfo from './UserInfo';
import ContactInfo from './ContactInfo';
import { fetchUserChats } from '../api.js';

export default function Sidebar({setChatId}) {
    const token = localStorage.getItem('token');
    const [contacts, setContacts] = useState([]);

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

    return (
        <div className="col-3 chat-sidebar custom-scrollbar">
            <div className="sidebar-header" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                <UserInfo />
                <input type="text" className="form-control" placeholder="Search..." />
            </div>
            <ul className="list-group list-group-flush">
                {contacts.length === 0 ? (
                    <p>Loading contacts...</p>
                ) : (
                    contacts.map((contact) => (
                        <ContactInfo key={contact.id} contact={contact} setChatId={setChatId} />
                    ))
                )}
            </ul>
        </div>
    );
}
