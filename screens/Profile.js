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
} from "react-native";
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
      
    } catch (err) {
      console.error('Profile update error:', err);
      
      if (err.message && (
          err.message.includes('EMAIL ALREADY EXIST') || 
          err.message.includes('409') ||
          err.message.includes('CONFLICT')
      )) {
       showError(true);
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
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {       
              await AsyncStorage.multiRemove(['jwtToken', 'studentId']);
              onNavigate('login');
            } catch (err) {
              console.error('Logout error:', err);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } 
          } 
        }
      ]
    );
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.scrollContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={{ marginTop: 10, color: '#666' }}>Loading profile...</Text>
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
        <View style={[styles.scrollContainer, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
          <Text style={{ color: '#d32f2f', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
            Unable to load profile data
          </Text>
          <TouchableOpacity 
            style={[styles.editBtn, { backgroundColor: '#0066cc' }]}
            onPress={getProfile}
          >
            <Text style={styles.editText}>Retry</Text>
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
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.name}>
              {getFullName()}
            </Text>
            <Text style={styles.role}>
              {profileData?.section?.course || "N/A"} - {profileData?.section?.organization || "N/A"}
            </Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.label}>Student Number</Text>
          <Text style={styles.value}>
            {profileData?.studentNumber || "N/A"}
          </Text>

          <Text style={[styles.label, { marginTop: 16 }]}>E-mail Address</Text>
          {isEditing ? (
            <TextInput
              style={[styles.value, { 
                borderWidth: 1, 
                borderColor: '#ddd', 
                borderRadius: 8, 
                padding: 10,
                backgroundColor: '#f9f9f9'
              }]}
              value={editForm.email}
              onChangeText={(text) => setEditForm({ ...editForm, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSaving}
            />
          ) : (
            <Text style={styles.value}>
              {profileData?.person?.email || "N/A"}
            </Text>
          )}

          <Text style={[styles.label, { marginTop: 16 }]}>Phone Number</Text>
          {isEditing ? (
            <TextInput
              style={[styles.value, { 
                borderWidth: 1, 
                borderColor: '#ddd', 
                borderRadius: 8, 
                padding: 10,
                backgroundColor: '#f9f9f9'
              }]}
              value={editForm.contactNumber}
              onChangeText={(text) => setEditForm({ ...editForm, contactNumber: text })}
              keyboardType="phone-pad"
              editable={!isSaving}
            />
          ) : (
            <Text style={styles.value}>
              {profileData?.person?.contactNumber || "N/A"}
            </Text>
          )}

          <Text style={[styles.label, { marginTop: 16 }]}>Address</Text>
          {isEditing ? (
            <TextInput
              style={[styles.value, { 
                borderWidth: 1, 
                borderColor: '#ddd', 
                borderRadius: 8, 
                padding: 10,
                backgroundColor: '#f9f9f9',
                minHeight: 60
              }]}
              value={editForm.address}
              onChangeText={(text) => setEditForm({ ...editForm, address: text })}
              multiline
              numberOfLines={3}
              editable={!isSaving}
            />
          ) : (
            <Text style={styles.value}>
              {profileData?.person?.address || "N/A"}
            </Text>
          )}

          <Text style={[styles.label, { marginTop: 16 }]}>Section</Text>
          <Text style={styles.value}>
            {profileData?.section?.sectionName || "N/A"}
          </Text>

          {isEditing ? (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity 
                style={styles.saveBtn}
                onPress={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveText}>Save Changes</Text>
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
            <TouchableOpacity 
              style={styles.editBtn}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editText}>Edit Details</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.logoutBtn}
            onPress={handleLogout}
            disabled={isEditing}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SuccessMessage
        visible={showSuccess}
        message={"Updated Successfully"}
        onClose={() => setShowSuccess(false)}
      />

      <BottomNavBar
        activeScreen={activeScreen}
        onNavigate={handleNavigation}
      />
    </SafeAreaView>
  );
}