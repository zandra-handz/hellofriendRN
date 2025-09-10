import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text, Pressable, Alert } from "react-native";
import EscortBarMoments from "../../moments/EscortBarMoments";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

interface Props {
  data: object;

  visibilityValue: SharedValue;
  currentIndexValue: SharedValue;

  totalItemCount?: number;
  useButtons: boolean;
  onRightPress: () => void;
  onRightPressSecondAction: () => void;
}

const ItemFooterHelloes: React.FC<Props> = ({
  data,
  currentIndexValue,
  visibilityValue,

  totalItemCount,
  // JUST LOCATION ITEMS / currently distinguishing between other item types bc passed in functions are different
  useButtons = true,
  onRightPress = () => {},
  onRightPressSecondAction = () => {}, // when extraData, this will send location item to send direction link text screen. need to get additionalData from cache (if exists) in this screen
  primaryColor,
  overlayColor,
  dividerStyle,
  welcomeTextStyle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(false);
  //   useEffect(() => {
  //     if (location) {
  //       console.log(`location in footer`, location.title);
  //     }
  //   }, [location]);

  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 20;
  // const footerIconSize = 28;

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
            backgroundColor: overlayColor,
          },
          visibilityStyle,
        ]}
      >
        <EscortBarMoments
          primaryColor={primaryColor}
          primaryBackground={"orange"}
          onLeftPress={handleRightPress}
          onRightPress={handleRightPress}
          children={
            <>
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
                  </Text>
                </Text>
              </View>

              {useButtons && (
                <>
                  <View style={[styles.divider, dividerStyle]} />
                  <View style={{ flex: 1 }}>
                    <>
                      {useButtons && (
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
                      )}
                    </>
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

export default ItemFooterHelloes;
