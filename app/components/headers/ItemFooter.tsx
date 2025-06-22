import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet, Text, Pressable, Alert } from "react-native";

// app state
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

// app components
import AboutAppModal from "./AboutAppModal";
import ReportIssueModal from "./ReportIssueModal";
import SettingsModal from "./SettingsModal";

// app display/templates
import FooterButtonIconVersion from "./FooterButtonIconVersion";

import ButtonData from "../buttons/scaffolding/ButtonData";
import { useNavigationState } from "@react-navigation/native";

import FriendProfileButton from "../buttons/friends/FriendProfileButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import LocationTravelTimes from "../locations/LocationTravelTimes";

interface Props {
  location: object;
  visibilityValue: SharedValue;
  currentIndexValue: SharedValue;
  extraData: object;
}

const ItemFooter = ({
  data,
  currentIndexValue,
  visibilityValue,
  extraData, // JUST LOCATION ITEMS / currently distinguishing between other item types bc passed in functions are different
  onRightPress = () => {},
  onRightPressSecondAction = () => {}, // when extraData, this will send location item to send direction link text screen. need to get additionalData from cache (if exists) in this screen
}) => {
  const navigationState = useNavigationState((state) => state);
  const { onSignOut } = useUser();
  const currentRouteName = navigationState.routes[navigationState.index]?.name;
  const isOnActionPage = currentRouteName === "hellofriend";
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { selectedFriend, deselectFriend } = useSelectedFriend();

  // const userAddress = extraData.userAddress;
  // const friendAddress = extraData.friendAddress;
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(false);
  //   useEffect(() => {
  //     if (location) {
  //       console.log(`location in footer`, location.title);
  //     }
  //   }, [location]);

  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 20;
  const footerIconSize = 28;

  // buttons rendered in callbacks, all using the same template except for the friend profile button
  const RenderSignOutButton = useCallback(
    () => (
      <FooterButtonIconVersion
        confirmationRequired={true}
        confirmationTitle={"Just to be sure"}
        confirmationMessage={"Sign out?"}
        // label="Deselect"
        label="Sign out"
        icon={
          <MaterialCommunityIcons
            // name={"keyboard-backspace"}
            name={"logout"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={() => onSignOut()}
      />
    ),
    []
  );
  useAnimatedReaction(
    () => currentIndexValue.value,
    (newIndex, prevIndex) => {
      if (newIndex !== prevIndex) {
        runOnJS(setCurrentIndex)(newIndex);
      }
    },
    []
  );

  const handleRightPress = () => {
    onRightPress();

    setTimeout(async () => {
      try {
        Alert.alert("!", "Did you send this image?", [
          {
            text: "No, please keep",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Yes, delete", onPress: () => onRightPressSecondAction() },
        ]);
      } catch (error) {
        console.error("Error deleting shared image:", error);
      }
    }, 2000);
  };

  const visibilityStyle = useAnimatedStyle(() => {
    return { opacity: visibilityValue.value };
  });

  const item = useMemo(() => {
    return data[currentIndex];
  }, [currentIndex, data]);

  const RenderDeselectButton = useCallback(
    () => (
      <FooterButtonIconVersion
        confirmationRequired={true}
        confirmationTitle={"Just to be sure"}
        confirmationMessage={"Deselect friend?"}
        // label="Deselect"
        label="Home"
        icon={
          <MaterialCommunityIcons
            // name={"keyboard-backspace"}
            name={"home-outline"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={() => deselectFriend()}
      />
    ),
    []
  );

  const RenderSettingsButton = useCallback(
    () => (
      <FooterButtonIconVersion
        label="Settings"
        icon={
          <MaterialIcons
            name={"settings-suggest"} // might just want to use 'settings' here, not sure what 'settings-suggest' actually means, just looks pretty
            //  name={"app-settings-alt"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={() => setSettingsModalVisible(true)}
      />
    ),
    []
  );

  const RenderReportIssueButton = useCallback(
    () => (
      <FooterButtonIconVersion
        label="Report"
        icon={
          <MaterialCommunityIcons
            name={"bug-outline"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={() => setReportModalVisible(true)}
      />
    ),
    []
  );

  const RenderAboutAppButton = useCallback(
    () => (
      <FooterButtonIconVersion
        label="About"
        icon={
          <MaterialCommunityIcons
            name={"information-outline"}
            size={footerIconSize}
            color={themeStyles.footerIcon.color}
          />
        }
        onPress={() => setAboutModalVisible(true)}
      />
    ),
    []
  );

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            height: footerHeight,
            paddingBottom: footerPaddingBottom,
            backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          },
          visibilityStyle,
        ]}
      >
        {/* <View style={styles.section}>
            {
              !selectedFriend ? (
                <RenderSignOutButton />
              ) : (
                <RenderDeselectButton />
              ) 
            }
          </View>  */}

        <View style={[styles.divider, themeStyles.divider]} />
        <>
          {extraData && extraData?.userAddress && extraData?.friendAddress && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.welcomeText,
                  { fontSize: 44 },
                ]}
              >
                {currentIndex + 1}
                <Text
                  style={[
                    themeStyles.primaryText,
                    appFontStyles.welcomeText,
                    { fontSize: 22 },
                  ]}
                >
                  /{data.length}{" "}
                </Text>
              </Text>
            </View>
          )}
          {!extraData && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.welcomeText,
                  { fontSize: 44 },
                ]}
              >
                {currentIndex + 1}
                <Text
                  style={[
                    themeStyles.primaryText,
                    appFontStyles.welcomeText,
                    { fontSize: 22 },
                  ]}
                >
                  /{data.length}{" "}
                </Text>
              </Text>
            </View>
          )}
        </>

        <View style={[styles.divider, themeStyles.divider]} />
        <View style={{ flex: 1 }}>
          <>
            {extraData &&
              extraData?.userAddress &&
              extraData?.friendAddress && (
                <LocationTravelTimes
                  location={item}
                  userAddress={extraData.userAddress}
                  friendAddress={extraData.friendAddress}
                />
              )}
            {!extraData && (
              <Pressable
                onPress={handleRightPress}
                style={({ pressed }) => ({
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.6 : 1, // optional visual feedback
                })}
              >
                <MaterialCommunityIcons
                  name="send"
                  size={50}
                  color={themeStyles.primaryText.color}
                />
                {/* <Text style={[themeStyles.primaryText, appFontStyles.welcomeText, {fontSize: 44}]}>{currentIndex + 1}<Text style={[themeStyles.primaryText, appFontStyles.welcomeText, {fontSize: 22}]}>
              
             /{data.length} </Text></Text> */}
              </Pressable>
            )}
          </>
        </View>
        {extraData && (
          <>
            <View style={[styles.divider, themeStyles.divider]} />
            <View style={{ flex: 1 }}>
             
              <Pressable
                onPress={onRightPressSecondAction}
                style={({ pressed }) => ({
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.6 : 1, // optional visual feedback
                })}
              >
                <MaterialCommunityIcons
                  name="send"
                  size={50}
                  color={themeStyles.primaryText.color}
                />
                {/* <Text style={[themeStyles.primaryText, appFontStyles.welcomeText, {fontSize: 44}]}>{currentIndex + 1}<Text style={[themeStyles.primaryText, appFontStyles.welcomeText, {fontSize: 22}]}>
              
             /{data.length} </Text></Text> */}
              </Pressable>
            </View>
          </>
        )}
      </Animated.View>

      {settingsModalVisible && (
        <View>
          <SettingsModal
            isVisible={settingsModalVisible}
            closeModal={() => setSettingsModalVisible(false)}
          />
        </View>
      )}

      {aboutModalVisible && (
        <View>
          <AboutAppModal
            isVisible={aboutModalVisible}
            closeModal={() => setAboutModalVisible(false)}
          />
        </View>
      )}

      {reportModalVisible && (
        <View>
          <ReportIssueModal
            isVisible={reportModalVisible}
            closeModal={() => setReportModalVisible(false)}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 1,
  },
  section: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    marginVertical: 10,
  },
});

export default ItemFooter;
