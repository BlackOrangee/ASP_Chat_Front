import { Formik, Field, Form, ErrorMessage } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import styles from './Form.module.scss';
import { message } from 'antd';
import { loginRequest } from '../api';
import PropTypes from 'prop-types';

const initialValues = {
    username: '',
    password: '',
};

const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

const submitHandler = async (values, formikBag, onAuthSuccess) => {
    const loginData = {
        username: values.username,
        password: values.password,
    };

    try {
        const response = await loginRequest(loginData, onAuthSuccess);

        message.success('Login successful!');

        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('name', response.user.name);
        if (response.user.image) {
            localStorage.setItem('imageId', response.user.image.id);
        }
    } catch (error) {
        message.error('An error occurred. Please try again later.');
        console.log(error);
    }

    formikBag.resetForm();
};

const Login = ({ toggleForm, onAuthSuccess }) => {
    Login.propTypes = {
        toggleForm: PropTypes.func,
        onAuthSuccess: PropTypes.func
    };

    return (
        <div className={styles.loginForm}>
            <h2>Login</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={(values, formikBag) => submitHandler(values, formikBag, onAuthSuccess)}
                validationSchema={LoginSchema}
            >
                {() => (
                    <Form>
                        <div className={styles.field}>
                            <Field
                                name="username"
                                type="text"
                                placeholder="Username"
                                className={styles.input}
                            />
                            <ErrorMessage
                                name="username"
                                component="div"
                                className={styles.invalid}
                            />
                        </div>

                        <div className={styles.field}>
                            <Field
                                name="password"
                                type="password"
                                placeholder="Password"
                                className={styles.input}
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className={styles.invalid}
                            />
                        </div>

                        <div className={styles.buttonGroup}>
                            <button type="submit" className={styles.button}>
                                Submit
                            </button>
                        </div>

                        <div className={styles.footer}>
                            <button type="button" onClick={toggleForm} className={styles.linkButton}>
                                Register
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;
