import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import messaging from '@react-native-firebase/messaging';
import Dashboard from "./screens/Dashboard";
import Notification from "./screens/Notification";
import Profile from "./screens/Profile";
import Login from "./screens/LoginScreen";
import Appointment from "./screens/Appointment";
import ExitInterview from "./screens/ExitInterview";
import MoodTrend from "./screens/MoodTrend";
import ContentHub from "./screens/ContentHub";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background notification received:', remoteMessage);
  
  const { notification, data } = remoteMessage;
  console.log('Title:', notification?.title);
  console.log('Body:', notification?.body);
  console.log('Data:', data);
  
});

export default function App() {
  const [screen, setScreen] = useState("login");

  const navigate = (target) => setScreen(target);

  useEffect(() => {
    console.log(' Setting up notification listeners.');

    const unsubscribeNotificationOpen = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(' Notification opened app from background:', remoteMessage);
      
      const actionType = remoteMessage.data?.actionType;
      if (actionType === 'APPOINTMENT_REQUEST' || actionType === 'APPOINTMENT_RESPONSE') {
        navigate('notification');
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(' App opened from notification (quit state):', remoteMessage);
          
          const actionType = remoteMessage.data?.actionType;
          if (actionType === 'APPOINTMENT_REQUEST' || actionType === 'APPOINTMENT_RESPONSE') {
            navigate('notification');
          }
        }
      });

    return () => {
      if (unsubscribeNotificationOpen) {
        unsubscribeNotificationOpen();
      }
    };
  }, []);

    return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {screen === "login" && <Login onNavigate={(t) => navigate(t)} />}

      {screen === "dashboard" && (
        <Dashboard onNavigate={(t) => navigate(t)} />
      )}

      {screen === "notification" && (
        <Notification onNavigate={(t) => navigate(t)} />
      )}

      {screen === "profile" && (
        <Profile onNavigate={(t) => navigate(t)} />
      )}

      {screen === "appointments" && (
        <Appointment onNavigate={(t) => navigate(t)} />
      )}

      {screen === "exitInterview" && (
        <ExitInterview onNavigate={(t) => navigate(t)} />
      )}

      {screen === "moodTrend" && (
        <MoodTrend onNavigate={(t) => navigate(t)} />
      )}
      {screen === "contentHub" && (
        <ContentHub onNavigate={(t) => navigate(t)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});