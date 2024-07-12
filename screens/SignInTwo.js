import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';
import ButtonColorHighlight from '../components/ButtonColorHighlight';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Flow } from 'react-native-animated-spinkit';
import Logo from '../components/Logo';
import BubbleChatSvg from '../assets/svgs/bubble-chat.svg'; // Import the SVG

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
          <Flow size={48} color="green" />
        </View>
      )}
      {!loading && (
        <>
          <Logo
            shapeSource={require('../assets/shapes/lizard.png')}
            shapePosition="right"
            shapePositionValue={50}
            shapePositionVerticalValue={-30}
            fontColor="black"
            shapeColor="black"
            shapeHeight={100}
            shapeWidth={100}
            accessible={true}
            accessibilityLabel="App Logo"
            accessibilityHint="This is the logo of the app"
          />
          <BubbleChatSvg width={100} height={100} /> {/* Use the SVG here */}
          <Text
            style={styles.appDescription}
            accessible={true}
            accessibilityLabel="App description"
            accessibilityHint="Description of the app functionality"
            allowFontScaling={true}
          >
            a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about
            <TouchableOpacity
              onPress={toggleMode}
              accessible={true}
              accessibilityLabel="Toggle sign in and sign up mode"
              accessibilityHint="Toggles between sign in and sign up forms"
            >
              <FontAwesome name="arrow-right" size={16} color="transparent" />
            </TouchableOpacity>
          </Text>

          <View style={styles.form} accessible={true} accessibilityLabel="Form container">
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
                accessible={true}
                accessibilityLabel="Email input"
                accessibilityHint="Enter your email address"
                importantForAccessibility="yes"
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
              accessible={true}
              accessibilityLabel="Username input"
              accessibilityHint="Enter your username"
              importantForAccessibility="yes"
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
              accessible={true}
              accessibilityLabel="Password input"
              accessibilityHint="Enter your password"
              importantForAccessibility="yes"
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
                  title={isSignIn ? 'Sign in' : 'Create account'}
                  shapeSource={require('../assets/shapes/colorfultriangles.png')}
                  shapeWidth={200}
                  shapeHeight={200}
                  shapePosition="left"
                  shapePositionValue={-74}
                  shapePositionVerticalValue={-60}
                  shapeSource={require('../assets/shapes/redheadcoffee.png')}
                  shapeWidth={200}
                  shapeHeight={200}
                  shapePosition="left"
                  shapePositionValue={-34}
                  shapePositionVerticalValue={-40}
                  shapeSource={require('../assets/shapes/coffeecupdarkheart.png')}
                  shapeWidth={190}
                  shapeHeight={190}
                  shapePosition="left"
                  shapePositionValue={-28}
                  shapePositionVerticalValue={-20}
                  accessible={true}
                  accessibilityLabel={isSignIn ? 'Sign in button' : 'Create account button'}
                  accessibilityHint={isSignIn ? 'Press to sign in' : 'Press to create a new account'}
                />
                <Text
                  style={styles.toggleText}
                  onPress={toggleMode}
                  accessible={true}
                  accessibilityLabel="Toggle sign in and sign up"
                  accessibilityHint="Switch between sign in and sign up forms"
                >
                  {isSignIn ? 'Create an account' : 'Sign in instead'}
                </Text>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 50,
  },
  appDescription: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontFamily: 'Poppins-Regular',
  },
  inputFocused: {
    borderColor: 'green',
  },
  toggleText: {
    textAlign: 'center',
    color: 'green',
    marginTop: 20,
    fontFamily: 'Poppins-Bold',
  },
});

export default Signin;
