import React from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
} from "react-native-reanimated";
import SlideToAdd from "../foranimations/SlideToAdd";
import FormatMonthDay from "@/app/components/appwide/format/FormatMonthDay";
import CheckmarkOutlineSvg from "@/app/assets/svgs/checkmark-outline.svg";
import MomentLeavesUI from "./MomentLeavesUI";
import SlideAwayOnSuccess from "./SlideAwayOnSuccessAnimation";
import { ReText } from "react-native-redash";
import MomentPulseBobReceiver from "@/app/animations/MomentPulseBobReceiver";

import moment from 'moment';

const MomentCard = ({
  animatedCardsStyle,

  index,
  onPress,
  onSliderPull,
  moment,
  heightToMatchWithFlatList, //match THIS if using FlatList
  marginToMatchWithFlatList,
  numberOfLinesToMatchWithFlatList,
  borderRadius,
  borderColor,
  size,
  sliderVisible,
  highlightsVisible,
  disabled = false,
}) => {
  const { gradientColors, gradientColorsHome } = useGlobalStyle();
  const { updateCapsuleMutation, momentData } = useCapsuleList();

  const momentText = useSharedValue(moment?.capsule || "");
  const momentCategoryText = useSharedValue(moment?.typedCategory || "");
const date = new Date(moment?.created);

const formattedText = !isNaN(date)
  ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
  : '';
const momentCreatedText = useSharedValue(formattedText);

  const fillColor = gradientColorsHome.darkColor;
  const strokeColor = gradientColors.darkColor;
  const momentTextColor = gradientColorsHome.darkColor;
  const categoryTextColor = gradientColorsHome.darkColor;

  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  //Added from chatGPT
  const capitalizeFirstFiveWords = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    const capitalizedWords = words
      .slice(0, 5)
      .map((word) => word.toUpperCase())
      .concat(words.slice(5));
    return capitalizedWords.join(" ");
  };
 

  const animatedProps = useAnimatedProps(() => {
    return {
      text: momentText.value,
      value: momentText.value,
    };
  });


  //   const animatedCategoryProps = useAnimatedProps(() => {
  //   return {
  //    // text: momentCategoryText.value,
  //     value: `# ${momentCategoryText.value}`,
  //   };
  // });

const animatedCategoryProps = useAnimatedProps(() => {
  const original = momentCategoryText.value;

  const truncated = original.length > 26
    ? original.slice(0, 26) + '...'
    : original;

  return {
    value: `# ${truncated} • added ${momentCreatedText.value}`,
  };
});

  return (
    <SlideAwayOnSuccess
      localItem={moment}
      contextItem={momentData}
      contextItemUpdateMutation={updateCapsuleMutation}
      height={heightToMatchWithFlatList}
      marginBottom={marginToMatchWithFlatList}
      borderRadius={borderRadius}
      borderColor={borderColor}
    >
      <MomentLeavesUI
        index={index}
        fillColor={fillColor}
        strokeColor={strokeColor}
        height={heightToMatchWithFlatList}
        width={"100%"}
        largeLeafSize={400}
        smallLeafSize={420}
      />
      <TouchableOpacity
        style={{ width: "100%", flex: 1 }}
        onPress={!disabled ? onPress : null} // Disable onPress if the button is disabled
        disabled={disabled}
      >
        <View style={styles.iconAndMomentContainer}>
          <Animated.View
            style={[
              {
                borderRadius: borderRadius,
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                flexDirection: "row",
                width: "100%",
                opacity: highlightsVisible,
              },
            ]}
          >
            <MomentPulseBobReceiver
              animatedCardsStyle={animatedCardsStyle}
              circleTextSize={40}
              pulseDuration={2400}
            >
              <Animated.View
                style={[
                  styles.textWrapper,
                  {
                    height: "auto",
                    maxHeight: 200,
                    width: "100%",
                    padding: 12,
                    borderRadius: 10,
                  },
                ]}
              >
                <AnimatedTextInput
                  multiline={false}
                  animatedProps={animatedCategoryProps}
                  editable={false}
                  numberOfLines={numberOfLinesToMatchWithFlatList}
                  style={[
                    styles.categoryText,
                    { color: categoryTextColor, opacity: 1 },
                  ]}
                  underlineColorAndroid="transparent"  
                  pointerEvents="none"  
                />

               {/* <Animated.Text
                  style={[
                    styles.categoryText,
                    { color: categoryTextColor, opacity: 1 },
                  ]}
                >
                  #
                  {moment.typedCategory.length > 12
                    ? `${moment.typedCategory.substring(0, 12)}...`
                    : moment.typedCategory}{" "}
                  • added{" "}
                  <FormatMonthDay
                    date={moment.created}
                    fontSize={13}
                    fontFamily={"Poppins-Regular"}
                    parentStyle={[
                      styles.categoryText,
                      { color: categoryTextColor, opacity: 1 },
                    ]}
                    opacity={1}
                  />    </Animated.Text>  */}

                <AnimatedTextInput
                  multiline={true}
                  animatedProps={animatedProps} 
                  editable={false}
                  numberOfLines={numberOfLinesToMatchWithFlatList}
                  style={[
                    styles.momentText,

                    {
                      color: momentTextColor,
                      fontSize: size,
                      textAlignVertical: 'top', 
                      // opacity: 1,
                    },
                  ]}
                  underlineColorAndroid="transparent" // Optional: removes underline on Android
                  pointerEvents="none" // Optional: disable interaction if acting like static Text
                />
              </Animated.View>
            </MomentPulseBobReceiver>
          </Animated.View>
        </View>
      </TouchableOpacity>
      <Animated.View style={[styles.sliderContainer, { opacity: 1 }]}>
        <SlideToAdd
          onPress={onSliderPull}
          sliderText="ADD TO HELLO"
          sliderTextSize={13}
          sliderTextVisible={1}
          targetIcon={CheckmarkOutlineSvg}
          //  disabled={sliderVisible !== 1}
        />
      </Animated.View>
    </SlideAwayOnSuccess>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    position: "absolute",
    top: 0,
    flex: 1,
    left: 7,
    right: 0,
    height: 24,
    borderRadius: 20,
    zIndex: 300,
    elevation: 300,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  disabledContainer: {
    opacity: 0.5,
  },
  iconAndMomentContainer: {
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap",
    backgroundColor: "transparent",
  },
  momentText: {
    fontFamily: "Poppins-Bold",
    //  flexShrink: 1,
    fontWeight: "bold",
    fontSize: 10,
    lineHeight: 18,
    alignSelf: "left",
  },
  textWrapper: {
    // flexGrow: 1,
    textAlign: "left",
    position: "absolute",
    // justifyContent: 'center',
    width: "100%",
    // overflow: 'hidden',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    flexShrink: 1,
    //fontWeight: "bold",
    lineHeight: 16,
    color: "darkgrey",
    overflow: "hidden",
    textTransform: "uppercase",
  },
  categoryHeader: {
    position: "absolute",

    flexDirection: "row",
    alignContent: "left",
    justifyContent: "flex-start",

    height: "auto",
    flexWrap: "flex",
  },
  iconContainer: {
    justifyContent: "center",
  },
  creationDateSection: {
    borderRadius: 20,
    paddingHorizontal: "4%",
    paddingVertical: "4%",
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
    zIndex: 2,
  },
});

export default MomentCard;
