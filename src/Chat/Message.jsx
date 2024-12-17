import React from 'react'

export default function Message(message) {

    const userId = localStorage.getItem('userId');
    return (
        // <div className={userId === message.user.id ? "text-end" : "text-start"}>
        //     <p className={userId === message.user.id ? "bg-primary text-white p-2 rounded" : "bg-light p-2 rounded"}>
        //         {message.text}
        //     </p>
        // </div>
        <div className={userId === message.user.id ? "text-end" : "text-start bg-light p-2 rounded mb-2"} style={{ width: 'fit-content' }}>
            <div className="d-flex align-items-center">
                <div className='d-flex flex-column'>
                    <p className='mb-0'>Hello! How are you?</p>
                    <p className='text-muted mb-0' style={{ fontSize: '13px' }}>edited</p>
                </div>
                <div className='d-flex flex-column align-items-end justify-content-between'>
                    <p className='mb-0 pl-2 text-muted' style={{ fontSize: '13px' }}>12:00</p>
                    <BsCheck2 />
                    {/* <BsCheck2All /> */}
                </div>
            </div>
        </div>
    )
}
