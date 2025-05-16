import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";

// state
import { useUser } from "@/src/context/UserContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

// nav
import { useNavigation } from "@react-navigation/native";

// UI
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

const PulsatingArrow = () => {
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    pulse();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
      <FontAwesome name="angle-right" size={46} color="black" />
    </Animated.View>
  );
};

const ScreenOnboardingOne = ({ messageContent }) => {
  // Receive messageContent as props
  const { themeStyles, manualGradientColors } = useGlobalStyle();

  const { user } = useUser();
  const navigation = useNavigation();
  const goToNextScreen = () => {
    navigation.navigate("Two");
  };

  return (
    <LinearGradient
      colors={[manualGradientColors.darkColor, manualGradientColors.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, themeStyles.signinContainer]}
    >
      <Text style={styles.title}>Hi {user.user.username}!</Text>
      <Text style={styles.message}>{messageContent}</Text>

      <TouchableOpacity onPress={goToNextScreen}>
        <PulsatingArrow />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // Add horizontal padding
  },
  buttonContainer: {
    flexDirection: "row", // Arrange buttons horizontally
    justifyContent: "flex-end", // Align button to the right
    width: "100%",
  },
  alertButton: {
    marginTop: 20,
    padding: 16,
    borderColor: "#1E90FF",
    borderBlockEndColor: "#39f0df",
    borderBlockStartColor: "#39f0df",
    borderWidth: 2,
    backgroundColor: "black", // Darker sky blue color with slight purplish tint
    borderRadius: 30, // Border radius of 18
  },
  alertButtonText: {
    color: "white",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  message: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins-Regular",
  },
});

export default ScreenOnboardingOne;
