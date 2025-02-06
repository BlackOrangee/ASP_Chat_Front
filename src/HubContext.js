import React, { createContext, useContext, useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatHub from './ChatHub';

const HubContext = createContext();

export const useChatHub = () => useContext(HubContext);

export const useSignalR = () => {
    return useContext(HubContext);
};

export const HubProvider = ({ children, hubUrl, accessToken }) => {
    // const [connection, setConnection] = useState(null);
    const [chatHub, setChatHub] = useState(null);

    useEffect(() => {
        const chatHubInstance = new ChatHub(accessToken, hubUrl);
        chatHubInstance.connect().then(() => {
            setChatHub(chatHubInstance);
        });

        return () => {
            if (chatHubInstance) {
                chatHubInstance.disconnect();
            }
        };
    }, [accessToken, hubUrl]);

    // useEffect(() => {
    //     const connect = async () => {
    //         const connection = new HubConnectionBuilder()
    //             .withUrl(hubUrl, {
    //                 accessTokenFactory: () => accessToken,
    //             })
    //             .withAutomaticReconnect([0, 2000, 5000, 10000])
    //             .configureLogging(LogLevel.Information)
    //             .build();

    //         connection.onreconnecting(error => {
    //             console.warn('Reconnecting...', error);
    //         });

    //         connection.onreconnected(() => {
    //             console.log('Reconnected to SignalR');
    //         });

    //         connection.onclose(() => {
    //             console.warn('Connection closed');
    //         });

    //         try {
    //             await connection.start();
    //             console.log('Connected to SignalR');
    //             setConnection(connection);
    //         } catch (error) {
    //             console.error('Error connecting to SignalR:', error);
    //         }
    //     };

    //     connect();

    //     return () => {
    //         if (connection) {
    //             connection.stop();
    //             console.log('Disconnected from SignalR');
    //         }
    //     };
    // }, [hubUrl, accessToken]);

    return (
        <HubContext.Provider value={chatHub}>
            {children}
        </HubContext.Provider>
    );
};
