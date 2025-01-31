import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FetchAndStoreImage, LoadImageFromLocalStorage, fetchMediaLink } from '../api.js';

const ContactInfo = ({ contact, setChatId, unreadMessagesCount }) => {
    ContactInfo.propTypes = {
        contact: PropTypes.shape({
            id: PropTypes.number.isRequired,
            type: PropTypes.object.isRequired,
            users: PropTypes.arrayOf(PropTypes.object),
            name: PropTypes.string,
            image: PropTypes.object,
        }).isRequired,
        setChatId: PropTypes.func.isRequired,
        unreadMessagesCount: PropTypes.number
    };

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const [imageUrl, setImageUrl] = useState(null);
    const [contactImageId, setContactImageId] = useState(null);
    const [contactType, setContactType] = useState(null);
    const [contactName, setContactName] = useState(null);
    const [contactId, setContactId] = useState(null);
    // const [contactImage, setContactImage] = useState(null);


    useEffect(() => {
        if (!contact) {
            return;
        }
        setContactId(contact.id);
    }, [contact]);

    const FetchMediaLink = async (contactImageId, token) => {
        fetchMediaLink(contactImageId, token)
            .then((response) => {
                setImageUrl(response);
            })
            .catch((error) => {
                console.error('Error fetching profile image:', error);
            });
    };

    useEffect(() => {
        if (!contact) {
            return;
        }

        if (contactType !== 'P2P') {
            setContactImageId(contact.image?.id);
            return;
        }
        // ;
        // const user = contact.users.filter((user) => user.id !== parseInt(userId));
        // const image = user[0].image;
        setContactImageId(contact.users.filter((user) => user.id != userId)[0].image?.id);
        let imageId = contact.users.filter((user) => user.id != userId)[0].image?.id
        console.log("user image id", imageId);
        console.log("Contact users: ", contact.users);
    }, [contact, contactType, userId]);

    useEffect(() => {
        if (!contactId) {
            return;
        }

        if (contactImageId) {
            FetchMediaLink(contactImageId, token);
        }
    }, [contactImageId, contactId, token]);

    // useEffect(() => {
    //     if (!contactImageId || !contactId) {
    //         return;
    //     }

    //     const base64Image = LoadImageFromLocalStorage(contactId, contactImageId);
    //     if (!base64Image) {
    //         console.log('Image not found in local storage 1');
    //         return;
    //     }

    //     if (base64Image.startsWith("data:application/octet-stream")) {
    //         setContactImage(base64Image.replace("data:application/octet-stream", "data:image/png"));
    //     }
    //     else {
    //         setContactImage(base64Image);
    //     }

    // }, [contactImageId, contactId]);

    // useEffect(() => {
    //     if (!contactId || !imageUrl || !contactImageId) {
    //         return;
    //     }

    //     if(!contactImage) {
    //         FetchAndStoreImage(imageUrl, contactId, contactImageId);
    //     }
    // }, [imageUrl, contactId, contactImageId, contactImage]);

    useEffect(() => {
        if (!contact) {
            return;
        }

        if (contactType === 'P2P') {
            setContactName(contact.users.filter((user) => user.id !== parseInt(userId))[0].name);
            return;
        }

        setContactName(contact.name);
    }, [contact, contactType, userId]);

    useEffect(() => {
        if (!contact.type) {
            return;
        }

        setContactType(contact.type.name);
    }, [contact.type]);

    const SelectContact = () => {
        if (!contactId) {
            return;
        }
        localStorage.setItem('lastSelectedContact', contactId);
        setChatId(contactId);
    }

    const baseImage = imageUrl || 'https://placehold.co/60x60';
    return (
        <li className="list-group-item" >
            <button
                className="btn d-flex align-items-center"
                onClick={SelectContact}
            >
                {/* { (contactImage || baseImage )&&  */}
                <img
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px' }}
                    src={baseImage}
                    alt="User"
                />
                {/* } */}
                <div className=" d-flex align-items-center">
                    <p className='ms-3 mb-0'>{contactName}</p>
                    { unreadMessagesCount > 0 && <p style={{ 
                        background: 'gray', 
                        padding: '0px 7px', 
                        borderRadius: '50%', 
                        marginLeft: '10px', 
                        marginBottom: '0px',
                        color: 'white'
                        }}
                    >{unreadMessagesCount}</p>}
                </div>

            </button>
        </li>
    );
};

export default ContactInfo;
