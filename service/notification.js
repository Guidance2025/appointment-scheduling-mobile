
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance, AndroidStyle } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerFcmToken } from "./fcm";

export async function showNotification(title, body, data = {}) {
  try {
    const channelId = await notifee.createChannel({
      id: "appointment_channel",
      name: "Appointment Notifications",
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        smallIcon: "ic_launcher",
        importance: AndroidImportance.HIGH,
        style: { type: AndroidStyle.BIGTEXT, text: body },
      },
      data,
    })
    console.log(" Notification displayed:", title);
  } catch (err) {
    console.error(" Error displaying notification:", err);
  }
}

export function setupFCMHandlers(setFcmToken, setTokenStatus) {

  const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
    console.log(" Foreground FCM received:", remoteMessage);
    const title =
      remoteMessage.notification?.title || remoteMessage.data?.title || "New Notification";
    const body =
      remoteMessage.notification?.body || remoteMessage.data?.body || "You have a new message";
    await showNotification(title, body, remoteMessage.data);
  });

  const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
    console.log(" Token refreshed:", newToken);
    setFcmToken?.(newToken);
    setTokenStatus?.("Refreshed");
    await AsyncStorage.setItem("fcmToken", newToken);
    const userId = await AsyncStorage.getItem("userId");
    if (userId) await registerFcmToken(userId, newToken);
  });

  return () => {
    unsubscribeForeground();
    unsubscribeTokenRefresh();
  };
}
