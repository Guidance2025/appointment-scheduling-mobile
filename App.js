import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import Dashboard from "./screens/Dashboard";
import Notification from "./screens/Notification";
import Profile from "./screens/Profile";
import ExitInterview from "./screens/ExitInterview";
// import Login from "./screens/LoginScreen";

export default function App() {
  const [screen, setScreen] = useState("dashboard");

  const navigate = (target) => setScreen(target);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* {screen === "login" && <Login onLogin={() => navigate("dashboard")} />} */}

      {screen === "dashboard" && (
        <Dashboard
          onNavigate={(t) => navigate(t)}
        />
      )}

      {screen === "notification" && (
        <Notification
          onNavigate={(t) => navigate(t)}
        />
      )}

      {screen === "profile" && (
        <Profile
          onNavigate={(t) => navigate(t)}
        />
      )}

      {screen === "exitInterview" && (
        <ExitInterview onNavigate={(t) => navigate(t)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
