import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createChat, fetchMediaLink } from '../api.js';

export default function SearchResult({ user, setChatId, setSearch }) {
  SearchResult.propTypes = {
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      description: PropTypes.string,
      image: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
    }).isRequired,
    setChatId: PropTypes.func.isRequired,
    setSearch: PropTypes.func.isRequired
  };

  const token = localStorage.getItem('token');

  const [imageUrl, setImageUrl] = useState(null);
  const [contactImageId, setContactImageId] = useState(null);
  const [contactName, setContactName] = useState(null);
  const [contactId, setContactId] = useState(null);
  // const [contactImage, setContactImage] = useState(null);


  useEffect(() => {
    if (!user) {
      return;
    }
    setContactId(user.id);
  }, [user]);

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
    if (!user) {
      return;
    }

    setContactImageId(user.image?.id);

  }, [user]);

  useEffect(() => {
    if (!contactId) {
      return;
    }

    if (contactImageId) {
      FetchMediaLink(contactImageId, token);
    }
  }, [contactImageId, contactId, token]);


  useEffect(() => {
    if (!user) {
      return;
    }

    setContactName(user.name);
  }, [user]);

  const StartChat = () => {
    if (!contactId) {
      return;
    }

    const formData = new FormData();
    formData.append('typeId', 1);
    formData.append('users[]', contactId);

    createChat(formData, token).then((response) => {
      setChatId(response.id);
      setSearch('');
    }).catch((error) => {
      console.error('Error creating chat:', error);
    })
  }

  const baseImage = imageUrl || 'https://placehold.co/60x60';
  return (
    <li className="list-group-item" >
      <button
        className="btn d-flex align-items-center"
        onClick={StartChat}
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
          <p className='ms-3 mb-0'>{user.username}</p>
        </div>

      </button>
    </li>
  );
}