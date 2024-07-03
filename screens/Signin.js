import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';
import ButtonColorHighlight from '../components/ButtonColorHighlight';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Flow } from 'react-native-animated-spinkit';
import Logo from '../components/Logo'; // Import the Logo component

const Signin = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const { onSignin, onSignup } = useAuthUser();
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
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
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
    <View style={styles.container}>
      {loading && (
        <View style={styles.spinnerContainer}>
          <Flow size={48} color='green' />
        </View>
      )}
      {!loading && (
        <>
          <Logo
            shapeSource={require('../assets/shapes/lizard.png')}
            shapePosition="right"
            shapePositionValue={50}
            shapePositionVerticalValue={-30}
            fontColor="black" // Customize font color here
            shapeColor="black" // Customize shape color here
            shapeHeight={100}
            shapeWidth={100}
          />
          <Text style={styles.appDescription}>
            a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about
            <TouchableOpacity onPress={toggleMode}>
              <FontAwesome name="arrow-right" size={16} color="transparent" />
            </TouchableOpacity>
          </Text>

          <View style={styles.form}>
            {!isSignIn && (
              <TextInput
                style={[styles.input, isEmailFocused && styles.inputFocused]}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
                onSubmitEditing={handleEmailSubmit}
                ref={emailInputRef}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
            )}
            <TextInput
              style={[styles.input, isUsernameFocused && styles.inputFocused]}
              placeholder="Username"
              onChangeText={(text) => setUsername(text)}
              value={username}
              onSubmitEditing={handleUsernameSubmit}
              ref={usernameInputRef}
              onFocus={() => setIsUsernameFocused(true)}
              onBlur={() => setIsUsernameFocused(false)}
            />
            <TextInput
              style={[styles.input, isPasswordFocused && styles.inputFocused]}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              value={password}
              ref={passwordInputRef}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            {!isSignIn && (
              <TextInput
                style={[styles.input, isPasswordFocused && styles.inputFocused]}
                placeholder="Verify Password"
                secureTextEntry={true}
                onChangeText={(text) => setVerifyPassword(text)}
                value={verifyPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
            )}
            {!loading && (
              <>
                <ButtonColorHighlight
                  onPress={handleAuthentication}
                  title={isSignIn ? "Sign in" : "Create account"}
                  shapeSource={require('../assets/shapes/colorfultriangles.png')}
                  shapeWidth={200}
                  shapeHeight={200}
                  shapePosition="left"
                  shapePositionValue={-74}
                  shapePositionVerticalValue={-60}
                  fontColor="white"
                />
                <Text style={styles.toggleButton} onPress={toggleMode}>{isSignIn ? "Create account" : "Go back to sign in"}</Text>
                {signUpSuccess && (
                  <Text style={styles.successMessage}>Sign up successful! Please log in.</Text>
                )}
              </>
            )}
          </View>
        </>
      )}
    </View>
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
    borderRadius: 20,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: 'black',
  },
  inputFocused: {
    borderColor: 'orange',
    borderWidth: 2,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
    backgroundColor: 'white',
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
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
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
