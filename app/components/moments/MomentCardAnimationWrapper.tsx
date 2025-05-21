


import React, { useEffect } from "react";
import { ViewToken } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  SharedValue,
  useSharedValue,
  interpolateColor,
  withSequence,
  withRepeat,
  useAnimatedReaction,
  cancelAnimation,
} from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import MomentCard from "./MomentCard";

type MomentCardAnimationWrapperProps = {
  viewableItemsArray: SharedValue<ViewToken[]>;
  item: {
    id: number;
  };
  index: number;
  momentIdToAnimate: number;
  fadeAnim: SharedValue<number>;
  translateY: SharedValue<number>;
  handleNavigateToMomentView: (item: { id: number }) => void;
  saveToHello: (item: { id: number }) => void;
  pulseDuration?: number;
  bobbingDuration?: number;
  bobbingDistance?: number;
};

const MomentCardAnimationWrapper: React.FC<MomentCardAnimationWrapperProps> = ({
  viewableItemsArray,
  item,
  index,
  momentIdToAnimate,
  fadeAnim,
  translateY,
  handleNavigateToMomentView,
  saveToHello,
  pulseDuration = 2000,
  bobbingDuration = 2000,
  bobbingDistance = 5,
}) => {
  const { gradientColors, manualGradientColors } = useGlobalStyle();
  const momentBackgroundColor = gradientColors.lightColor;

  const ITEM_HEIGHT = 290;
  const ITEM_BOTTOM_MARGIN = 0;
  const NUMBER_OF_LINES = 5;
  const CARD_BORDERRADIUS = 50;

  const progress = useSharedValue(0);
  const translateYx2 = useSharedValue(0);
  const cardOpacity = useSharedValue(0);

  const scaleCardsStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItemsArray?.value
        .slice(0, 1)
        .filter((arrayItem) => arrayItem.isViewable)
        .find((viewableItem) => viewableItem.item?.id === item?.id)
    );

    const opacity = item.id === momentIdToAnimate ? fadeAnim.value : 1;
    const translate = item.id === momentIdToAnimate ? translateY.value : 0;

    return {
      transform: [
        { scale: withTiming(isVisible ? 0.97 : 0.7) },
        { translateY: translate },
      ],
      opacity: withTiming(isVisible ? 1 : 0.4),
    };
  }, []);

  useAnimatedReaction(
    () => {
      return Boolean(
        viewableItemsArray?.value
          .slice(0, 1)
          .filter((arrayItem) => arrayItem.isViewable)
          .find((viewableItem) => viewableItem.item?.id === item?.id)
      );
    },
    (isVisible, prevIsVisible) => {
      if (isVisible !== prevIsVisible) {
        if (isVisible) {
          progress.value = withRepeat(
            withTiming(1, { duration: pulseDuration }),
            -1,
            true
          );
          cardOpacity.value = 1;
          translateYx2.value = withRepeat(
            withSequence(
              withTiming(-bobbingDistance, { duration: bobbingDuration }),
              withTiming(0, { duration: bobbingDuration })
            ),
            -1,
            false
          );
        } else {
          cancelAnimation(progress);
          cancelAnimation(translateYx2);
          cancelAnimation(cardOpacity);
          progress.value = 0;
          translateYx2.value = 0;
          cardOpacity.value = 0;
        }
      }
    },
    [viewableItemsArray]
  );

  const animatedCardsStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [momentBackgroundColor, manualGradientColors.lighterLightColor]
    );

    return {
      backgroundColor,
      opacity: cardOpacity.value,
      transform: [{ translateY: translateYx2.value }],
    };
  });

  useEffect(() => {
    return () => {
      cancelAnimation(progress);
      cancelAnimation(translateYx2);
      cancelAnimation(cardOpacity);
      progress.value = 0;
      translateYx2.value = 0;
      cardOpacity.value = 0;
    };
  }, []);

  return (
    <Animated.View
      key={item.id}
      style={[scaleCardsStyle, { height: "auto", alignItems: "center" }]}
    >
      <MomentCard
        animatedCardsStyle={animatedCardsStyle}
        heightToMatchWithFlatList={ITEM_HEIGHT}
        marginToMatchWithFlatList={ITEM_BOTTOM_MARGIN}
        numberOfLinesToMatchWithFlatList={NUMBER_OF_LINES}
        borderRadius={CARD_BORDERRADIUS}
        borderColor={"transparent"}
        moment={item}
        index={index}
        size={12}
        sliderVisible={1}
        highlightsVisible={1}
        onPress={() => handleNavigateToMomentView(item)}
        onSliderPull={() => saveToHello(item)}
      />
    </Animated.View>
  );
};

// ✅ Memoize the entire component
export default React.memo(MomentCardAnimationWrapper, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.momentIdToAnimate === nextProps.momentIdToAnimate &&
    prevProps.fadeAnim === nextProps.fadeAnim &&
    prevProps.translateY === nextProps.translateY &&
    prevProps.viewableItemsArray === nextProps.viewableItemsArray
  );
});

