import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/ProfileStyles";
import BottomNavBar from "./layout/BottomNavBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/api";
import { updateStudentProfile } from "../service/student";
import { SuccessMessage } from './modal/message/SuccessMessage';

export default function Profile({ onNavigate }) {
  const [activeScreen, setActiveScreen] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [editForm, setEditForm] = useState({
    email: "",
    contactNumber: "",
    address: ""
  });

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profileData?.person) {
      setEditForm({
        email: profileData.person.email || "",
        contactNumber: profileData.person.contactNumber || "",
        address: profileData.person.address || ""
      });
    }
  }, [profileData]);

  const getProfile = async () => {
    try {
      setError(null);
      
      const studentId = await AsyncStorage.getItem("studentId");
      const jwtToken = await AsyncStorage.getItem("jwtToken");

      if (!studentId) {
        throw new Error("Student ID not found. Please log in again.");
      }

      if (!jwtToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/student/retrieve/profile/${studentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      setError(err.message);
      Alert.alert(
        'Error',
        err.message || 'Failed to load profile data. Please try again.',
        [{ text: 'OK' }]
      );
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!editForm.email.trim()) {
        Alert.alert('Validation Error', 'Email address is required.');
        return;
      }

      if (!editForm.contactNumber.trim()) {
        Alert.alert('Validation Error', 'Phone number is required.');
        return;
      }

      if (!editForm.address.trim()) {
        Alert.alert('Validation Error', 'Address is required.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email.trim())) {
        Alert.alert('Validation Error', 'Please enter a valid email address.');
        return;
      }

      const phoneRegex = /\d{10,}/;
      if (!phoneRegex.test(editForm.contactNumber.trim().replace(/\D/g, ''))) {
        Alert.alert('Validation Error', 'Please enter a valid phone number (at least 10 digits).');
        return;
      }

      setIsSaving(true);
      
      const studentId = await AsyncStorage.getItem("studentId");
      if (!studentId) {
        throw new Error("Student ID not found");
      }

      const updatedStudent = await updateStudentProfile(studentId, editForm);
      
      setProfileData(updatedStudent);
      setIsEditing(false);
      setShowSuccess(true);
      Keyboard.dismiss();
      
    } catch (err) {
      console.error('Profile update error:', err);
      
      if (err.message && (
          err.message.includes('EMAIL ALREADY EXIST') || 
          err.message.includes('409') ||
          err.message.includes('CONFLICT')
      )) {
        Alert.alert(
          'Error',
          'This email address is already in use. Please use a different email.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          err.message || 'Failed to update profile. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profileData?.person) {
      setEditForm({
        email: profileData.person.email || "",
        contactNumber: profileData.person.contactNumber || "",
        address: profileData.person.address || ""
      });
    }
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['jwtToken', 'studentId']);
      onNavigate('login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleNavigation = (screen) => {
    setActiveScreen(screen);
    onNavigate(screen);
  };

  const getFullName = () => {
    if (!profileData?.person) return "User";
    const { firstName, middleName, lastName } = profileData.person;
    return `${firstName || ""} ${middleName ? middleName + " " : ""}${lastName || ""}`.trim();
  };

  const getInitials = () => {
    if (!profileData?.person) return "U";
    const { firstName, lastName } = profileData.person;
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#48BB78" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
        <BottomNavBar
          activeScreen={activeScreen}
          onNavigate={handleNavigation}
        />
      </SafeAreaView>
    );
  }

  if (error && !profileData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorText}>Unable to load profile data</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={getProfile}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <BottomNavBar
          activeScreen={activeScreen}
          onNavigate={handleNavigation}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.name}>{getFullName()}</Text>
                <Text style={styles.role}>
                  {profileData?.section?.course || "N/A"} - {profileData?.section?.organization || "N/A"}
                </Text>
              </View>
            </View>
            
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Ionicons name="school-outline" size={18} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Student Number</Text>
                  <Text style={styles.value}>{profileData?.studentNumber || "N/A"}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={18} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Email Address</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editForm.email}
                      onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isSaving}
                      returnKeyType="next"
                    />
                  ) : (
                    <Text style={styles.value}>{profileData?.person?.email || "N/A"}</Text>
                  )}
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={18} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Phone Number</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editForm.contactNumber}
                      onChangeText={(text) => setEditForm({ ...editForm, contactNumber: text })}
                      keyboardType="phone-pad"
                      editable={!isSaving}
                      returnKeyType="next"
                    />
                  ) : (
                    <Text style={styles.value}>{profileData?.person?.contactNumber || "N/A"}</Text>
                  )}
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Address</Text>
                  {isEditing ? (
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={editForm.address}
                      onChangeText={(text) => setEditForm({ ...editForm, address: text })}
                      multiline
                      numberOfLines={3}
                      editable={!isSaving}
                      returnKeyType="done"
                      blurOnSubmit={true}
                    />
                  ) : (
                    <Text style={styles.value}>{profileData?.person?.address || "N/A"}</Text>
                  )}
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="people-outline" size={18} color="#64748B" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Section</Text>
                  <Text style={styles.value}>{profileData?.section?.sectionName || "N/A"}</Text>
                </View>
              </View>

              {isEditing ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={styles.saveBtn}
                    onPress={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.saveText}>Save</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.cancelBtn}
                    onPress={handleCancelEdit}
                    disabled={isSaving}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.editBtn, { flex: 1 }]}
                    onPress={() => setIsEditing(true)}
                  >
                    <Ionicons name="create-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.editText}>Edit Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.logoutBtn, { flex: 1 }]}
                    onPress={handleLogout}
                  >
                    <Ionicons name="log-out-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {isEditing && <View style={{ height: 100 }} />}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <SuccessMessage
        visible={showSuccess}
        message={"Profile Updated Successfully"}
        onClose={() => setShowSuccess(false)}
      />

      <BottomNavBar
        activeScreen={activeScreen}
        onNavigate={handleNavigation}
      />
    </SafeAreaView>
  );
}