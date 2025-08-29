import { TouchableOpacity,  StyleSheet } from "react-native";
import React from "react"; 
import Animated, { SharedValue } from "react-native-reanimated";
 
import {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  withRepeat,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";

interface Label {
  label: string;
}

type Props = {
  viewableItemsArray: SharedValue[];
  label: Label;
  onPress: (label: Label) => void;
  height: number;
  pulseDuration: number;
  highlightColor: string;
};

const CategoryButton = ({
  homeDarkColor,
  primaryColor,
  viewableItemsArray,
  label,
  onPress,

  height = 30,
  pulseDuration = 2000,
  highlightColor = '#ccc',
}: Props) => {
  
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

 

  const progress = useSharedValue(0);
  const translateYx2 = useSharedValue(0);
  const startColor = useSharedValue("transparent");
  const endColor = useSharedValue("red");
  const textColor = useSharedValue(primaryColor);

  //  show animation based on if top item in FlatList in parent
  useAnimatedReaction(
    () => {
      return Boolean(
        viewableItemsArray?.value[0]?.item?.user_category_name === label
      );
    },
    (isVisible, prevIsVisible) => {
      if (isVisible !== prevIsVisible) {
        if (isVisible) { 
           startColor.value = highlightColor; 
           endColor.value = primaryColor || "red";
          textColor.value = homeDarkColor;

          progress.value = withRepeat(
            withTiming(1, { duration: pulseDuration }),
            -1,
            true
          );
        } else {
          progress.value = withTiming(0, { duration: 200 });
          translateYx2.value = withTiming(0, { duration: 200 });
                    startColor.value = 'transparent';
          endColor.value = 'transparent';
          // startColor.value = themeStyles.overlayBackgroundColor.backgroundColor;
          // endColor.value = themeStyles.overlayBackgroundColor.backgroundColor;
          textColor.value = primaryColor;
        }
      }
    },
    [viewableItemsArray]
  );

  const animatedCardsStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [startColor.value, endColor.value]
    );

    return {
      backgroundColor,
      color: textColor.value,
      transform: [{ translateY: translateYx2.value }],
    };
  });

  return (
    <AnimatedTouchableOpacity
      style={[
        animatedCardsStyle,
        styles.buttonContainer,
        {
          width: "auto",
          padding: 10, 
          height: height,
        },
      ]}
      onPress={() => {
        onPress(label);
      }}
    >
      <Animated.Text
        numberOfLines={1}
        style={[
          animatedCardsStyle,
    
          // animatedCardsStyle,
          {
            color: primaryColor,
            // fontWeight: "bold",
            fontSize: 14,
            fontFamily: "Poppins-Bold",
            fontWeight: 'bold',
            //   textTransform: "uppercase",
            height: "100%",
            alignSelf: "center",

            //  backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
            borderRadius: 999,
            padding: 2,
          },
        ]}
      >
        {label}
      </Animated.Text>
    </AnimatedTouchableOpacity>
  );
};


const styles = ({
  buttonContainer: {
        borderWidth: StyleSheet.hairlineWidth,
    alignText: "left",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 2,
    paddingHorizontal: 10,
   
    borderRadius: 16,
    height: "auto",
  }
})

export default CategoryButton;
