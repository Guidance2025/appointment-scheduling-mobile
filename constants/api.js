<<<<<<< HEAD
export const API_BASE_URL = "http://192.168.1.15:8080";
=======
export const API_BASE_URL = "http://172.20.10.3:8080";
>>>>>>> 84b6e908fc69f6eb5d26aeeeaf70d2acdd3efe76

export const REGISTER_FCM_TOKEN = `${API_BASE_URL}/notification/registerToken`;

export const USER_LOGIN_ENDPOINT = `${API_BASE_URL}/user/login`;


export const GET_NOTIFICATION_BY_USER = (userId) => (`${API_BASE_URL}/notification/${userId}`);
    