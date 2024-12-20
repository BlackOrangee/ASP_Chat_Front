import { Formik, Field, Form, ErrorMessage } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import styles from './Form.module.scss';
import { message } from 'antd';

const initialValues = {
    name: '',
    username: '',
    password: '',
};

const submitHandler = async (values, formikBag) => {
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        const data = await response.json();

        if (data.Success) {
            console.log('Registration successful:', data.Message);
            message.success(data.Message);
            formikBag.resetForm();
        } else if (data.Errors && Array.isArray(data.Errors)) {
            const errorMessages = data.Errors.join(', ');
            message.error(`Registration failed: ${errorMessages}`);
        } else if (data.errors) {
            const validationErrors = Object.values(data.errors)
                .flat()
                .join(', ');
            message.error(`Validation failed: ${validationErrors}`);
        } else {
            message.error('An unexpected error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred. Please try again.');
    }

    formikBag.setSubmitting(false);
};

const RegistrationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name is too short')
        .max(50, 'Name is too long')
        .required('Name is required!'),
    username: Yup.string()
        .min(3, 'Username is too short')
        .max(20, 'Username is too long')
        .required('Username is required!'),
    password: Yup.string()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
            'Password must be 8-20 characters, with upper, lower, digit, and special character.'
        )
        .required('Password is required!'),
});

const Registration = ({ toggleForm }) => {
    return (
        <div className={styles.registrationForm}>
            <h2>Registration</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                validationSchema={RegistrationSchema}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className={styles.field}>
                            <Field
                                name="name"
                                type="text"
                                placeholder="Full Name"
                                className={styles.input}
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className={styles.invalid}
                            />
                        </div>

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
                            <button
                                type="submit"
                                className={styles.button}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>

                        <div className={styles.footer}>
                            <button
                                type="button"
                                onClick={toggleForm}
                                className={styles.linkButton}
                            >
                                Login
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Registration;
