import React from 'react'

export default function ChatDetails() {
    return (
        <div className="col-3 chat-details">
            <div className='d-flex align-items-center p-3'>
                <img className="rounded-circle" width="60" src="https://via.placeholder.com/60" alt="User" />
                <h5 className="p-3 border-bottom">Chat Details</h5>
            </div>
            <p className="p-3">Details about the selected chat or user can appear here.</p>
        </div>
    )
}
