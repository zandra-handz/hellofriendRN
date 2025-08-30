import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text  } from "react-native";
 

import EscortBarMoments from "../moments/EscortBarMoments";
 
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

interface Props {
  data: object;
  height: number;
  marginBottom: number;
  isPartialData?: boolean;
  visibilityValue: SharedValue;
  currentIndexValue: SharedValue;
  scrollTo: () => void;
  totalItemCount?: number;
  useButtons: boolean;
  categoryColorsMap: object;
  onRightPress: () => void;
  onRightPressSecondAction: () => void;
}

const ItemFooterMoments: React.FC<Props> = ({
  data,
  height,
  scrollTo,
  marginBottom,
  fontStyle,
  primaryColor,
  primaryBackground,
  // isPartialData, // if is partial then will add 'loaded' to total item count
  currentIndexValue,
  visibilityValue,
  categoryColorsMap, // in case want category colors
  totalItemCount,
  useButtons = true,
  onRightPress = () => {},
  onRightPressSecondAction = () => {}, // when extraData, this will send location item to send direction link text screen. need to get additionalData from cache (if exists) in this screen
}) => {
 

  const [currentIndex, setCurrentIndex] = useState(false);

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
    console.log(`handle next pressed, currentIndex: `, currentIndex);
    console.log(currentIndex);
    if (currentIndex === undefined) {
      return;
    }

    const next = currentIndex + 1;

    const nextExists = next < totalCount;
 
    const scrollToIndex = nextExists ? next : 0;

    scrollTo(scrollToIndex);
  };

  const handleScrollToPrev = () => {
    if (currentIndex === undefined) {
      return;
    }

    const prev = currentIndex - 1;
    console.log(totalCount - 1);

    const scrollToIndex = (currentIndex <= 0) ? totalCount - 1 : prev;

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
            height: height, //same as escort bar now
            marginBottom: marginBottom,
            // backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          },
          visibilityStyle,
        ]}
      >
        <EscortBarMoments
        primaryColor={primaryColor}
        primaryBackground={primaryBackground}
        categoryColorsMap={categoryColorsMap}
        
          onLeftPress={handleScrollToPrev}
          onRightPress={handleScrollToNext}
          children={
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[ 
                  fontStyle,
                  { color: primaryColor, fontSize: 44 },
                ]}
              >
                {currentIndex + 1}
                <Text
                  style={[ 
                    fontStyle,
                    {color: primaryColor, fontSize: 22 },
                  ]}
                >
                  {/* /{data.length}{" "} */}/{totalCount}{" "}
                  {/* {isPartialData ? "loaded" : "total"} */}
                </Text>
              </Text>
            </View>
          }
        />
        {/* {useButtons && 
        <View style={[styles.divider, themeStyles.divider]} />} */}
        <></>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    zIndex: 1,
    // backgroundColor: "pink",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },
});

export default ItemFooterMoments;
