import React from 'react'
import '../Styles/Body.scss'
import Sidebar from '../Sidebar/Sidebar'
import ChatArea from './ChatArea'
import ChatDetails from './ChatDetails'

export default function Body() {
    return (
        <div className="container-fluid chat-container">
            <Sidebar />
            <ChatArea />
            <ChatDetails />
        </div>
    )
}
