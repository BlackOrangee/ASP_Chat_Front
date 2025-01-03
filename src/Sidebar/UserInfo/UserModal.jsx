import { Modal } from 'antd';
import React, {  useState } from 'react';
import UserInfoForm from './UserInfoForm';
import PropTypes from 'prop-types';
import ChangePassForm from './ChangePassForm';


const UserModal = ({ isModalOpen, setIsModalOpen, imageUrl,
    userData: { name, username, description, imageId },
    setUserDataHandlers: { setName, setUsername, setDescription, setImageId }
}) => {

    UserModal.propTypes = {
        isModalOpen: PropTypes.bool,
        setIsModalOpen: PropTypes.func,
        imageUrl: PropTypes.string,
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

    const [menuChoice, setMenuChoice] = useState(0);

    return (
        <Modal
            open={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
            style={{ backgroundColor: '#222831', borderRadius: '8px', padding: '0px' }}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <nav style={{}}>
                    <li>
                        <button onClick={() => setMenuChoice(1)}>
                            edit
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setMenuChoice(2)}>
                            2
                        </button>
                    </li>
                </nav>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginRight: '20%'
                }}>
                    <img
                        style={{
                            objectFit: 'cover',
                            width: '140px',
                            height: '140px',
                            margin: '15px',
                        }}
                        className="rounded-circle"
                        src={imageUrl}
                        alt="User"
                    />

                    <div>
                        <h4 style={{ color: 'red' }}>{username}</h4>
                        <p>{name}</p>

                        <p>{description}</p>

                    </div>
                </div>
            </div>

            {menuChoice === 1 && (
                <div>
                    <h2 className=' m-0 d-flex align-items-center justify-content-center'>Edit Profile</h2>
                    <UserInfoForm
                        userData={{
                            name,
                            username,
                            description,
                            imageId
                        }}
                        setUserDataHandlers={{
                            setName,
                            setUsername,
                            setDescription,
                            setImageId
                        }}
                    />
                </div>
            )}
            {menuChoice === 2 && (
                <div>
                    <h2>Menu 2</h2>
                    <ChangePassForm username={username}/>
                </div>
            )}
            {menuChoice === 3 && (
                <div>
                    <h2>Menu 3</h2>
                    <p>Content for Menu 3</p>
                </div>
            )}
        </Modal>
    );
}

export default UserModal;
