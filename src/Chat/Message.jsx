import React, { useEffect, useState } from 'react';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';
import PropTypes from 'prop-types';

export default function Message({ message, chatId }) {

    Message.propTypes = {
        message: PropTypes.shape({
            id: PropTypes.number.isRequired,
            user: PropTypes.object.isRequired,
            replyMessage: PropTypes.object,
            date: PropTypes.string.isRequired,
            text: PropTypes.string,
            isEdited: PropTypes.bool.isRequired,
            isReaded: PropTypes.bool.isRequired,
            media: PropTypes.oneOfType([
                PropTypes.object, 
                PropTypes.array
            ]),
        }).isRequired,
        chatId: PropTypes.number.isRequired
    };

    const userId = localStorage.getItem('userId');
    const [id, setId] = useState(message?.id);
    const [replyMessage, setReplyMessage] = useState(null);
    const [date, setDate] = useState(null);
    const [text, setText] = useState(null);
    const [isEdited, setIsEdited] = useState(null);
    const [isReaded, setIsReaded] = useState(null);
    const [isSender, setIsSender] = useState(null);
    const [media, setmedia] = useState(null);

    useEffect(() => {
        if (!id) {
            return;
        }

        setIsSender(message.user.id == userId);
    }, [id, chatId]);

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

    useEffect(() => {
        if (!message.media) {
            return;
        }

        setmedia(message.media.id);
    }, [message.media, chatId]);

    useEffect(() => {
        if (!message.replyMessage) {
            return;
        }

        setReplyMessage(message.replyMessage);
    }, [message.replyMessage, chatId]);

    return (
        <div
            className={`p-2 rounded mb-2 ${isSender ? 'bg-primary text-white' : 'bg-light'}`}
            style={{
                width: 'fit-content',
                marginLeft: isSender ? 'auto' : '0',
                marginRight: isSender ? '0' : 'auto',
                maxWidth: '70%',
            }}
        >
            <div
                className={`d-flex align-items-center ${isSender ? 'justify-content-end' : ''}`}
            >
                <div
                    className="d-flex flex-column"
                    style={{ marginRight: '16px' }}
                >
                    {media && (<img src={media} alt="" style={{ maxWidth: '200px' }} />)}
                    <p className="mb-0">{text}</p>
                    {isEdited && (
                        <p
                            className={`mb-0 ${isSender ? 'text-light' : 'text-muted'}`}
                            style={{ fontSize: '13px' }}
                        >
                            edited
                        </p>
                    )}
                </div>
                <div
                    className="d-flex flex-column justify-content-between align-items-end"
                    style={{ height: '100%' }}
                >
                    <p
                        className={`mb-0 ${isSender ? 'text-light' : 'text-muted'}`}
                        style={{ fontSize: '13px' }}
                    >
                        {date}
                    </p>
                    <div>
                        {isReaded ? <BsCheck2All /> : <BsCheck2 />}
                    </div>
                </div>
            </div>
        </div>
    );
}
