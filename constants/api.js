export const API_BASE_URL = "http://172.20.10.3:8080";

export const REGISTER_FCM_TOKEN = `${API_BASE_URL}/notification/registerToken`;

export const USER_LOGIN_ENDPOINT = `${API_BASE_URL}/user/login`;


export const GET_NOTIFICATION_BY_USER = (userId) => (`${API_BASE_URL}/notification/${userId}`);
    