import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import ButtonColorHighlight from '../components/ButtonColorHighlight';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import LoadingPage from '../components/LoadingPage'; 
import Logo from '../components/Logo'; 
import { LinearGradient } from 'expo-linear-gradient'; 

//a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about
            

const TOKEN_KEY = 'my-jwt';

const Signin = () => {
  const { themeStyles, gradientColors } = useGlobalStyle();
  const { darkColor, lightColor } = gradientColors;
  const [showSignIn, setShowSignIn ] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const { onSignin, onSignup, onSignOut, reInitialize, fetchUser } = useAuthUser();
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  });

  useEffect(() => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);

  useEffect(() => { 
    checkIfSignedIn();
  }, []);

  const checkIfSignedIn = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        console.log(token);
        reInitialize(); 
        // Optionally, handle any other logic needed after re-initialization
      } else {
        // No token found, show sign in
        setShowSignIn(true);
      }
    } catch (error) { 
      console.error('Error checking sign-in status', error);
      // Handle errors as necessary
    }
  };
  

  const handleAuthentication = async () => {
    setLoading(true);
    let result;
    if (isSignIn) {
      result = await onSignin(username, password);
    } else {
      if (password !== verifyPassword) {
        alert("Passwords do not match!");
        setLoading(false);
        return;
      }
      result = await onSignup(username, email, password);
      if (result && result.status === 201) {
        alert("Sign up was successful!");
        setSignUpSuccess(true);
        setLoading(false);
        navigation.navigate('Signin');
      } else if (result && result.error) {
        alert("Error: " + result.error);
      }
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setVerifyPassword('');
    setIsSignIn(prevState => !prevState);
    setSignUpSuccess(false);
  };

  const handleUsernameSubmit = () => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };

  const handleEmailSubmit = () => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };

  if (!fontsLoaded) {
    return null; // Or any other loading indicator if fonts are not yet loaded
  }

  return (
    <LinearGradient
      colors={[darkColor, lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, themeStyles.signinContainer]}
    >
      {loading && (
        <LoadingPage loading={loading} spinnerType='circle' />
      )}
      {!loading && (
        <>
        <View style={{width: '100%'}}>
          <Logo
            shapeSource={require('../assets/shapes/lizard.png')}
            shapePosition="right"
            shapePositionValue={50}
            shapePositionVerticalValue={-30}  
            shapeHeight={100}
            shapeWidth={100}
            accessible={true}
            accessibilityLabel="App Logo"
            accessibilityHint="This is the logo of the app"
          /> 
        </View>

          {showSignIn && (
          <View style={styles.form} accessible={true} accessibilityLabel="Form container">
            {!isSignIn && (
              <TextInput
                style={[styles.input, themeStyles.signinInput, isEmailFocused && styles.inputFocused]}
                placeholder="Email"
                placeholderTextColor={themeStyles.signinInput.placeholderTextColor} 
                onChangeText={(text) => setEmail(text)}
                value={email}
                onSubmitEditing={handleEmailSubmit}
                ref={emailInputRef}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                accessible={true}
                accessibilityLabel="Email input"
                accessibilityHint="Enter your email address"
                importantForAccessibility="yes"
              />
            )}
            <TextInput
              style={[styles.input, themeStyles.signinInput, isUsernameFocused && styles.inputFocused]}
              placeholder="Username"
              placeholderTextColor={themeStyles.signinInput.placeholderTextColor} 
              onChangeText={(text) => setUsername(text)}
              value={username}
              onSubmitEditing={handleUsernameSubmit}
              ref={usernameInputRef}
              onFocus={() => setIsUsernameFocused(true)}
              onBlur={() => setIsUsernameFocused(false)}
              accessible={true}
              accessibilityLabel="Username input"
              accessibilityHint="Enter your username"
              importantForAccessibility="yes"
            />
            <TextInput
              style={[styles.input, themeStyles.signinInput, isPasswordFocused && styles.inputFocused]}
              placeholder="Password"
              placeholderTextColor={themeStyles.signinInput.placeholderTextColor} 
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              value={password}
              ref={passwordInputRef}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              accessible={true}
              accessibilityLabel="Password input"
              accessibilityHint="Enter your password"
              importantForAccessibility="yes"
            />
            {!isSignIn && (
              <TextInput
                style={[styles.input, themeStyles.signinInput, isPasswordFocused && styles.inputFocused]}
                placeholder="Verify Password"
                placeholderTextColor={themeStyles.signinInput.placeholderTextColor} 
                secureTextEntry={true}
                onChangeText={(text) => setVerifyPassword(text)}
                value={verifyPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                accessible={true}
                accessibilityLabel="Verify Password input"
                accessibilityHint="Re-enter your password for verification"
                importantForAccessibility="yes"
              />
            )}
            {!loading && (
              <>
                <ButtonColorHighlight
                  onPress={handleAuthentication}
                  title={isSignIn ? "Sign in" : "Create account"} 
                  shapeSource={require('../assets/shapes/coffeecupdarkheart.png')}
                  shapeWidth={190}
                  shapeHeight={190}
                  shapePosition="left"
                  shapePositionValue={-28}
                  shapePositionVerticalValue={-23}
                  fontColor="white"
                  accessible={true}
                  accessibilityLabel={isSignIn ? "Sign in button" : "Create account button"}
                  accessibilityHint="Press to sign in or create an account"
                />
                <Text
                  style={styles.toggleButton}
                  onPress={toggleMode}
                  accessible={true}
                  accessibilityLabel="Toggle button"
                  accessibilityHint="Press to toggle between sign in and create account"
                >
                  {isSignIn ? "Create account" : "Go back to sign in"}
                </Text>
                {signUpSuccess && (
                  <Text
                    style={styles.successMessage}
                    accessible={true}
                    accessibilityLabel="Sign up success message"
                    accessibilityHint="Message indicating sign up was successful"
                  >
                    Sign up successful! Please log in.
                  </Text>
                )}
              </>
            )}
          </View>
           )}
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 10,
    width: '100%',
    fontFamily: 'Poppins-Regular',
  },
  input: {
    height: 'auto',
    borderWidth: 1,
    padding: 10,
    paddingTop: 14,
    borderRadius: 10,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: 'black',
  },
  inputFocused: {
    borderColor: 'orange',
    borderWidth: 2,
  },
  container: {
    flex: 1, 
    paddingTop: 60,
    backgroundColor: 'blue',
    justifyContent: "center",
    flexDirection: 'column',
    alignItems: "center",
    width: "100%",
    padding: 4, 
    fontFamily: 'Poppins-Regular',
  },
  title: {
    fontSize: 62,
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  appDescription: {
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20, 
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  toggleButton: {
    color: 'black',
    marginTop: 2,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  spinnerContainer: {
    ...StyleSheet.absoluteFillObject, // Cover the entire screen
    backgroundColor: 'transparent', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    marginTop: 10,
    color: 'green',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default Signin;
