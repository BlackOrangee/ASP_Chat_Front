import React from 'react'
import UserInfo from './UserInfo'
import ContactInfo from './ContactInfo'

export default function Sidebar() {
    return (
        <div className="col-3 chat-sidebar custom-scrollbar">
            <div className="sidebar-header" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                <UserInfo />
                <input type="text" className="form-control" placeholder="Search..." />
            </div>
            <ul className="list-group list-group-flush">
                <ContactInfo />
                <ContactInfo />
                <ContactInfo />
                <ContactInfo />
                <ContactInfo />
                <ContactInfo />
                <ContactInfo />
                <ContactInfo />
                <ContactInfo />
                <ContactInfo />
                <ContactInfo />
                <ContactInfo />
                <ContactInfo />
                <ContactInfo />
            </ul>
        </div>
    )
}
