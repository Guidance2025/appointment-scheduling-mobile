import React, { useState } from 'react';
import LoginStyles from "../styles/LoginStyles";
import GabayLogo from "../assets/Gabay.png"; 
import { View, TextInput, Text, Pressable, Alert , Image } from 'react-native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async () => {
   
  };

  return (
    <View style={LoginStyles.container}>
      <Image
      source={GabayLogo}   
      style={{ width: 120, height: 120 }}
    />
      <Text style={LoginStyles.title}>GABAY</Text>

      <View style={LoginStyles.formContainer}>
        <Text style={LoginStyles.label}>Username</Text>
        <TextInput
          style={[
            LoginStyles.textField,
            focusedField === 'username' && LoginStyles.textFieldFocused
          ]}
          value={username}
          onChangeText={setUsername}
          onFocus={() => setFocusedField('username')}
          onBlur={() => setFocusedField(null)}
          placeholder="Enter your username"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={LoginStyles.label}>Password</Text>
        <TextInput
          style={[
            LoginStyles.textField,
            focusedField === 'password' && LoginStyles.textFieldFocused
          ]}
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          placeholder="Enter your password"
          placeholderTextColor="#9ca3af"
          secureTextEntry={true}
        />

        <Pressable 
          style={({pressed}) => [
            LoginStyles.button,
            pressed && LoginStyles.buttonPressed,
            isLoading && LoginStyles.buttonLoading
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={LoginStyles.loginLabel}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </Pressable>

        <View style={LoginStyles.signupContainer}>
          <Text style={LoginStyles.signupText}>Don't have an account?</Text>
          <Pressable>
            <Text style={LoginStyles.signupLink}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;