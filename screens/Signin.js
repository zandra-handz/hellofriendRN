import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';
import ButtonColorHighlight from '../components/ButtonColorHighlight';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for storing authentication token
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { Flow } from 'react-native-animated-spinkit';

const CustomButton = ({ onPress, title }) => (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

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
    const navigation = useNavigation(); // Get navigation object

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
        // Check if the user is already signed in upon component mount
        checkIfSignedIn();
    }, []);

    const checkIfSignedIn = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                // Redirect the user to the home screen or any authenticated screen
                // For example:
                // navigation.navigate('Home');
            }
        } catch (error) {
            console.error('Error checking authentication status:', error);
        }
    };

    if (!fontsLoaded) {
        return <ActivityIndicator />;
    }

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
            console.log(result);
            if (result && result.status === 201) {
                // Successful sign-up
                alert("Sign up was successful!");
                setSignUpSuccess(true);
                setLoading(false);
                navigation.navigate('Signin'); // Navigate back to the sign-in page
            } else if (result && result.error) {
                // Error handling
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>hellofr::nd</Text>
            <Text style={styles.appDescription}>
                Stash thoughts and stories to share with a friend for later, get reminders to reach out, and speedily find mutually closeby meetup locations.
                <TouchableOpacity onPress={toggleMode}>
                    <FontAwesome name="arrow-right" size={16} color="black" />
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
                {loading ? (
                    <View style={styles.spinnerContainer}>
                        <Flow size={48} color='hotpink'/>
                    </View>
                ) : (
                    <>
                        <ButtonColorHighlight onPress={handleAuthentication} title={isSignIn ? "Sign in" : "Create account"} />
                        <Text style={styles.toggleButton} onPress={toggleMode}>{isSignIn ? "Create account" : "Go back to sign in"}</Text>
                        {signUpSuccess && (
                            <Text style={styles.successMessage}>Sign up successful! Please log in.</Text>
                        )}
                    </>
                )}
            </View>
            
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
        height: 44,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        fontFamily: 'Poppins-Regular',
        color: 'black',
    },
    inputFocused: {
        borderColor: '#ff69b4',
        borderWidth: 2,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: 6,
        backgroundColor: 'white',
        fontFamily: 'Poppins-Regular',
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Poppins-Bold',
    },
    appDescription: {
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
        fontFamily: 'Poppins-Regular',
    },
    buttonContainer: {
        backgroundColor: 'black',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 10,
        fontFamily: 'Poppins-Regular',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    toggleButton: {
        fontWeight: 'bold',
        color: 'black',
        marginTop: 2,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    spinnerContainer: {
        width: '100%',
        marginTop: 26,
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
