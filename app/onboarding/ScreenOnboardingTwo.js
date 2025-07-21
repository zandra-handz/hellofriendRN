import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ButtonsOnboardingNav from "./ButtonsOnboardingNav";
import InputOnboarding from "./InputOnboarding";
import { fetchFriendList } from "@/src/calls/api";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { LinearGradient } from "expo-linear-gradient";

const ScreenOnboardingTwo = ({ onChange }) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const navigation = useNavigation();
  const [friendName, setFriendName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const goToNextScreen = async () => {
    try {
      const updatedFriendList = await fetchFriendList();
      console.log(updatedFriendList);
      const friendAlreadyExists = updatedFriendList.some(
        (friend) => friend.name === friendName.trim()
      );
      if (friendAlreadyExists) {
        alert("This friend already exists. Please enter a different name.");
      } else {
        navigation.navigate("Three");
        onChange(friendName);
      }
    } catch (error) {
      console.error("Failed to fetch friend list:", error);
    }
  };

  const goToPrevScreen = () => {
    navigation.navigate("One");
  };

  const handleFriendNameChange = (text) => {
    setFriendName(text);
  };

  const handleSubmitEditing = () => {
    goToNextScreen();
  };

  return (
    <LinearGradient
      colors={[manualGradientColors.darkColor, manualGradientColors.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, themeStyles.signinContainer]}
    >
      <View style={[styles.inputContainer, { backgroundColor: "transparent" }]}>
        <View>
          <Text style={styles.message}>
            1. Please enter the name of a friend you'd like to add.
          </Text>
          <InputOnboarding
            inputRef={inputRef}
            value={friendName}
            onChangeText={handleFriendNameChange}
            placeholder="Name"
            maxLength={30}
            onSubmitEditing={handleSubmitEditing}
          />
        </View>
      </View>

      <View style={styles.footerContainer}>
        <ButtonsOnboardingNav
          showPrevButton={true}
          showNextButton={friendName.trim().length > 0}
          onPrevPress={goToPrevScreen}
          onNextPress={goToNextScreen}
          iconColor={friendName.trim().length > 0 ? "hotpink" : "gray"}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  inputContainer: {
    paddingTop: 20,
    width: "100%",
  },
  completeButtonContainer: {
    alignItems: "center",
    width: "100%",
  },
  footerContainer: {
    bottom: 60,
    position: "absolute",
  },
  message: {
    fontSize: 20,
    textAlign: "left",
    paddingBottom: 20,
    paddingHorizontal: 10,
    fontFamily: "Poppins-Regular",
  },
});

export default ScreenOnboardingTwo;
