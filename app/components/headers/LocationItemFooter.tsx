import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text, Pressable, Alert } from "react-native";

import EscortBarMoments from "../moments/EscortBarMoments";

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

const LocationItemFooter: React.FC<Props> = ({
  userId,
  friendId,
  data,
  isPartialData, // if is partial then will add 'loaded' to total item count
  currentIndexValue,
  visibilityValue,
  height,
  totalItemCount,
  extraData, // JUST LOCATION ITEMS / currently distinguishing between other item types bc passed in functions are different
 
  onRightPress = () => {},
  onRightPressSecondAction = () => {}, // when extraData, this will send location item to send direction link text screen. need to get additionalData from cache (if exists) in this screen
  primaryColor,
  overlayColor,
  backgroundColor,
  dividerStyle,
  welcomeTextStyle,
  themeAheadOfLoading,
}) => {
  const [currentIndex, setCurrentIndex] = useState(false);

  const footerPaddingBottom = 20;
  // const footerIconSize = 28;
  // console.log(`extra data`, extraData);
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

  const handleScrollToNext = () => {
    if (currentIndex === undefined) {
      return;
    }

    const next = currentIndex + 1;
    const nextExists = next < totalCount;
    const scrollToIndex = nextExists ? next : 0;
    if (scrollToIndex > 0) {
      // DISALLOW SCROLLING BACK TO ONE GIVEN THAT THIS LIST COULD BE VERY LONG
      scrollTo(scrollToIndex);
    }
  };

  const handleScrollToPrev = () => {
    if (currentIndex === undefined) {
      return;
    }

    if (currentIndex === 0) {
      return;
    }
    const prev = currentIndex - 1;
    console.log(totalCount - 1);
    const scrollToIndex = currentIndex <= 0 ? totalCount - 1 : prev;
    scrollTo(scrollToIndex);
    console.log(currentIndex);
  };

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
            height: height,
            paddingBottom: footerPaddingBottom,
            // backgroundColor: overlayColor,
          },
          visibilityStyle,
        ]}
      >
        <EscortBarMoments
          primaryColor={primaryColor}
          primaryBackground={backgroundColor}
          onLeftPress={handleScrollToPrev}
          onRightPress={handleScrollToNext}
          includeSendButton={true}
          children={
            <>
              <>
                {extraData &&
                  extraData?.userAddress &&
                  extraData?.friendAddress && (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={[
                          welcomeTextStyle,
                          { color: primaryColor, fontSize: 44 },
                        ]}
                      >
                        {currentIndex + 1}
                        <Text
                          style={[
                            welcomeTextStyle,
                            { color: primaryColor, fontSize: 22 },
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
                        welcomeTextStyle,
                        { color: primaryColor, fontSize: 44 },
                      ]}
                    >
                      {currentIndex + 1}
                      <Text
                        style={[
                          welcomeTextStyle,
                          { color: primaryColor, fontSize: 22 },
                        ]}
                      >
                        {/* /{data.length}{" "} */}/{totalCount}{" "}
                        {isPartialData ? "loaded" : "total"}
                      </Text>
                    </Text>
                  </View>
                )}
              </>

              <>
                <View style={[styles.divider, dividerStyle]} />
                <View style={{ flex: 1 }}>
                  <>
                    {extraData &&
                      extraData?.userAddress &&
                      extraData?.friendAddress && (
                        <LocationTravelTimes
                          userId={userId}
                          friendId={friendId}
                          location={item}
                          userAddress={extraData.userAddress}
                          friendAddress={extraData.friendAddress}
                          themeAheadOfLoading={themeAheadOfLoading}
                          primaryColor={primaryColor}
                        />
                      )}
                    {/* {!extraData && (
                      <Pressable
                        onPress={handleRightPress}
                        style={({ pressed }) => ({
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: pressed ? 0.6 : 1,
                        })}
                      >
                        <MaterialCommunityIcons
                          name="send"
                          size={50}
                          color={primaryColor}
                        />
                      </Pressable>
                    )} */}
                  </>
                </View>
              </>

              {extraData && (
                <>
                  <View style={[styles.divider, dividerStyle]} />
                  <View style={{ flex: 1 }}>
                    <Pressable
                      onPress={onRightPressSecondAction}
                      style={({ pressed }) => ({
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: pressed ? 0.6 : 1,
                      })}
                    >
                      <MaterialCommunityIcons
                        name="send"
                        size={50}
                        color={primaryColor}
                      />
                    </Pressable>
                  </View>
                </>
              )}
            </>
          }
        />
      </Animated.View>
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

export default LocationItemFooter;
