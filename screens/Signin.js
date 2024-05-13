import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';
import ButtonColorHighlight from '../components/ButtonColorHighlight';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from expo vector icons

const CustomButton = ({ onPress, title }) => (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const Signin = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // Add email state
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // State to track loading status
    const [isSignIn, setIsSignIn] = useState(true); // State to track whether it's sign-in or sign-up mode
    const { onSignin, onSignup } = useAuthUser();
    const usernameInputRef = useRef(null); // Create a ref for the username input field
    const passwordInputRef = useRef(null); // Create a ref for the password input field
    const emailInputRef = useRef(null); // Create a ref for the email input field
    const [isUsernameFocused, setIsUsernameFocused] = useState(false); // State to track focus state of username field
    const [isPasswordFocused, setIsPasswordFocused] = useState(false); // State to track focus state of password field
    const [isEmailFocused, setIsEmailFocused] = useState(false); // State to track focus state of email field

    // Load custom fonts
    const [fontsLoaded] = useFonts({
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    });

    useEffect(() => {
        // Focus on the username input field when the component mounts
        if (usernameInputRef.current) {
            usernameInputRef.current.focus();
        }
    }, []); // Empty dependency array ensures this effect runs only once, when the component mounts

    if (!fontsLoaded) {
        return <ActivityIndicator />;
    }

    const handleAuthentication = async () => {
        setLoading(true); // Set loading to true when authentication process starts
        let result;
        if (isSignIn) {
            result = await onSignin(username, password);
        } else {
            result = await onSignup(username, email, password); // Include email in signup call
        }
        setLoading(false); // Set loading to false when authentication process completes
        if (result && result.error) {
            alert(result.msg);
        }
    };

    const toggleMode = () => {
        setUsername(''); // Reset form fields
        setEmail(''); // Reset email field
        setPassword('');
        setIsSignIn(prevState => !prevState); // Toggle between sign-in and sign-up mode
    };

    const handleUsernameSubmit = () => {
        // When "Enter" is pressed in the username input, focus on the password input
        if (passwordInputRef.current) {
            passwordInputRef.current.focus();
        }
    };

    const handleEmailSubmit = () => {
        // When "Enter" is pressed in the email input, focus on the password input
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
                {!isSignIn && ( // Render email input field only in signup mode
                    <TextInput
                        style={[styles.input, isEmailFocused && styles.inputFocused]} // Apply focused style if isEmailFocused is true
                        placeholder="Email"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        onSubmitEditing={handleEmailSubmit} // Call handleEmailSubmit when "Enter" is pressed
                        ref={emailInputRef} // Set the ref for the email input field
                        onFocus={() => setIsEmailFocused(true)} // Set isEmailFocused to true when input is focused
                        onBlur={() => setIsEmailFocused(false)} // Set isEmailFocused to false when input loses focus
                    />
                )}
                <TextInput
                    style={[styles.input, isUsernameFocused && styles.inputFocused]} // Apply focused style if isUsernameFocused is true
                    placeholder="Username"
                    onChangeText={(text) => setUsername(text)}
                    value={username}
                    onSubmitEditing={handleUsernameSubmit} // Call handleUsernameSubmit when "Enter" is pressed
                    ref={usernameInputRef} // Set the ref for the username input field
                    onFocus={() => setIsUsernameFocused(true)} // Set isUsernameFocused to true when input is focused
                    onBlur={() => setIsUsernameFocused(false)} // Set isUsernameFocused to false when input loses focus
                />
                <TextInput
                    style={[styles.input, isPasswordFocused && styles.inputFocused]} // Apply focused style if isPasswordFocused is true
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    ref={passwordInputRef} // Set the ref for the password input field
                    onFocus={() => setIsPasswordFocused(true)} // Set isPasswordFocused to true when input is focused
                    onBlur={() => setIsPasswordFocused(false)} // Set isPasswordFocused to false when input loses focus
                />
                {loading ? ( // Conditionally render spinner when loading is true
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <ButtonColorHighlight onPress={handleAuthentication} title={isSignIn ? "Sign in" : "Create account"} />
                        <Text style={styles.toggleButton} onPress={toggleMode}>{isSignIn ? "Create account" : "Go back to sign in"}</Text>
                    </>
                )}
            </View>
            
        </View>
    );
};

// Inside the styles constant
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
        color: 'black', // Set text color to black
    },
    inputFocused: {
        borderColor: '#ff69b4', // Change border color to hot pink when input is focused
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
    }
});


export default Signin;
