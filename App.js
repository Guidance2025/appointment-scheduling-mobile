import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Dashboard from "./screens/Dashboard";
import Notification from "./screens/Notification";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("dashboard");

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {currentScreen === "dashboard" ? (
        <Dashboard onViewNotifications={() => setCurrentScreen("notification")} />
      ) : (
        <Notification onGoHome={() => setCurrentScreen("dashboard")} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
