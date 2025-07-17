import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text, Pressable, Alert } from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import AboutAppModal from "./AboutAppModal";
import ReportIssueModal from "./ReportIssueModal";
import SettingsModal from "./SettingsModal";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import LocationTravelTimes from "../locations/LocationTravelTimes";

interface Props {
  data: object;
   isPartialData?: boolean;
  visibilityValue: SharedValue;
  currentIndexValue: SharedValue;
 
  extraData: object;
  totalItemCount?: number;
  useButtons: boolean;
  onRightPress: () => void;
  onRightPressSecondAction: () => void;
}

const ItemFooter: React.FC<Props> = ({
  data,
  isPartialData, // if is partial then will add 'loaded' to total item count
  currentIndexValue,
  visibilityValue,
  
  totalItemCount,
  extraData, // JUST LOCATION ITEMS / currently distinguishing between other item types bc passed in functions are different
  useButtons = true,
  onRightPress = () => {},
  onRightPressSecondAction = () => {}, // when extraData, this will send location item to send direction link text screen. need to get additionalData from cache (if exists) in this screen
}) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();

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
 
  const totalCount = totalItemCount
    ? totalItemCount
    : data?.length
      ? data.length
      : 0;

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
        {/* {useButtons && 
        <View style={[styles.divider, themeStyles.divider]} />} */}
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
                  {/* /{totalCount}{" "}{isPartialData && "loaded"} */}
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
                  {/* /{data.length}{" "} */}/{totalCount}{" "}{isPartialData ? "loaded" : "total"}
                </Text>
              </Text>
            </View>
          )}
        </>

        {useButtons && (
          <>
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
                {!extraData && useButtons && (
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
          </>
        )}
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
  divider: {
    marginVertical: 10,
  },
});

export default ItemFooter;
