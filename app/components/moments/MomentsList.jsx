// TO MAKE MOMENTS LIST FULL HEIGHT AGAIN, SET TO - 100 HERE:
//    listContainer: {
//    height: Dimensions.get("screen").height - 440,

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Animated,
  LayoutAnimation,
  // Dimensions,
  // TouchableOpacity,
  // FlatList,
  Keyboard,
} from "react-native";

import { useFriendList } from "@/src/context/FriendListContext";

import ButtonGoToAddMoment from "../buttons/moments/ButtonGoToAddMoment";
import LizardSvg from "@/app/assets/svgs/lizard.svg";
import MomentCard from "./MomentCard";
import MomentsNavigator from "./MomentsNavigator";
import CategoryNavigator from "./CategoryNavigator";
import MomentsSearchBar from "./MomentsSearchBar";
import DiceRandom3dSolidSvg from "@/app/assets/svgs/dice-random-3d-solid.svg";
import { Easing } from "react-native-reanimated";

import { useNavigation } from "@react-navigation/native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

import BodyStyling from "../scaffolding/BodyStyling";
import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";
// import LeafSingleOutlineInvertedSvg from "@/app/assets/svgs/leaf-single-outline-inverted";

const ITEM_HEIGHT = 290;
const ITEM_BOTTOM_MARGIN = 0; //Add to value for snapToInterval
const NUMBER_OF_LINES = 5;

const CARD_BORDERRADIUS = 50; //30

const MomentsList = () => {
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const {
    capsuleList,
    setMomentIdToAnimate,
    momentIdToAnimate,
    updateCacheWithNewPreAdded,
    categoryNames,
    categoryStartIndices,
    updateCapsule,
  } = useCapsuleList();

  const navigation = useNavigation();

  const [selectedMomentToView, setSelectedMomentToView] = useState(null);
  const [isMomentNavVisible, setMomentNavVisible] = useState(false);
  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const heightAnim = useRef(
    new Animated.Value(ITEM_HEIGHT + ITEM_BOTTOM_MARGIN)
  ).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
 
  const momentListBottomSpacer = 700;

  const translateX = new Animated.Value(0);

  const belowHeaderIconSize = 28;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // removal animation triggered by context
  useEffect(() => {
    if (momentIdToAnimate) {
      Animated.timing(translateX, {
        toValue: 500,
        duration: 0,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        Animated.parallel([
          Animated.timing(heightAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start(() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          updateCacheWithNewPreAdded();
          setMomentIdToAnimate(null);

          fadeAnim.setValue(1);
          heightAnim.setValue(ITEM_HEIGHT + ITEM_BOTTOM_MARGIN);
          translateX.setValue(0);
        });
      });
    }
  }, [momentIdToAnimate]);

  const scrollToMoment = (moment) => {
    if (moment.uniqueIndex !== undefined) {
      flatListRef.current?.scrollToIndex({
        index: moment.uniqueIndex,
        animated: true,
      });
    }
  };

  const scrollToRandomItem = () => {
    if (capsuleList.length === 0) return;

    const randomIndex = Math.floor(Math.random() * capsuleList.length);
    flatListRef.current?.scrollToIndex({
      index: randomIndex,
      animated: true,
    });
  };

  const saveToHello = async (moment) => {
    try {
      updateCapsule(moment.id);
    } catch (error) {
      console.error("Error during pre-save:", error);
    }
  };

  const handleNavigateToMomentView = (moment) => {
    navigation.navigate("MomentView", { moment: moment });
  };

  const closeMomentNav = () => {
    setMomentNavVisible(false);
  };

  const scrollToCategoryStart = (category) => {
    const categoryIndex = categoryStartIndices[category];

    if (categoryIndex !== undefined) {
      flatListRef.current?.scrollToIndex({
        index: categoryIndex > 0 ? categoryIndex : 0,
        animated: true,
      });
    }
  };

  const renderMomentCard = useCallback(
    ({ item, index }) => {
      //const renderMomentCard = ({ item, index }) => {
      // Calculate the offset of the current item in relation to the scroll position
      const offset = index * (ITEM_HEIGHT + ITEM_BOTTOM_MARGIN);

      const distanceFromTop = scrollY.interpolate({
        inputRange: [
          offset - (ITEM_HEIGHT - ITEM_BOTTOM_MARGIN),
          offset,
          offset + ITEM_HEIGHT + ITEM_BOTTOM_MARGIN,
        ],
        outputRange: [0.88, 0.97, 0.82], //[0.92, 0.94, 0.84],
        extrapolate: "clamp",
      });

      const dynamicTextSize = scrollY.interpolate({
        inputRange: [
          offset - ITEM_HEIGHT - ITEM_BOTTOM_MARGIN - 4,
          offset,
          offset + ITEM_HEIGHT + ITEM_BOTTOM_MARGIN - 4,
        ],
        outputRange: [12, 12, 12], //turned off for now  [14, 15, 13]
        extrapolate: "clamp",
      });

      const dynamicVisibility = scrollY.interpolate({
        inputRange: [
          offset - ITEM_HEIGHT - ITEM_BOTTOM_MARGIN,
          offset,
          offset + ITEM_HEIGHT + ITEM_BOTTOM_MARGIN,
        ],
        outputRange: [0.2, 1, 0], // 0 = fully transparent, 1 = fully visible
        extrapolate: "clamp",
      });
      const dynamicHighlightsVisibility = scrollY.interpolate({
        inputRange: [
          offset - ITEM_HEIGHT - ITEM_BOTTOM_MARGIN,
          offset,
          offset + ITEM_HEIGHT + ITEM_BOTTOM_MARGIN,
        ],
        outputRange: [0, 1, 0], // 0 = fully transparent, 1 = fully visible
        extrapolate: "clamp",
      });

      const opacity =
        item.id === momentIdToAnimate ? fadeAnim : fadeAnim.__getValue();
      // Fade out when it's being animated
      const translate = item.id === momentIdToAnimate ? translateY : 0;

      return (
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [
                { scale: distanceFromTop },
                { translateY: translate },
              ],
              opacity,
            },
          ]}
        >
          <MomentCard
            key={item.id}
            distanceFromTop={distanceFromTop}
            scrollY={scrollY}
            heightToMatchWithFlatList={ITEM_HEIGHT}
            marginToMatchWithFlatList={ITEM_BOTTOM_MARGIN}
            numberOfLinesToMatchWithFlatList={NUMBER_OF_LINES}
            backgroundColor={
              "transparent"
              // themeStyles.genericTextBackgroundShadeTwo.backgroundColor
            }
            borderRadius={CARD_BORDERRADIUS}
            paddingHorizontal={0}
            borderColor={"transparent"} //manualGradientColors.lightColor}
            moment={item}
            index={index}
            size={dynamicTextSize}
            sliderVisible={dynamicVisibility}
            highlightsVisible={dynamicHighlightsVisibility}
            onPress={() => handleNavigateToMomentView(item)} // Open the moment view when the card is pressed
            onSliderPull={() => saveToHello(item)} // Save moment to Hello when slider is pulled
          />
        </Animated.View>
      );
    },
    [
      scrollY,
      momentIdToAnimate,
      fadeAnim,
      translateY,
      heightAnim,
      updateCacheWithNewPreAdded,
    ]
  );
  // };

  return (
    <View style={styles.container}>
      <LizardSvg
        height={300}
        width={300}
        color={themeStyles.genericTextBackground.backgroundColor}
        style={styles.lizardTransform}
      />

      <BelowHeaderContainer
        height={30}
        alignItems="center"
        marginBottom={4}
        justifyContent="flex-end"
        children={
          <>
          <View style={{flexDirection: 'row', marginHorizontal: 10}}>
            <View style={{ height: 30, justifyContent: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                pick random{" "}
              </Text>
            </View>
            <DiceRandom3dSolidSvg
              height={belowHeaderIconSize}
              width={belowHeaderIconSize}
              color={themeAheadOfLoading.fontColorSecondary}
              onPress={scrollToRandomItem}
            />
            
            
          </View>
            <MomentsSearchBar
              data={capsuleList}
              height={25}
              width={"47%"}
              borderColor={themeAheadOfLoading.fontColorSecondary}
              placeholderText={"Search"}
              textAndIconColor={themeAheadOfLoading.fontColorSecondary}
              backgroundColor={"transparent"}
              onPress={scrollToMoment}
              searchKeys={["capsule", "typedCategory"]}
              iconSize={belowHeaderIconSize * .7}
            />
          </>
        }
      />

      <BodyStyling
        height={"87%"}
        width={"100%"}
        minHeight={"87%"}
        paddingTop={0}
        transparentBackground={true}
        transparentBorder={true}
        paddingHorizontal={0}
        children={
          <>
            <Animated.FlatList
              ref={flatListRef}
              data={capsuleList}
              //fadingEdgeLength={10}
              renderItem={renderMomentCard}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : `placeholder-${index}`
              }
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT + ITEM_BOTTOM_MARGIN,
                offset: (ITEM_HEIGHT + ITEM_BOTTOM_MARGIN) * index,
                index,
              })}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              ListFooterComponent={() => (
                <View style={{ height: momentListBottomSpacer }} />
              )}
              onScrollToIndexFailed={(info) => {
                flatListRef.current?.scrollToOffset({
                  offset: info.averageItemLength * info.index,
                  animated: true,
                });
              }}
              snapToInterval={ITEM_HEIGHT + ITEM_BOTTOM_MARGIN} // Set the snapping interval to the height of each item
              snapToAlignment="start" // Align items to the top of the list when snapped
              decelerationRate="fast" // Optional: makes the scroll feel snappier
              keyboardDismissMode="on-drag"
            />
          </>
        }
      />

      {!isKeyboardVisible && (
        <>
          <CategoryNavigator
            categoryNames={categoryNames}
            onPress={scrollToCategoryStart}
          />

          <ButtonGoToAddMoment />
        </>
      )}

      {isMomentNavVisible && selectedMomentToView && (
        <MomentsNavigator
          onClose={closeMomentNav}
          moment={selectedMomentToView}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    zIndex: 1,
  },
  categoryContainer: {
    position: "absolute",
    bottom: 20, //20
    left: 4,
    zIndex: 5,
    borderRadius: 20,
    height: "auto",
    maxHeight: "20%",
    width: "40%",
    padding: 20,
  },
  categoryButton: {
    borderBottomWidth: 0.8,
    borderBottomColor: "transparent",
    backgroundColor: "#000002",
    alignText: "left",
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: "8%",
    paddingVertical: "6%",
    borderRadius: 16,
    marginBottom: "3%",
    height: "auto",
  },
  categoryText: {
    fontWeight: "bold",
    fontSize: 13,
    textTransform: "uppercase",
  },
  lizardTransform: {
    position: "absolute",
    zIndex: 0,
    bottom: -100,
    left: -90,
    transform: [
      { rotate: "60deg" },
      // Flip horizontally (mirror image)
    ],
    opacity: 0.8,
  },
  cardContainer: {
    height: "auto",
    alignItems: "center",
    // marginTop: 10,
  },
  selectFriendContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    minHeight: 30,
    maxHeight: 30,
    height: 30,
    paddingHorizontal: "4%",
  },
});

export default MomentsList;
