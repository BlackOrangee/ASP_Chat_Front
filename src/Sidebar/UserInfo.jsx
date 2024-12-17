import React from 'react'

export default function UserInfo() {
    return (
        <div className="d-flex align-items-center p-3 short-user-info">
            <img className="rounded-circle" width="60" src="https://via.placeholder.com/60" alt="User" />
            <h5 className="ms-3 mb-0">Username</h5>
        </div>
    )
}
