export const fetchRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(endpoint, options);

        const data = await response.json();
        console.log(data);
        if (data.Success) {
            return data.Data;
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

export const fetchRequestF = async (endpoint, method = 'GET', body = null, token = null) => {
    const headers = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body instanceof FormData) {
        options.body = body;
    } else if (body) {
        const formData = new FormData();
        for (const key in body) {
            formData.append(key, body[key]);
        }
        options.body = formData;
    }
    console.warn(options, endpoint);
    try {
        const response = await fetch(endpoint, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.Errors?.join(', ') || response.statusText);
        }

        const data = await response.json();
        if (data.Success) {
            return data.Data;
        } else if (data.Errors && Array.isArray(data.Errors)) {
            throw new Error(data.Errors.join(', '));
        } else if (data?.Error?.Code === "AccessDenied") {
            throw new Error(data?.Error?.Message);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(error.message || 'Network error. Please try again later.');
    }
};

export const sendMessage = async (formData, token) => {
    const response = await fetch('http://localhost:5005/api/v1/Message', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    // if (!response.ok) {
    //     throw new Error('Failed to send message');
    // }

    return response.json();
};


export const fetchMessages = async (chatId, lastMessageId, token) => {
    return fetchRequest(`/api/v1/Message/chat/${chatId}${lastMessageId ? `?lastMessageId=${lastMessageId}` : ''}`, 'GET', null, token);
}

export const fetchChatById = async (id, token) => {
    return fetchRequest('/api/v1/Chat/' + id, 'GET', null, token);
}

export const fetchUserChats = async (token) => {
    return fetchRequest('/api/v1/Chat', 'GET', null, token);
}

export const fetchMediaLink = async (id, token) => {
    if (!id) {
        return null;
    }
    console.log('ID: {id}', id);
    return fetchRequest('/api/v1/Media/' + id, 'GET', null, token);
};

export const loginUser = async (credentials) => {
    return fetchRequest('/Login', 'POST', credentials);
};

export const registerUser = async (registrationData) => {
    return fetchRequest('/Register', 'POST', registrationData);
};

export const fetchProfile = async (token) => {
    return fetchRequest('/Profile', 'GET');
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