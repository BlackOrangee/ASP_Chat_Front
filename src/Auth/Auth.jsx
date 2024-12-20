import React, { useState, forwardRef, useEffect } from 'react';
import { Modal } from 'antd';
import Registration from './Registration';
import Login from './Login';

const Auth = forwardRef(({ onAuthSuccess, _ref }) => {
    const [isLoginForm, setIsLoginForm] = useState(true);


    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
    };

    return (
        <Modal
            open={true}
            footer={null}
        >
            {isLoginForm ? <Login toggleForm={toggleForm} onAuthSuccess={onAuthSuccess} /> : <Registration toggleForm={toggleForm} />}
        </Modal>
    );
});

export default Auth;
