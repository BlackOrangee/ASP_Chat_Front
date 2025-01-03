import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { sendMessage, fetchMessages } from '../api';
import { message as antdMessage } from 'antd';
import Message from './Message';

export default function ChatArea({ chatId, setChatId }) {
    const token = localStorage.getItem('token');
    const [lastMessageId, setLastMessageId] = useState(null);
    const [messagesArray, setMessagesArray] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [scrollToBottom, setScrollToBottom] = React.useState(false);
    const messagesEndRef = React.useRef(null);

    ChatArea.propTypes = {
        chatId: PropTypes.number.isRequired,
        setChatId: PropTypes.func.isRequired,
    };

    useEffect(() => {
        if (messagesArray.length > 0) {
            setUnreadMessages([]);
            messagesArray.forEach((message) => {
                if (!message.isReaded) {
                    setUnreadMessages((prevUnreadMessages) => [...prevUnreadMessages, message]);
                }
            });
        }
    }, [messagesArray]);

    useEffect(() => {
        const fetchMessagesAsync = async () => {
            if (!chatId || !token) {
                return;
            }

            try {
                const response = await fetchMessages(chatId, null, token);
                if (response.length >= 0) {
                    setMessagesArray([]);
                    setMessagesArray([...response]);
                }
                else {
                    setMessagesArray([]);
                }
            } catch (error) {
                antdMessage.message?.error('Error fetching messages:', error);
            }
        };

        fetchMessagesAsync();
    }, [chatId, token]);

    useEffect(() => {
        const fetchMessagesAsync = async (lastMessageId) => {
            if (!chatId || !token) {
                return;
            }

            try {
                const response = await fetchMessages(chatId, lastMessageId, token);
                console.log('unreadMessages: ', unreadMessages);
                if (response.length > 0) {
                    setMessagesArray((prevMessages) => {
                        const updatedMessages = prevMessages.map((prevMessage) => {
                            const matchingMessage = response.find((msg) => msg.id === prevMessage.id);
                            return matchingMessage
                                ? { ...prevMessage, isReaded: matchingMessage.isReaded }
                                : prevMessage;
                        });

                        const newMessages = response.filter(
                            (msg) => !prevMessages.some((prevMsg) => prevMsg.id === msg.id)
                        );

                        return [...updatedMessages, ...newMessages];
                    });

                    if (unreadMessages.length > 0) {
                        unreadMessages.forEach((message) => {
                            const matchingMessage = response.find((msg) => msg.id === message.id)

                            if (matchingMessage && matchingMessage.isReaded !== message.isReaded) {
                                setUnreadMessages((prevUnreadMessages) => prevUnreadMessages.filter((msg) => msg.id !== message.id));
                            }
                        })
                    }

                }
            } catch (error) {
                antdMessage.error('Error fetching messages:', error.message);
            }
        };

        const intervalId = setInterval(() => {
            fetchMessagesAsync(lastMessageId);
        }, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [lastMessageId, chatId, token, unreadMessages]);

    useEffect(() => {
        if (messagesArray.length > 0) {
            let lastMessageId = null;

            if (unreadMessages.length > 0) {
                unreadMessages.forEach((message) => {
                    if (lastMessageId === null) {
                        lastMessageId = message.id;
                    }

                    if (!message.isReaded && message.id < lastMessageId) {
                        lastMessageId = message.id;
                    }
                });
            }

            if (!lastMessageId || lastMessageId === Infinity) {
                lastMessageId = messagesArray[messagesArray.length - 1].id;
            }
            localStorage.setItem('lastMessageId', lastMessageId);
            setLastMessageId(lastMessageId);
        }
    }, [unreadMessages, messagesArray]);

    const handleFormSubmit = async (values, { resetForm }) => {
        console.log("Form values:", values);

        if (!chatId || !values.text) {
            return;
        }

        const formData = new FormData();
        formData.append('ChatId', chatId);
        // formData.append('ReplyMessageId', null);
        formData.append('Text', values.text);

        if (values.file) {
            formData.append('File', values.file);
        }

        try {
            const response = await sendMessage(formData, token);
            response && setMessagesArray((prevMessages) => [...prevMessages, response]);
            resetForm();
        } catch (error) {
            antdMessage.error('Error sending message: ' + error.message);
        }
    };


    const messageUpdateHandler = (message) => {
        setMessagesArray((prevMessages) => {
            const updatedMessages = prevMessages.map((prevMessage) => {
                if (prevMessage.id === message.id) {
                    return message;
                }
                return prevMessage;
            });
            return updatedMessages;
        });
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTo({
                top: messagesEndRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [chatId]);

    return (
        <div className="col-6 chat-messages">
            <div className="messages custom-scrollbar" ref={messagesEndRef} onScroll={() => {
                if (messagesEndRef.current) {
                    const { scrollTop, scrollHeight, clientHeight } = messagesEndRef.current;
                    if (scrollTop + clientHeight === scrollHeight) {
                        setScrollToBottom(true);
                    } else {
                        setScrollToBottom(false);
                    }
                }
            }}>
                {scrollToBottom && messagesEndRef.current?.scrollTo({
                    top: messagesEndRef.current?.scrollHeight,
                    behavior: 'smooth',
                })}

                {messagesArray.map((message) => (
                    <Message key={message.id + Date.now().toPrecision(3)} message={message} chatId={chatId} messageUpdateHandler={messageUpdateHandler} />
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
                            placeholder="Type your message..."
                            style={{ width: '100%', height: '70%', resize: 'none' }}
                            as="textarea"
                            className="form-control"
                            rows="3"
                            cols="50"
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
