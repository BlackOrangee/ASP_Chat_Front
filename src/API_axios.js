// import axios from "axios";

// export const fetchMediaLink = async (id, token) => {
//     const response = await axios.get(`/api/v1/Media/${id}`).token(token);

//     const data = await response.json();
//     console.log(data);
//     if (data.Success) {
//         return data.Data;
//     }
//     else if (data.Errors && Array.isArray(data.Errors)) {
//         const errorMessages = data.Errors.join(', ');
//         return errorMessages;
//     }
//     else if (data?.Error?.Code === "AccessDenied") {
//         return data?.Error?.Code;
//     }

//     return response.data;
// }

// export const fetchRequest = async (endpoint, method = 'GET', body = null, token = null) => {
//     const headers = { 'Content-Type': 'application/json' };

//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//     }

//     const options = {
//         method,
//         headers,
//     };

//     if (body) {
//         options.body = JSON.stringify(body);
//     }

//     try {
//         const response = await axios.method(method).endpoint(endpoint).body(body).token(token);

//         const data = await response.json();
//         console.log(data);
//         if (data.Success) {
//             return data.Data;
//         }
//         else if (data.Errors && Array.isArray(data.Errors)) {
//             const errorMessages = data.Errors.join(', ');
//             return errorMessages;
//         }
//         else if (data.Error.Code === "AccessDenied") {
//             return data.Error.Code;
//         }

//     } catch (error) {
//         console.error('Fetch error:', error);
//         throw new Error(error.message || 'Network error. Please try again later.');
//     }
// };