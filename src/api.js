import { message } from "antd";
const API_URL = 'http://localhost:5005';
const API_VERSION = '/api/v1';

export const fetchRequestCombined = async (endpoint, method = 'GET', token = null, body = null, 
                                            apiVersion = API_VERSION, onSuccess = null) => {

    try {
        const headersType = body && (body instanceof FormData ? 'multipart/form-data' : 'application/json');
        const response = await fetch(API_URL + apiVersion + endpoint, {
            method: method,
            headers: {
                ...(headersType === 'application/json' && { 'Content-Type': 'application/json' }),
                // 'Content-Type': headersType,
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            ...(body && (body instanceof FormData ? { body: body } : { body: JSON.stringify(body) }))
        });

        const data = await response.json();
        console.log(data);
        if (data.Success) {
            onSuccess?.();
            if (data.Data) {
                return data.Data;
            }
            else if (data.Message) {
                message.success(data.Message);
                return data.Message;
            }
            else {
                return data;
            }
        }
        else if (data.Errors && Array.isArray(data.Errors)) {
            const errorMessages = data.Errors.join(', ');
            throw new Error(errorMessages);
        }
        else if (data?.Error?.Code === "AccessDenied") {
            throw new Error(data?.Error?.Message);
        }

    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(error.message || 'Network error. Please try again later.');
    }
};

export const registerRequest = async (values) => {
    return fetchRequestCombined('/Register', 'POST', null, values, '/Auth');
}

export const loginRequest = async (values, onAuthSuccess) => {
    return fetchRequestCombined('/Login', 'POST', null, values, '/Auth', onAuthSuccess);
};

export const sendMessage = async (formData, token) => {
    return fetchRequestCombined('/Message', 'POST', token, formData);
};

export const updateUserProfile = async (formData, token) => {
    return fetchRequestCombined('/User', 'PUT', token, formData);
};

export const changePassRequest = async (values, token) => {
    return fetchRequestCombined('/change-password', 'POST', token, values, '/Auth');
};

export const fetchMessageById = async (messageId, token) => {
    return fetchRequestCombined(`/Message/${messageId}`, 'GET', token);
};

export const setReadedToMessage = async (messageId, token) => {
    return fetchRequestCombined(`/Message/${messageId}`, 'PUT', token);
};

export const fetchMessages = async (chatId, lastMessageId, token) => {
    const queryString = lastMessageId ? `?lastMessageId=${lastMessageId}` : '';
    return fetchRequestCombined(`/Message/chat/${chatId}${queryString}`, 'GET', token);
}

export const fetchChatById = async (id, token) => {
    return fetchRequestCombined('/Chat/' + id, 'GET', token);
}

export const fetchUserChats = async (token) => {
    return fetchRequestCombined('/Chat', 'GET', token);
}

export const fetchMediaLink = async (id, token) => {
    if (!id) {
        return null;
    }
    return fetchRequestCombined('/Media/' + id, 'GET', token);
};

export const fetchProfile = async (id, token) => {
    return fetchRequestCombined('/User/' + id, 'GET', token);
};

export const FetchAndStoreImage = async (url, userId, userImageId) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch image");
        }

        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result;

            localStorage.setItem(`${userId}-${userImageId}`, base64Image);
        };

        reader.readAsDataURL(blob);
    } catch (error) {
        console.error("Error:", error);
    }
};

export const LoadImageFromLocalStorage = (userId, userImageId) => {
    const base64Image = localStorage.getItem(`${userId}-${userImageId}`);
    if (!base64Image) {
        return null;
    }
    return base64Image;
};
