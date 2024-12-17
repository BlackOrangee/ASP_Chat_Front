import React from 'react'
import { BsCheck2 } from "react-icons/bs";
import { BsCheck2All } from "react-icons/bs";

export default function ChatArea() {
    return (
        <div className="col-6 chat-messages">
            <div className="messages custom-scrollbar">

                <div className="bg-light p-2 rounded mb-2" style={{ width: 'fit-content' }}>
                    <div className="d-flex align-items-center">
                        <div className='d-flex flex-column' style={{ marginRight: '16px' }}>
                            <p className='mb-0'>Hello! How are you?</p>
                            <p className='text-muted mb-0' style={{ fontSize: '13px' }}>edited</p>
                        </div>
                        <div className='d-flex flex-column align-items-end justify-content-between pl-2'>
                            <p className='mb-0 pl-2 text-muted' style={{ fontSize: '13px' }}>12:00</p>
                            <BsCheck2 />
                            {/* <BsCheck2All /> */}
                        </div>
                    </div>
                </div>

                <div className="bg-primary text-white p-2 rounded mb-2" style={{ width: 'fit-content', marginLeft: 'auto' }}>
                    <div className="d-flex align-items-center justify-content-end">
                        <div className="d-flex flex-column" style={{ marginRight: '16px' }}>
                            <p className="mb-0">Hi! I'm doing great, thanks!</p>
                            <p className='text-light mb-0' style={{ fontSize: '13px' }}>edited</p>
                        </div>
                        <div className="d-flex flex-column align-items-end justify-content-between pl-2">
                            <p className="mb-0 text-light" style={{ fontSize: '13px' }}>12:01</p>
                            {/* <BsCheck2 /> */}
                            <BsCheck2All />
                        </div>
                    </div>
                </div>
                
            </div>
            <div className="message-input">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Type a message..." />
                    <button className="btn btn-primary">Send</button>
                </div>
            </div>
        </div>
    )
}
