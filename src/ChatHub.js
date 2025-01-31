import * as signalR from "@microsoft/signalr";
import { message } from "antd";

class ChatHub {
    constructor(accessToken, hubUrl = "ws://localhost:5005/chatHub") {
        this.accessToken = accessToken;
        this.hubUrl = hubUrl;
        this.connection = null;
    }

    async connect() {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            console.log("Already connected to SignalR.");
            return;
        }

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl, {
                accessTokenFactory: () => this.accessToken
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000])
            .configureLogging(signalR.LogLevel.Information)
            .build();

        try {
            await this.connection.start();
            console.log("Connected to SignalR.");
        } catch (error) {
            console.error("Error connecting to SignalR: ", error);
        }

        this.connection.onreconnecting(error => {
            console.warn("Reconnecting to SignalR...", error);
        });

        this.connection.onreconnected(() => {
            console.log("Reconnected to SignalR successfully.");
        });

        this.connection.onclose(() => {
            console.warn("SignalR connection closed.");
        });
    }

    async disconnect() {
        if (this.connection) {
            await this.connection.stop();
            console.log("Disconnected from SignalR.");
        }
    }

    onReceiveMessage(message, chatId) {
        if (!this.connection) {
            console.error("Connection is not established.");
            return;
        }
        this.connection.on("ReceiveMessage", message, chatId);
    }

    onReadedMessage(message, chatId) {
        if (!this.connection) {
            console.error("Connection is not established.");
            return;
        }
        this.connection.on("ReadedMessage", message, chatId);
    }

    onAttachMediaToMessage(callback) {
        if (!this.connection) {
            console.error("Connection is not established.");
            return;
        }
        this.connection.on("AttachMediaToMessage", callback);
    }

    onError(error) {
        if (!this.connection) {
            console.error("Connection is not established.");
            return;
        }
        this.connection.on("Error", error);
    }

    async sendMessage(chatId, messageText) {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            console.error("Connection is not established.");
            return;
        }

        try {
            await this.connection.invoke("SendMessageToChatAsync", { ChatId: chatId, Text: messageText });
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }

    async markMessageAsRead(messageId) {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            console.error("Connection is not established.");
            return;
        }

        try {
            console.log("Marking message as read...");
            await this.connection.invoke("SetReadedMessageStatusAsync", messageId);
        } catch (error) {
            console.error("Error marking message as read: ", error);
        }
    }

    async
}

export default ChatHub;
