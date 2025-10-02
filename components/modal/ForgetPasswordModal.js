import React, { useState } from 'react';
import ForgetPasswordStyles from '../../styles/ForgetPasswordStyles';
import { View,Text,TextInput,TouchableOpacity,Modal,ScrollView,ActivityIndicator,Alert} from 'react-native';

const ForgetPasswordModal = ({ visible, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 const API_BASE_URL = "http://192.168.1.4:8080";
 const [error , setError] = useState ('');

   const handleUsernameChange = (text) => {
    setUsername(text);
    if (error) setError('');
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (error) setError('');
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (error) setError('');
  };
  const handleForgetPassword = async () => {
    setError('');
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError( 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/user/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Username not found');
      }

      const data = await response.json();

      Alert.alert(
        'Success',
        'Password updated successfully! Check your email for confirmation.',
        [
          {
            text: 'OK',
            onPress: () => {
              setUsername('');
              setPassword('');
              setConfirmPassword('');
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={ForgetPasswordStyles.centeredView}>
     
        <View style={ForgetPasswordStyles.modalView}>
          <ScrollView
            style={ForgetPasswordStyles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <Text style={ForgetPasswordStyles.modalTitle}>Recover Account</Text>
             {error && (
              <View style={ForgetPasswordStyles.errorMessage}>
                <Text style={ForgetPasswordStyles.errorText}>{error}</Text>
              </View>
             )}
            <Text style = {ForgetPasswordStyles.label}> Username</Text>
            <TextInput
              style={ForgetPasswordStyles.input}
              placeholder="Username"
              value={username}
              onChangeText={handleUsernameChange}
              autoCapitalize="none"
              editable={!isLoading}
            />
            <Text style = {ForgetPasswordStyles.label}> Password</Text>

            <TextInput
              style={ForgetPasswordStyles.input}
              placeholder="New Password"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              editable={!isLoading}
            />
            <Text style = {ForgetPasswordStyles.label}> New Password</Text>
            <TextInput
              style={ForgetPasswordStyles.input}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[
                ForgetPasswordStyles.registerButton,
                isLoading && { opacity: 0.6 },
              ]}
              onPress={handleForgetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={ForgetPasswordStyles.registerButtonText}>
                  Confirm
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={ForgetPasswordStyles.cancelButton}
              onPress={handleCancel}
              disabled={isLoading}
            >
              <Text style={ForgetPasswordStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ForgetPasswordModal;