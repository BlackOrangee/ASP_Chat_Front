import React, { useEffect, useState } from 'react';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';
import PropTypes from 'prop-types';
import { attachFileToMessage, fetchMediaLink } from '../api';
import { useChatHub } from '../HubContext';
import { Dropdown } from 'react-bootstrap';

export default function Message({ message, chatId, setReplyMessageId }) {

    Message.propTypes = {
        message: PropTypes.shape({
            id: PropTypes.number.isRequired,
            user: PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                username: PropTypes.string.isRequired,
                description: PropTypes.string,
                image: PropTypes.shape({
                    id: PropTypes.number.isRequired
                }).isRequired
            }).isRequired,
            replyMessage: PropTypes.oneOfType([
                PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    user: PropTypes.shape({
                        id: PropTypes.number.isRequired,
                        name: PropTypes.string.isRequired,
                        username: PropTypes.string.isRequired,
                        description: PropTypes.string,
                        image: PropTypes.shape({
                            id: PropTypes.number.isRequired
                        }).isRequired
                    }).isRequired,
                    date: PropTypes.string.isRequired,
                    text: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
                    isEdited: PropTypes.bool.isRequired,
                    isReaded: PropTypes.bool.isRequired,
                    media: PropTypes.arrayOf(
                        PropTypes.shape({
                            id: PropTypes.number.isRequired
                        })
                    )
                }),
                PropTypes.oneOf([null])
            ]),
            date: PropTypes.string.isRequired,
            text: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
            isEdited: PropTypes.bool.isRequired,
            isReaded: PropTypes.bool.isRequired,
            media: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.number.isRequired
                })
            )
        }).isRequired,
        chatId: PropTypes.number.isRequired,
        setReplyMessageId: PropTypes.func
    };

    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('userId'));
    const [id, setId] = useState(message?.id);
    const [replyMessage, setReplyMessage] = useState(null);
    const [date, setDate] = useState(null);
    const [text, setText] = useState(null);
    const [isEdited, setIsEdited] = useState(null);
    const [isReaded, setIsReaded] = useState(null);
    const [isSender, setIsSender] = useState(null);
    const [media, setMedia] = useState([]);
    const [mediaLink, setMediaLink] = useState({});

    const chatHub = useChatHub();

    useEffect(() => {
        if (message?.media == null) {
            return;
        }
        setMedia(message.media);
    }, [message]);

    useEffect(() => {
        if (!id) {
            return;
        }

        setIsSender(message.user.id === userId);
    }, [id, chatId, message?.user?.id, userId]);

    useEffect(() => {
        if (message.isReaded == null) {
            return;
        }

        setIsReaded(message.isReaded);
    }, [message.isReaded, chatId]);

    useEffect(() => {
        if (message.isEdited == null) {
            return;
        }

        setIsEdited(message.isEdited);
    }, [message.isEdited, chatId]);

    useEffect(() => {
        if (!message.text) {
            return;
        }

        setText(message.text);
    }, [message.text, chatId]);

    useEffect(() => {
        if (!message.date) {
            return;
        }

        const [date, time] = message.date.split("T");
        const timeWithoutMilliseconds = time.split(".")[0];
        const timeWithoutSeconds = timeWithoutMilliseconds.split(":");

        setDate(timeWithoutSeconds[0] + ":" + timeWithoutSeconds[1]);
    }, [message.date, chatId]);

    // useEffect(() => {
    //     if (!message.media) {
    //         return;
    //     }

    //     setmedia(message.media.id);
    // }, [message.media, chatId]);

    useEffect(() => {
        if (!message.replyMessage) {
            return;
        }

        setReplyMessage(message.replyMessage);
    }, [message.replyMessage, chatId]);

    useEffect(() => {
        if (!id) {
            return;
        }

        if (isReaded || isSender || isReaded == null || isSender == null) {
            return;
        }

        if (!isSender && !isReaded) {
            if (chatHub) {
                console.log("Marking message as read: ", id);
                chatHub.markMessageAsRead(id);

                // setIsReaded(true);
                // message.isReaded = true;
            }
            // setReadedToMessage(id, token)
            //     .then(() => {
            //         setIsReaded(true);
            //         message.isReaded = true;
            //         // messageUpdateHandler(message);
            //     }).catch((error) => {
            //         console.log(error);
            //     });
        }

    }, [isSender, isReaded, chatId, id, message, token]);

    useEffect(() => {
        if (!Array.isArray(media) || media.length === 0) {
            return;
        }

        const fetchLinks = async () => {
            try {
                const missingMedia = media.filter(m => !mediaLink[m.id]);

                if (missingMedia.length === 0 && mediaLink.length !== 0) {
                    return;
                }

                const responses = await Promise.all(
                    missingMedia.map(async (m) => {
                        const link = await fetchMediaLink(m.id, token);
                        return { id: m.id, link };
                    })
                );

                setMediaLink(prevLinks => ({
                    ...prevLinks,
                    ...Object.fromEntries(responses.map(({ id, link }) => [id, link]))
                }));
            } catch (error) {
                console.log(error);
            }
        };

        fetchLinks();
    }, [media, token]);



    const handleAttachFile = async (values) => {

        const formData = new FormData();
        formData.append('MessageId', id);

        if (values.file) {
            formData.append('File', values.file);
        }

        try {
            const response = await attachFileToMessage(formData, token);
            response && setMedia(response.media);
        } catch (error) {
            console.error('Error sending message: ' + error.message);
        }
        console.log('values', values);
    }

    const handleReply = () => {
        console.log('Replying to message: ', message);
        setReplyMessageId(message.id);
    };

    return (
        <Dropdown
            className={`p-2 rounded mb-2 ${isSender ? 'bg-primary text-white' : 'bg-light'}`}
            style={{
                width: 'fit-content',
                marginLeft: isSender ? 'auto' : '0',
                marginRight: isSender ? '0' : 'auto',
                maxWidth: '70%',
            }}
        >
            <Dropdown.Toggle as="div" variant="success" id="dropdown-basic">
                <div className={`d-flex align-items-center ${isSender ? 'justify-content-end' : ''}`}>
                    <div className="d-flex flex-column" style={{ marginRight: '16px' }}>
                        {replyMessage && (
                            <div className='p-2 mb-2' style={{ background: 'gray', borderRadius: '8px' }}>
                                <p className="mb-0" style={{ fontSize: '14px' }}>{replyMessage.user.username}</p>
                                <p className="mb-0" style={{ fontSize: '12px' }}>{replyMessage.text}</p>
                            </div>
                        )}
                        {mediaLink && Object.values(mediaLink).map(link => (
                            <img key={link} src={link} alt="" style={{ maxWidth: '400px' }} />
                        ))}
                        <p className="mb-0" style={{ fontSize: '14px' }}>{text}</p>
                        {isEdited && (
                            <p
                                className={`mb-0 ${isSender ? 'text-light' : 'text-muted'}`}
                                style={{ fontSize: '13px' }}
                            >
                                edited
                            </p>
                        )}
                    </div>
                    <div className="d-flex flex-column justify-content-between align-items-end" style={{ height: '100%' }}>
                        <p className={`mb-0 ${isSender ? 'text-light' : 'text-muted'}`} style={{ fontSize: '13px' }}>
                            {date}
                        </p>
                        <div>
                            {isReaded ? <BsCheck2All /> : <BsCheck2 />}
                        </div>
                    </div>
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={handleReply}>Reply</Dropdown.Item>
                {message.user.id === userId && (
                    <>
                        <Dropdown.Item as="div" className="position-relative">
                            Attach File
                            <input
                                type="file"
                                name="file"
                                onChange={(event) => {
                                    if (event.target.files.length > 0) {
                                        handleAttachFile({ file: event.target.files[0] });
                                    }
                                }}
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0,
                                    cursor: "pointer"
                                }}
                            />
                        </Dropdown.Item>
                        {/* <Dropdown.Item href="#/action-3">Delete</Dropdown.Item> */}
                    </>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}
