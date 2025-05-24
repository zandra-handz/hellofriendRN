import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import Animated, {
  useSharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import SlideToAdd from "../foranimations/SlideToAdd";
import MomentLeavesUI from "./MomentLeavesUI";
import SlideAwayOnSuccess from "./SlideAwayOnSuccessAnimation";
import MomentPulseBobReceiver from "@/app/animations/MomentPulseBobReceiver";
import CheckmarkOutlineSvg from "@/app/assets/svgs/checkmark-outline.svg";
const MomentCard = ({
  animatedCardsStyle,
  index,
  onPress,
  onSliderPull,
  moment,
  date,
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
  const { gradientColorsHome } = useGlobalStyle();
  const { updateCapsuleMutation, momentData } = useCapsuleList();

  // const momentCreatedText = useSharedValue(date);
  // const momentText = useSharedValue(moment?.capsule || "");
  // const momentCategoryText = useSharedValue(moment?.typedCategory || "");

 // console.log(`Moment card ${moment.id} rerendered`);

  // const fillColor = gradientColorsHome.darkColor;
  // const strokeColor = gradientColors.darkColor;
  const momentTextColor = gradientColorsHome.darkColor;
  const categoryTextColor = gradientColorsHome.darkColor;

  const original = moment?.typedCategory;

  const truncated =
    original.length > 26 ? original.slice(0, 26) + "..." : original;

  const header = `# ${truncated} • added ${date}`;

  // const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  // const animatedProps = useAnimatedProps(() => {
  //    if (global._WORKLET) {
  //   console.log('animatedProps function triggered');
  //   return {
  //    // text: momentText.value,
  //     value: momentText.value,
  //   };
  // } else {
  //   console.log('animatedProps running on JS');
  //   return {
  //   //  text: '',
  //     value: '',
  //   }
  // }
  // });

  //   const animatedCategoryProps = useAnimatedProps(() => {
  //   return {
  //    // text: momentCategoryText.value,
  //     value: `# ${momentCategoryText.value}`,
  //   };
  // });

  // const animatedCategoryProps = useAnimatedProps(() => {
  //   const original = momentCategoryText.value;

  //   const truncated =
  //     original.length > 26 ? original.slice(0, 26) + "..." : original;

  //   return {
  //     value: `# ${truncated} • added ${momentCreatedText.value}`,
  //   };
  // });

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
    <Animated.View
      style={{
        width: "100%",
        flexDirection: "column",
        height: heightToMatchWithFlatList,
        marginBottom: marginToMatchWithFlatList,
       // borderWidth: StyleSheet.hairlineWidth,
      }}
    >
      <MomentLeavesUI
        index={index}
        // fillColor={fillColor}
        // strokeColor={strokeColor}
        height={heightToMatchWithFlatList}
        width={"100%"}
        // largeLeafSize={400}
        // smallLeafSize={420}
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
            index={index}
              animatedCardsStyle={animatedCardsStyle}
              circleTextSize={40}
              pulseDuration={2400}
            >
              <View
                style={[
                  {
                    textAlign: "left",
                    position: "absolute",
                    height: "auto",
                    maxHeight: 200,
                    width: "100%",
                    padding: 12,
                    borderRadius: 10,
                  },
                ]}
              >
                <Text
                  multiline={false}
                  numberOfLines={numberOfLinesToMatchWithFlatList}
                  style={[
                    styles.categoryText,
                    { color: categoryTextColor, opacity: 1 },
                  ]}
                >
                  {header && header}
                </Text>

                {/* <AnimatedTextInput
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
                /> */}

                <Text
                  multiline={true}
                  editable={false}
                  numberOfLines={numberOfLinesToMatchWithFlatList}
                  style={[
                    styles.momentText,

                    {
                      color: momentTextColor,
                      fontSize: size,
                      textAlignVertical: "top",
                      // opacity: 1,
                    },
                  ]}
                >
                  {moment && moment.capsule}
                </Text>

                {/* <AnimatedTextInput
                  multiline={true}
                  animatedProps={animatedProps}
                  editable={false}
                  numberOfLines={numberOfLinesToMatchWithFlatList}
                  style={[
                    styles.momentText,

                    {
                      color: momentTextColor,
                      fontSize: size,
                      textAlignVertical: "top",
                      // opacity: 1,
                    },
                  ]}
                  underlineColorAndroid="transparent" // Optional: removes underline on Android
                  pointerEvents="none" // Optional: disable interaction if acting like static Text
                /> */}
              </View>
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
});


// export default MomentCard;

function areEqual(prevProps, nextProps) {
  return (
    prevProps.moment?.id === nextProps.moment?.id &&
    prevProps.moment?.capsule === nextProps.moment?.capsule &&
    prevProps.moment?.typedCategory === nextProps.moment?.typedCategory &&
    prevProps.date === nextProps.date &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.highlightsVisible === nextProps.highlightsVisible &&
    prevProps.sliderVisible === nextProps.sliderVisible
  );
}

export default React.memo(MomentCard, areEqual);
