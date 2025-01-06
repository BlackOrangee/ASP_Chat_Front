import { message } from 'antd';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { changePassRequest } from '../../api';
import PropTypes from 'prop-types';

const ChangePassForm = ({ username }) => {
    ChangePassForm.propTypes = {
        username: PropTypes.string
    };

    const token = localStorage.getItem('token');

    const ValidationSchema = Yup.object().shape({
        newPassword: Yup.string().min(8).max(20).required("Password is required!"),
    });

    const initialValues = {
        oldPassword: '',
        newPassword: '',
    };

    const handlePasswordChange = async (values, { resetForm }) => {
        if (password === '') {
            message.error('Old Password is required!');
            return;
        }

        const body = {
            password: password,
            newPassword: values.newPassword
        };

        try {
            await changePassRequest(body, token);
            resetForm();
        } catch (error) {
            console.error("Error sending message:", error);
            message.error('Error sending message: ' + error.message);
        }
    };

    const [password, setPassword] = React.useState('');

    return (
        <div className="combined-form">
            <Formik initialValues={initialValues} >
                {() => (
                    <Form className='password-change-form d-flex flex-column align-items-center justify-content-center'>
                        <input
                            id="username1"
                            type="text"
                            name="username"
                            autoComplete="username"
                            value={username}
                            readOnly
                            hidden
                        />
                        <Field
                            name="oldPassword"
                            type="password"
                            placeholder="Old Password"
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <ErrorMessage
                            name="oldPassword"
                            component="div"
                        />
                    </Form>
                )}
            </Formik>
            <Formik
                initialValues={initialValues}
                onSubmit={handlePasswordChange}
                validationSchema={ValidationSchema}
            >
                {() => (
                    <Form className='password-change-form d-flex flex-column align-items-center justify-content-center'>
                        <input
                            id="username2"
                            type="text"
                            name="username"
                            autoComplete="username"
                            value={username}
                            readOnly
                            hidden />
                        <Field
                            name="newPassword"
                            type="password"
                            placeholder="New Password"
                            autoComplete="new-password"
                        />
                        <ErrorMessage
                            name="newPassword"
                            component="div"
                        />
                        <button type="submit">
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div >
    );
};

export default ChangePassForm;
