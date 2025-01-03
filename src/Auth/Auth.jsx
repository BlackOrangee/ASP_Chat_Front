import React, { useState, forwardRef } from 'react';
import { Modal } from 'antd';
import Registration from './Registration';
import Login from './Login';
import PropTypes from 'prop-types';

const Auth = forwardRef(({ onAuthSuccess }, ref) => {
    Auth.propTypes = {
        onAuthSuccess: PropTypes.func
    };

    const [isLoginForm, setIsLoginForm] = useState(true);

    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
    };

    return (
        <Modal
            open={true}
            footer={null}
            ref={ref}
        >
            {isLoginForm ? <Login toggleForm={toggleForm} onAuthSuccess={onAuthSuccess} /> : <Registration toggleForm={toggleForm} />}
        </Modal>
    );
});

export default Auth;
