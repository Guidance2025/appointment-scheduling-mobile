import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";

export async function requestNotificationPermissions() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Notification permissions granted");
      return true;
    } else {
      console.log(" Notification permissions denied");
      return false;
    }
  } catch (err) {
    console.error("Error requesting permissions:", err);
    return false;
  }
}
export const getFCMToken = async (setFcmToken, setTokenStatus, setTokenError) => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      setTokenStatus("Permission denied");
      setTokenError("Notification permission was denied");
      return null;
    }

    const token = await messaging().getToken();
    console.log("FCM Token:", token);
    setFcmToken(token);
    setTokenStatus("Token received");
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    setTokenStatus("Error");
    setTokenError(error.message);
    return null;
  }
};

export const registerFcmToken = async (userId, token) => {
  console.log(" Attempting to register FCM token:", {
    userId,
    userIdType: typeof userId,
    token: token?.substring(0, 20) + "...",
    tokenLength: token?.length,
    timestamp: new Date().toISOString()
  });
  
  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    
    if (!jwtToken) {
      console.error(" No JWT token found in storage");
      throw new Error("Authentication required");
    }
    
    console.log(" JWT Token found");
    
    const requestBody = {
      userId: userId,
      fcmToken: token,  
      deviceType: "MOBILE"  
    };
    
    console.log(" Request body:", JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/notification/register-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log(" FCM registration response status:", response.status);
    
    const responseText = await response.text();
    console.log(" Response body:", responseText);
    
    if (!response.ok) {
      console.error(" FCM registration failed:", responseText);
      throw new Error(`Failed to register FCM token: ${response.status}`);
    }
    
    const result = JSON.parse(responseText);
    console.log(" FCM token registered:", result);
    return result;
    
  } catch (error) {
    console.error(" Error in registerFcmToken:", error);
    throw error;
  }
};