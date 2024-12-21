import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { sendMessage, fetchMessages } from '../api';
import { message as antdMessage } from 'antd';
import Message from './Message';

export default function ChatArea({ chatId, setChatId }) {
    const token = localStorage.getItem('token');
    const [lastMessageId, setLastMessageId] = useState(localStorage.getItem('lastMessageId'));
    const [messagesArray, setMessages] = useState([]);

    ChatArea.propTypes = {
        chatId: PropTypes.number.isRequired,
        setChatId: PropTypes.func.isRequired,
    };

    const fetchMessagesAsync = async (lastMessageId = null) => {
        if (!chatId || !token) {
            return;
        }
    
        try {
            const response = await fetchMessages(chatId, lastMessageId, token);
            if (response.length >= 0) {
                setMessages([]);
                setMessages([...response]);
            }
            else {
                setMessages([]);
            }
        } catch (error) {
            antdMessage.message?.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessagesAsync(lastMessageId);
    }, [chatId, lastMessageId]);

    const handleFormSubmit = async (values, { resetForm }) => {
        console.log("Form values:", values);

        if (!chatId || !values.text) {
            antdMessage.error('Chat ID or message text is missing.');
            return;
        }

        const formData = new FormData();
        formData.append('ChatId', chatId);
        // formData.append('ReplyMessageId', null);
        formData.append('Text', values.text);

        if (values.file) {
            formData.append('File', values.file);
        }

        console.log("FormData before send:", Array.from(formData.entries()));

        try {
            const response = await sendMessage(formData, token);
            console.log("API Response:", response);
            setMessages((prevMessages) => [...prevMessages, response]);
            resetForm();
        } catch (error) {
            console.error("Error sending message:", error);
            antdMessage.error('Error sending message: ' + error.message);
        }
    };


    return (
        <div className="col-6 chat-messages">
            <div className="messages custom-scrollbar">
                {messagesArray.map((message) => (
                    <Message key={message.id + Date.now()} message={message} chatId={chatId} />
                ))}
            </div>

            <Formik
                initialValues={{ text: '', file: null }}
                onSubmit={handleFormSubmit}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <Field
                            name="text"
                            type="text"
                            placeholder="Type your message..."
                            style={{ width: '100%', height: '150%', resize: 'none' }}
                        />
                        <input
                            type="file"
                            name="file"
                            onChange={(event) => {
                                setFieldValue('file', event.currentTarget.files[0]);
                            }}
                        />
                        <button type="submit">Send</button>
                    </Form>
                )}
            </Formik>

        </div>
    );
}
