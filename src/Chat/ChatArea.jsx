import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { sendMessage, fetchMessages } from '../api';
import { message as antdMessage, Button } from 'antd';
import Message from './Message';
// import ChatHub from '../ChatHub';
import { useChatHub } from '../HubContext';
import { RxCross1 } from "react-icons/rx";

export default function ChatArea({ chatId, setChatId }) {
    const token = localStorage.getItem('token');
    const [lastMessageId, setLastMessageId] = useState(null);
    const [messagesArray, setMessagesArray] = useState([]);
    // const [unreadMessages, setUnreadMessages] = useState([]);
    const [scrollToBottom, setScrollToBottom] = React.useState(true);
    const messagesEndRef = React.useRef(null);

    const [replyMessageId, setReplyMessageId] = useState(null);

    const chatHub = useChatHub();

    ChatArea.propTypes = {
        chatId: PropTypes.number.isRequired,
        setChatId: PropTypes.func.isRequired,
    };

    useEffect(() => {
        if (!chatHub) {
            return;
        }
        // chatHub.connection.off("ReceiveMessage");
        // chatHub.connection.off("ReadedMessage");

        const reciveMessage = (message, messageChatId) => {
            console.log("Received message: ", message, messageChatId.chatId);
            const messageWithChatId = parseInt(messageChatId.chatId);
            const usingChatId = parseInt(chatId);
            if (messageWithChatId === usingChatId) {
                setMessagesArray((prevMessages) => [...prevMessages, message]);
            }
        }

        const readedMessage = (readedMessage, messageChatId) => {
            const messageWithChatId = parseInt(messageChatId.chatId);
            const usingChatId = parseInt(chatId);
            if (messageWithChatId === usingChatId) {
                setMessagesArray((prevMessages) => {
                    return prevMessages.map((message) => {
                        if (message.id === readedMessage.id) {
                            return { ...message, isReaded: true };
                        }
                        return message;
                    });
                });
            }
        }

        const attachFileToMessage = (messageWithFile) => {
            setMessagesArray((prevMessages) => {
                return prevMessages.map((message) => {
                    if (message.id === messageWithFile.id) {
                        console.log('messageWithFile', messageWithFile);
                        return { ...message, media: messageWithFile.media };
                    }
                    console.log('message', message);
                    return message;
                });
            });
        }

        // chatHub.connection.off("ReceiveMessage", reciveMessage);
        // chatHub.connection.off("ReadedMessage", readedMessage);

        chatHub.onReceiveMessage(reciveMessage);
        chatHub.onReadedMessage(readedMessage);
        chatHub.onAttachMediaToMessage(attachFileToMessage);


    }, [chatHub, chatId]);

    // useEffect(() => {
    //     if (messagesArray.length > 0) {
    //         setUnreadMessages([]);
    //         messagesArray.forEach((message) => {
    //             if (!message.isReaded) {
    //                 setUnreadMessages((prevUnreadMessages) => [...prevUnreadMessages, message]);
    //             }
    //         });
    //     }
    // }, [messagesArray]);

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

    // useEffect(() => {
    //     const fetchMessagesAsync = async (lastMessageId) => {
    //         if (!chatId || !token) {
    //             return;
    //         }

    //         try {
    //             const response = await fetchMessages(chatId, lastMessageId, token);
    //             console.log('unreadMessages: ', unreadMessages);
    //             if (response.length > 0) {
    //                 setMessagesArray((prevMessages) => {
    //                     const updatedMessages = prevMessages.map((prevMessage) => {
    //                         const matchingMessage = response.find((msg) => msg.id === prevMessage.id);
    //                         return matchingMessage
    //                             ? { ...prevMessage, isReaded: matchingMessage.isReaded }
    //                             : prevMessage;
    //                     });

    //                     const newMessages = response.filter(
    //                         (msg) => !prevMessages.some((prevMsg) => prevMsg.id === msg.id)
    //                     );

    //                     return [...updatedMessages, ...newMessages];
    //                 });

    //                 if (unreadMessages.length > 0) {
    //                     unreadMessages.forEach((message) => {
    //                         const matchingMessage = response.find((msg) => msg.id === message.id)

    //                         if (matchingMessage && matchingMessage.isReaded !== message.isReaded) {
    //                             setUnreadMessages((prevUnreadMessages) => prevUnreadMessages.filter((msg) => msg.id !== message.id));
    //                         }
    //                     })
    //                 }

    //             }
    //         } catch (error) {
    //             antdMessage.error('Error fetching messages:', error.message);
    //         }
    //     };

    //     const intervalId = setInterval(() => {
    //         fetchMessagesAsync(lastMessageId);
    //     }, 5000);

    //     return () => {
    //         clearInterval(intervalId);
    //     };
    // }, [lastMessageId, chatId, token, unreadMessages]);

    useEffect(() => {
        if (messagesArray.length > 0) {
            let lastMessageId = null;

            // if (unreadMessages.length > 0) {
            //     unreadMessages.forEach((message) => {
            //         if (lastMessageId === null) {
            //             lastMessageId = message.id;
            //         }

            //         if (!message.isReaded && message.id < lastMessageId) {
            //             lastMessageId = message.id;
            //         }
            //     });
            // }

            if (!lastMessageId || lastMessageId === Infinity) {
                lastMessageId = messagesArray[messagesArray.length - 1].id;
            }
            localStorage.setItem('lastMessageId', lastMessageId);
            setLastMessageId(lastMessageId);
        }
    }, [
        // unreadMessages, 
        messagesArray]);

    const handleFormSubmit = async (values, { resetForm }) => {
        console.log("Form values:", values);

        if (!chatId || !values.text) {
            return;
        }

        // const formData = new FormData();
        // formData.append('ChatId', chatId);
        // // formData.append('ReplyMessageId', null);
        // formData.append('Text', values.text);

        // if (values.file) {
        //     formData.append('File', values.file);
        // }

        // try {
        //     const response = await sendMessage(formData, token);
        //     response && setMessagesArray((prevMessages) => [...prevMessages, response]);
        //     resetForm();
        // } catch (error) {
        //     antdMessage.error('Error sending message: ' + error.message);
        // }

        await chatHub.sendMessage(chatId, values.text, replyMessageId);
        setReplyMessageId(null);
        resetForm();

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
                    <Message
                        key={message.id + Date.now().toPrecision(3)}
                        message={message} chatId={chatId}
                        messageUpdateHandler={messageUpdateHandler}
                        setReplyMessageId={setReplyMessageId}
                    />
                ))}
            </div>
            {replyMessageId && <div style={{ backgroundColor: "lightgray", padding: "8px", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ margin: 0 }}>
                        Reply to {messagesArray.find((message) => message.id === replyMessageId)?.user.username}
                    </p>

                    <button 
                    style={{
                        float: "right",
                        clear: "both",
                        cursor: "pointer",
                        color: "red",
                        backgroundColor: "lightgray",
                        border: "none"
                    }}
                        onClick={() => setReplyMessageId(null)}>
                        <RxCross1 />
                    </button>
                </div>
                <p style={{ marginLeft: "10px" }}>{messagesArray.find((message) => message.id === replyMessageId)?.text}</p>
            </div>}
            <Formik
                initialValues={{
                    text: ''
                    // , file: null 
                }}
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
                        {/* <input
                            type="file"
                            name="file"
                            onChange={(event) => {
                                setFieldValue('file', event.currentTarget.files[0]);
                            }}
                        /> */}
                        <button type="submit">Send</button>
                    </Form>
                )}
            </Formik>

        </div>
    );
}
