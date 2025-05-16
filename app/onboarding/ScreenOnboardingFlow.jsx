import React, { useState } from "react";
import { useUser } from "@/src/context/UserContext";
import { useFriendList } from "@/src/context/FriendListContext"; // Importing useFriendList hook
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import {
  Button,
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import HelloFriendFooterOneButton from "@/app/components/helloes/HelloFriendFooterOneButton";

import ProgressBarOnboarding from "./ProgressBarOnboarding";
import ButtonSpecialAlert from "@/app/components/buttons/scaffolding/ButtonSpecialAlert";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import ScreenOnboardingOne from "./ScreenOnboardingOne";
import ScreenOnboardingTwo from "./ScreenOnboardingTwo";
import ScreenOnboardingThree from "./ScreenOnboardingThree";
import ScreenOnboardingFour from "./ScreenOnboardingFour";
import ScreenOnboardingFive from "./ScreenOnboardingFive";
import ScreenOnboardingIntermediary from "./ScreenOnboardingIntermediary"; // Import the intermediary component
import ScreenOnboardingComplete from "./ScreenOnboardingComplete";
import { LinearGradient } from "expo-linear-gradient";

const Stack = createNativeStackNavigator();

const HeaderProgress = ({ percentage }) => {
  return (
    <View style={styles.progressBarContainer}>
      <ProgressBarOnboarding percentage={percentage} />
    </View>
  );
};

const ScreenOnboardingFlow = () => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  //const { darkColor, lightColor } = gradientColors;
  const { friendList } = useFriendList();
  const [finalizingData, setFinalizingData] = useState({});
  const { onSignOut } = useUser();

  const navigation = useNavigation(0);

  const handleSignOutPress = () => {
    onSignOut();
  };

  const handleFriendNameChange = (friendName) => {
    setFinalizingData((prevData) => ({ ...prevData, friendName }));
  };

  const handleFriendEffortChange = (friendEffort) => {
    setFinalizingData((prevData) => ({ ...prevData, friendEffort }));
  };

  const handleFriendPriorityChange = (friendPriority) => {
    setFinalizingData((prevData) => ({ ...prevData, friendPriority }));
  };

  const handleFriendDateChange = (friendDate) => {
    console.log("Friend Date Updated:", friendDate);
    setFinalizingData((prevData) => ({ ...prevData, friendDate }));
  };

  const handleThoughtCapsuleChange = (thoughtCapsule) => {
    setFinalizingData((prevData) => ({ ...prevData, thoughtCapsule }));
  };

  const handleCategoryChange = (category) => {
    setFinalizingData((prevData) => ({ ...prevData, category }));
  };

  const handleGoToCompletePage = () => {
    navigation.navigate("Complete");
  };

  const resetFinalizingData = () => {
    setFinalizingData(null); // Reset finalizingData to null
  };

  return (
    <>
      <LinearGradient
        colors={[
          manualGradientColors.darkColor,
          manualGradientColors.lightColor,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, themeStyles.signinContainer]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // adjust the offset for iOS status bar
        >
          <Stack.Navigator
            screenOptions={{
              cardStyle: {
                backgroundColor: "transparent", // Set your desired background color
              },
            }}
          >
            <Stack.Screen
              name="One"
              component={({ route }) => {
                const { friendList } = useFriendList(); // Retrieve friendList from context
                const messageContent =
                  friendList.length > 0
                    ? "Your account is ready!"
                    : "Thanks for signing up! Please add your first friend to start using hellofriend.";

                return <ScreenOnboardingOne messageContent={messageContent} />;
              }}
              options={({ route, navigation }) => {
                return {
                  header: (props) => (
                    <View>
                      {friendList.length < 1 && (
                        <HeaderProgress percentage={0.1} {...props} />
                      )}
                      {friendList.length > 0 && (
                        <>
                          <HeaderProgress percentage={1} {...props} />
                        </>
                      )}
                    </View>
                  ),
                };
              }}
            />

            <Stack.Screen
              name="Two"
              options={({ navigation }) => ({
                header: (props) => (
                  <View>
                    {friendList.length < 1 && (
                      <HeaderProgress percentage={0.2} {...props} />
                    )}
                    {friendList.length > 0 && (
                      <>
                        <HeaderProgress percentage={1} {...props} />
                      </>
                    )}
                  </View>
                ),
              })}
            >
              {(props) => (
                <ScreenOnboardingTwo
                  {...props}
                  onChange={handleFriendNameChange}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="Three"
              options={({ navigation }) => ({
                header: (props) => (
                  <View>
                    {friendList.length < 1 && (
                      <HeaderProgress percentage={0.4} {...props} />
                    )}
                    {friendList.length > 0 && (
                      <>
                        <HeaderProgress percentage={1} {...props} />
                      </>
                    )}
                  </View>
                ),
              })}
            >
              {(props) => (
                <ScreenOnboardingThree
                  {...props}
                  onEffortChange={handleFriendEffortChange}
                  onPriorityChange={handleFriendPriorityChange}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="Four"
              options={({ navigation }) => ({
                header: (props) => (
                  <View>
                    {friendList.length < 1 && (
                      <HeaderProgress percentage={0.6} {...props} />
                    )}
                    {friendList.length > 0 && (
                      <>
                        <HeaderProgress percentage={1} {...props} />
                        <View style={styles.completeButtonContainer}>
                          <ButtonSpecialAlert
                            title="Finialize account"
                            onPress={() => navigation.navigate("Complete")}
                          />
                        </View>
                      </>
                    )}
                  </View>
                ),
              })}
            >
              {(props) => (
                <ScreenOnboardingFour
                  {...props}
                  onChange={handleFriendDateChange}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="Five"
              options={({ navigation }) => ({
                header: (props) => (
                  <View>
                    {friendList.length < 1 && (
                      <HeaderProgress percentage={0.86} {...props} />
                    )}
                    {friendList.length > 0 && (
                      <>
                        <HeaderProgress percentage={1} {...props} />
                        <View style={styles.completeButtonContainer}>
                          <ButtonSpecialAlert
                            title="Finialize account"
                            onPress={() => navigation.navigate("Complete")}
                          />
                        </View>
                      </>
                    )}
                  </View>
                ),
              })}
            >
              {(props) => (
                <ScreenOnboardingFive
                  {...props}
                  onChange={handleThoughtCapsuleChange}
                  onCategoryChange={handleCategoryChange}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Intermediary" // Name the intermediary screen
              options={{
                headerShown: false, // Hide header for the intermediary screen
              }}
            >
              {(props) => (
                <ScreenOnboardingIntermediary
                  {...props}
                  finalizingData={finalizingData} // Pass finalizingData to ScreenOnboardingIntermediary
                  resetFinalizingData={resetFinalizingData}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="Complete"
              options={{
                header: (props) => <HeaderProgress percentage={1} {...props} />,
              }}
            >
              {(props) => {
                console.log("finalizingData:", finalizingData); // Log finalizingData before rendering
                return (
                  <ScreenOnboardingComplete
                    {...props}
                    finalizingData={finalizingData}
                    resetFinalizingData={resetFinalizingData}
                  />
                );
              }}
            </Stack.Screen>
          </Stack.Navigator>
          <View style={styles.bottomButtonsContainer}>
            <View style={styles.exitButtonContainer}>
              <Button
                title="Exit"
                onPress={handleSignOutPress}
                color="#1E90FF"
                borderColor="black"
                borderWidth={4}
              />
            </View>
          </View>
          <View style={styles.footerContainer}>
            <HelloFriendFooterOneButton
              buttonText={"Finish"}
              onPress={() => navigation.navigate("Complete")}
            />
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  progressBarContainer: {
    marginTop: 0,
  },

  completeButtonContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 10,
  },

  completeButton: {
    borderRadius: 20,
  },

  exitButtonContainer: {
    marginTop: 0,
  },
  footerContainer: { backgroundColor: "transparent" },
});

export default ScreenOnboardingFlow;
