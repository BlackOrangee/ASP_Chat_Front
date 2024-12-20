import { Formik, Field, Form, ErrorMessage } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import styles from './Form.module.scss';
import { message } from 'antd';

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
        const response = await fetch('/Auth/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });
        const data = await response.json();

        console.log(data);
        if (data.Success) {
            message.success('Login successful!');
            localStorage.setItem('token', data.Data.token);
            localStorage.setItem('userId', data.Data.user.id);
            localStorage.setItem('name', data.Data.user.name);
            if (data.Data.user.image) {
                localStorage.setItem('imageId', data.Data.user.image.id);
            }
            onAuthSuccess();
        } else if (data.Errors && Array.isArray(data.Errors)) {
            const errorMessages = data.Errors.join(', ');
            message.error(errorMessages);
        } else {
            message.error('An unexpected error occurred.');

        }
    } catch (error) {
        message.error('An error occurred. Please try again later.');
        console.log(error);
    }

    formikBag.resetForm();
};

const Login = ({ toggleForm, onAuthSuccess }) => {
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
