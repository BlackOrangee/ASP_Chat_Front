import React from 'react'
import './Body.css'

export default function Body() {
    return (
        <div className="container-fluid chat-container">
            <div className="col-3 chat-sidebar">
                <h5 className="p-3 border-bottom">Contacts</h5>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Contact 1</li>
                    <li className="list-group-item">Contact 2</li>
                    <li className="list-group-item">Contact 3</li>
                    <li className="list-group-item">Contact 4</li>
                </ul>
            </div>

            <div className="col-6 chat-messages">
                <div className="messages">
                    <div className="text-start">
                        <p className="bg-light p-2 rounded">Hello! How are you?</p>
                    </div>
                    <div className="text-end">
                        <p className="bg-primary text-white p-2 rounded">I'm good, thank you!</p>
                    </div>
                    <div className="text-start">
                        <p className="bg-light p-2 rounded">Great to hear that!</p>
                    </div>
                </div>
                <div className="message-input">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Type a message..." />
                        <button className="btn btn-primary">Send</button>
                    </div>
                </div>
            </div>

            <div className="col-3 chat-details">
                <h5 className="p-3 border-bottom">Chat Details</h5>
                <p className="p-3">Details about the selected chat or user can appear here.</p>
            </div>
        </div>
    )
}
