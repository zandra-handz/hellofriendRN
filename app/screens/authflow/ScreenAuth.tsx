import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, TextInput, StyleSheet, Text  } from "react-native";
import { useFocusEffect, useRoute, RouteProp } from "@react-navigation/native";

// app spinner
import LocalPeacefulGradientSpinner from "@/app/components/appwide/spinner/LocalPeacefulGradientSpinner";

// app context
import { useUser } from "@/src/context/UserContext";
import { useLDTheme } from "@/src/context/LDThemeContext";

//app sibling
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

// app hooks
import useSignIn from "@/src/hooks/UserCalls/useSignIn";
import useAppNavigations from "@/src/hooks/useAppNavigations"; 

// app components
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
import AuthScreenTopTray from "@/app/components/user/AuthScreenTopTray";
import AuthScreenHeader from "@/app/components/user/AuthScreenHeader";
import AuthInputWrapper from "@/app/components/user/AuthInputWrapper";
import AuthBottomButton from "@/app/components/appwide/button/AuthBottomButton";

//app static
import manualGradientColors from "@/src/hooks/StaticColors";

//app types
import { AuthScreenParams } from "@/src/types/ScreenPropTypes";
import { signin } from "@/src/calls/api";

const ScreenAuth = () => {
  const route = useRoute<RouteProp<Record<string, AuthScreenParams>, string>>();
  const usernameEntered = route.params?.usernameEntered ?? false;

  const { refetch } = useUser();
  const { onSignIn, signinMutation } = useSignIn({ refetchUser: refetch });

  const { navigateToNewAccount, navigateToRecoverCredentials } =
    useAppNavigations();
 
  const { lightDarkTheme } = useLDTheme();
  const [username, setUsername] = useState(usernameEntered);
  const [password, setPassword] = useState("");

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const placeholderTextColor = manualGradientColors.homeDarkColor;

  console.log("screen auth rerendered");

  const INPUTS_GAP = 4;
  const DELAY_BEFORE_FOCUS = 300;

  const handleUsernameFocus = () => setIsUsernameFocused(true);
  const handleUsernameBlur = () => setIsUsernameFocused(false);

  const handlePasswordFocus = () => setIsPasswordFocused(true);
  const handlePasswordBlur = () => setIsPasswordFocused(false);

  const handleFocusUsername = () => {
    setTimeout(() => {
      if (usernameInputRef && usernameInputRef?.current) {
        usernameInputRef.current.focus();
      }
    }, DELAY_BEFORE_FOCUS);
  };

  useFocusEffect(
    useCallback(() => {
      if (!signinMutation.isSuccess) {
        setUsername(usernameEntered);
        handleFocusUsername();
      }
    }, [usernameEntered, signinMutation.isSuccess])
  );

  useEffect(() => {
    if (signinMutation.isSuccess) {
      showFlashMessage(`Success!`, false, 2000);
    }
  }, [signinMutation.isSuccess]);

  useEffect(() => {
    if (signinMutation.isError) {
      showFlashMessage(`Oops! Couldn't sign in`, true, 2000);
      setPassword(null);
    }
  }, [signinMutation.isError]);

  const handleCreateNew = () => {
    console.log("rerendered create new");
    navigateToNewAccount({ usernameEntered: username });
  };

  const handleAuthentication = async () => {
    try {
      onSignIn(username, password);
    } catch (error) {
      console.error(error);
    }
  };

  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  const handleUsernameSubmit = () => {
    setUsernameSubmitted(true);
    setTimeout(() => {
      if (passwordInputRef.current && username) {
        passwordInputRef.current.focus();
      }
    }, DELAY_BEFORE_FOCUS);
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
    if (!text || text.length < 1) {
      setUsernameSubmitted(false);
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  return (

  <>
      <LocalPeacefulGradientSpinner loading={signinMutation.isPending || signinMutation.isLoading} label={'Signing in'}/>
 
    <PreAuthSafeViewAndGradientBackground
      startColor={manualGradientColors.darkColor}
      endColor={manualGradientColors.lightColor}
      friendColorLight={null}
      friendColorDark={null}
      friendId={null}
      includeCustomStatusBar={false}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      style={styles.container}
    >
        
      {!signinMutation.isPending && (
        <View
          style={styles.outerContainer}
        >
          <AuthScreenTopTray
            onBackPress={handleCreateNew}
            rightLabel={"Forgot password"}
            onRightPress={navigateToRecoverCredentials}
          />
          <AuthScreenHeader label={"Sign in"} />

          <View
            style={[styles.inputsContainer, { gap: INPUTS_GAP }]}
            accessible={true}
            accessibilityLabel="Form container"
          >
            <AuthInputWrapper
              condition={username}
              label={"Username"}
              children={
                <TextInput
                  style={[
                    styles.input,
                    isUsernameFocused && styles.inputFocused,
                    { color: manualGradientColors.homeDarkColor },
                  ]}
                  placeholder="Username"
                  placeholderTextColor={placeholderTextColor}
                  // autoFocus={true}
                  autoFocus={false}
                  onChangeText={handleUsernameChange}
                  value={username}
                  onSubmitEditing={handleUsernameSubmit}
                  ref={usernameInputRef}
                  onPress={handleUsernameFocus}
                  onFocus={handleUsernameFocus}
                  onBlur={handleUsernameBlur}
                  accessible={true}
                  autoComplete={"username"}
                  accessibilityLabel="Username input"
                  accessibilityHint="Enter your username"
                  importantForAccessibility="yes"
                  enterKeyHint={"next"}
                />
              }
            />

            {username && usernameSubmitted && (
              <AuthInputWrapper
                condition={password}
                label={"Password"}
                children={
                  <TextInput
                    style={[
                      styles.input,
                      isPasswordFocused && styles.inputFocused,
                      { color: manualGradientColors.homeDarkColor },
                    ]}
                    placeholder="Password"
                    placeholderTextColor={placeholderTextColor}
                    // color={lightDarkTheme.primaryText}
                    autoFocus={false} //true
                    secureTextEntry={true}
                    onChangeText={handlePasswordChange}
                    onSubmitEditing={handleAuthentication}
                    autoComplete={"current-password"}
                    value={password}
                    ref={passwordInputRef}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    accessible={true}
                    accessibilityLabel="Password input"
                    accessibilityHint="Enter your password"
                    importantForAccessibility="yes"
                    enterKeyHint={"enter"}
                  />
                }
              />
            )}
          </View>
        </View>
      )}
      <View
        style={{
          width: "100%",
          bottom: 0,
          paddingHorizontal: 4,
        }}
      >
        {username && password && !signinMutation.isPending && (
          <AuthBottomButton
            onPress={handleAuthentication}
            title={"Sign in"}
            borderRadius={10}
            backgroundColor={manualGradientColors.homeDarkColor}
            labelColor={manualGradientColors.lightColor}
          />
        )}
      </View>
    </PreAuthSafeViewAndGradientBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  outerContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  inputsContainer: {
    height: 200,
    width: "100%",
    fontFamily: "Poppins-Regular",
    justifyContent: "flex-start",
    flex: 1,
  },
  input: {
    fontFamily: "Poppins-Regular",
    borderWidth: 2.6,
    padding: 10,
    paddingTop: 10,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    borderColor: "black",
    fontSize: 15,
  },
  inputFocused: {
    fontFamily: "Poppins-Regular",
    borderWidth: 3,
  },
  title: {
    fontSize: 62,
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
});

export default ScreenAuth;
