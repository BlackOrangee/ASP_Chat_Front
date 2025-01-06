import { ErrorMessage, Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import * as Yup from 'yup';
import { updateUserProfile } from '../../api';
import { message } from 'antd';

const UserInfoForm = ({
    userData: { name, username, description, imageId },
    setUserDataHandlers: { setName, setUsername, setDescription, setImageId }
}) => {

    const token = localStorage.getItem('token');

    UserInfoForm.propTypes = {

        userData: PropTypes.shape({
            name: PropTypes.string,
            username: PropTypes.string,
            description: PropTypes.string,
            imageId: PropTypes.number,
        }),
        setUserDataHandlers: PropTypes.shape({
            setName: PropTypes.func,
            setUsername: PropTypes.func,
            setDescription: PropTypes.func,
            setImageId: PropTypes.func,
        }),
    };

    const initialValues = {
        name: name,
        userName: username,
        description: description,
        file: null
    };

    const ValidationSchema = Yup.object().shape({
        name: Yup.string().min(4).max(20),
        userName: Yup.string().min(4).max(15),
        description: Yup.string().min(4).max(100),
    });

    const handleFormSubmit = async (values, { resetForm }) => {
        console.log("Form values:", values);

        if (values.name === name && values.userName === username && values.description === description) {
            return;
        }

        const formData = new FormData();
        if (values.name) {
            if (values.name !== name) {
                formData.append('name', values.name);
            }
        }

        if (values.userName) {
            if (values.userName !== username) {
                formData.append('username', values.userName);
            }
        }
        
        if (values.description) {
            console.log('values.description', values.description);
            console.log('description', description);
            if (values.description !== description || !description) {
                formData.append('description', values.description);
            }
        }

        if (values.file) {
            formData.append('image', values.file);
        }

        console.log(formData);

        try {
            const response = await updateUserProfile(formData, token);

            if (response.name && response.name !== name) {
                setName(response.name);
            }
            if (response.username && response.username !== username) {
                setUsername(response.username);
            }
            if (response.description && response.description !== description) {
                setDescription(response.description);
            }
            if (response.image && response.image.id !== imageId) {
                setImageId(response.image.id);
            }

            resetForm();
        } catch (error) {
            message.error('Error sending message: ' + error.message);
        }
    };

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={handleFormSubmit}
                validationSchema={ValidationSchema}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <div className='d-flex align-items-center justify-content-center'>
                            <p className='m-0'>Full Name</p>
                            <Field
                                name="name"
                                type="text"
                                placeholder={name}
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                            />
                        </div>
                        <div className='d-flex align-items-center justify-content-center'>
                            <p className='m-0'>Username</p>
                            <Field
                                name="userName"
                                type="text"
                                placeholder={username}
                            />
                            <ErrorMessage
                                name="userName"
                                component="div"
                            />
                        </div>
                        <div className='d-flex align-items-center justify-content-center'>
                            <p className='m-0'>Description</p>
                            <Field
                                name="description"
                                type="text"
                                placeholder={description}
                            />
                            <ErrorMessage
                                name="description"
                                component="div"
                            />
                        </div>
                        <input
                            type="file"
                            name="file"
                            onChange={(event) => {
                                setFieldValue('file', event.currentTarget.files[0]);
                            }}
                        />
                        <div className='d-flex align-items-center justify-content-center'>
                            <button type="submit" >
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default UserInfoForm;
