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

export async function getFCMToken(setFcmToken, setTokenStatus, setTokenError) {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      setTokenError?.("Notification permissions not granted");
      setTokenStatus?.("Permission Denied");
      return null;
    }

    const token = await messaging().getToken();
    console.log(" Generated FCM Token:", token);
    setFcmToken?.(token);
    setTokenStatus?.("Active");
    await AsyncStorage.setItem("fcmToken", token);
    return token;
  } catch (err) {
    console.error(" Token generation failed:", err);
    setTokenError?.(err.message);
    setTokenStatus?.("Error");
    return null;
  }
}

export async function registerFcmToken(userId, fcmToken) {
  try {
    console.log("Registering FCM token with backend...");
    const response = await fetch(`${API_BASE_URL}/notification/register-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, fcmToken, deviceType: "MOBILE" }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend rejected token (${response.status}): ${errorText}`);
    }

    console.log(" FCM token registered successfully");
    return true;
  } catch (err) {
    console.error(" Error registering FCM token:", err);
    return false;
  }
}
