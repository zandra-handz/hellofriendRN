import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text,  Alert } from "react-native";

import EscortBarMoments from "../moments/EscortBarMoments";
import { AppFontStyles } from "@/app/styles/AppFonts"; 
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

const ItemFooter: React.FC<Props> = ({
  height,
  data,
  currentIndexValue,
  visibilityValue,

  totalItemCount,
  scrollTo,
  onRightPress = () => {},
  onRightPressSecondAction = () => {}, // when extraData, this will send location item to send direction link text screen. need to get additionalData from cache (if exists) in this screen
  primaryColor,
  backgroundColor,
}) => {
  const [currentIndex, setCurrentIndex] = useState(false);

  const footerPaddingBottom = 20;

  const fontStyle = AppFontStyles.welcomeText;

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
          onSendPress={handleRightPress}
          children={
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={[fontStyle, { color: primaryColor, fontSize: 44 }]}>
                {currentIndex + 1}
                <Text
                  style={[fontStyle, { color: primaryColor, fontSize: 22 }]}
                >
                  {/* /{data.length}{" "} */}/{totalCount}{" "}
                </Text>
              </Text>
            </View>
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
    zIndex: 1,
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },
});

export default ItemFooter;
