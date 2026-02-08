export const API_BASE_URL = "https://appointment-scheduling-backend-wrx5.onrender.com";

export const REGISTER_FCM_TOKEN = `${API_BASE_URL}/notification/registerToken`;

export const USER_LOGIN_ENDPOINT = `${API_BASE_URL}/user/login`;


export const GET_NOTIFICATION_BY_USER = (userId) => (`${API_BASE_URL}/notification/${userId}`);
    