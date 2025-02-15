// TO MAKE MOMENTS LIST FULL HEIGHT AGAIN, SET TO - 100 HERE:
//    listContainer: {
//    height: Dimensions.get("screen").height - 440,

import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Animated,
  LayoutAnimation,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from "react-native";

import { useFriendList } from "../context/FriendListContext";

import ButtonGoToAddMoment from "../components/ButtonGoToAddMoment";
import LizardSvg from "../assets/svgs/lizard.svg";
import MomentCard from "../components/MomentCard";
import MomentsNavigator from "../components/MomentsNavigator";
import MomentsSearchBar from "../components/MomentsSearchBar";
import DiceRandom3dSolidSvg from "../assets/svgs/dice-random-3d-solid.svg";
import { Easing } from "react-native-reanimated";

import { useNavigation } from "@react-navigation/native";

import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useCapsuleList } from "../context/CapsuleListContext";

import BodyStyling from "../components/BodyStyling";
import BelowHeaderContainer from "../components/BelowHeaderContainer";

const ITEM_HEIGHT = 210;
const ITEM_BOTTOM_MARGIN = 0; //Add to value for snapToInterval
const NUMBER_OF_LINES = 4;


const CARD_BORDERRADIUS = 50; //30

const MomentsList = () => {
  const {
    themeStyles,
    gradientColors,
    gradientColorsHome,
    manualGradientColors,
  } = useGlobalStyle();
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

  const moments = capsuleList;
  const momentListBottomSpacer = Dimensions.get("screen").height - 200;

  const translateX = new Animated.Value(0);

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
    navigation.navigate('MomentView', {moment: moment});

  };

  const openMomentNav = (moment) => {
    setSelectedMomentToView(moment);
    setMomentNavVisible(true);
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

  const renderCategoryButtons = () => {
    return (
      <View
        style={[
          styles.categoryContainer,
          { backgroundColor: gradientColorsHome.darkColor },
        ]}
      >
        <Text
          style={[
            themeStyles.genericText,
            { paddingVertical: 4, paddingHorizontal: 4 },
          ]}
        >
          CATEGORIES
        </Text>
        <FlatList
          data={categoryNames}
          horizontal={false}
          snapToInterval={44}
          ListFooterComponent={() => <View style={{ height: 0 }} />}
          keyExtractor={(categoryName) =>
            categoryName ? categoryName.toString() : "Uncategorized"
          }
          renderItem={({ item: categoryName }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: gradientColors.darkColor },
              ]}
              onPress={() => {
                scrollToCategoryStart(categoryName);
              }}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.categoryText,
                  { color: gradientColorsHome.darkColor },
                ]}
              >
                {categoryName}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };
  const renderMomentCard = ({ item, index }) => {
    // Calculate the offset of the current item in relation to the scroll position
    const offset = index * (ITEM_HEIGHT + ITEM_BOTTOM_MARGIN);

    const distanceFromTop = scrollY.interpolate({
      inputRange: [
        offset - (ITEM_HEIGHT - ITEM_BOTTOM_MARGIN),
        offset,
        offset + ITEM_HEIGHT + ITEM_BOTTOM_MARGIN,
      ],
      outputRange: [0.92, 0.94, 0.84], //[0.93, 0.98, 0.84],
      extrapolate: "clamp",
    });

    const dynamicTextSize = scrollY.interpolate({
      inputRange: [
        offset - ITEM_HEIGHT - ITEM_BOTTOM_MARGIN,
        offset,
        offset + ITEM_HEIGHT + ITEM_BOTTOM_MARGIN,
      ],
      outputRange: [16, 16, 16], //turned off for now  [14, 15, 13]
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

    const opacity =
      item.id === momentIdToAnimate ? fadeAnim : fadeAnim.__getValue();
    // Fade out when it's being animated
    const translate = item.id === momentIdToAnimate ? translateY : 0;

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale: distanceFromTop }, { translateY: translate }],
            opacity,
          },
        ]}
      >
        <MomentCard
          key={item.id}
          heightToMatchWithFlatList={ITEM_HEIGHT}
          marginToMatchWithFlatList={ITEM_BOTTOM_MARGIN}
          numberOfLinesToMatchWithFlatList={NUMBER_OF_LINES}
          backgroundColor={
            themeStyles.genericTextBackgroundShadeTwo.backgroundColor
          }
          borderRadius={CARD_BORDERRADIUS }
          paddingHorizontal={'10%'}
          
          borderColor={"transparent"} //manualGradientColors.lightColor}
          moment={item}
          index={index}
          size={dynamicTextSize}
          sliderVisible={dynamicVisibility}
          onPress={() => handleNavigateToMomentView(item)} // Open the moment view when the card is pressed
          onSliderPull={() => saveToHello(item)} // Save moment to Hello when slider is pulled
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LizardSvg
        height={300}
        width={300}
        color={themeStyles.genericTextBackground.backgroundColor}
        style={styles.lizardTransform}
      />
      {!isKeyboardVisible && (
        <>
          {renderCategoryButtons()}

          <ButtonGoToAddMoment />
        </>
      )}
      <BelowHeaderContainer
        height={30}
        alignItems="center"
        marginBottom="2%"
        justifyContent="flex-end"
        children={
          <>
            <DiceRandom3dSolidSvg
              height={36}
              width={36}
              color={themeAheadOfLoading.fontColorSecondary}
              onPress={scrollToRandomItem}
            />
            <MomentsSearchBar
              data={capsuleList}
              height={30}
              width={"27%"}
              borderColor={"transparent"}
              placeholderText={"Search"}
              textAndIconColor={themeAheadOfLoading.fontColorSecondary}
              backgroundColor={"transparent"}
              onPress={scrollToMoment}
              searchKeys={["capsule", "typedCategory"]}
            />
          </>
        }
      />

      <BodyStyling
        height={"87%"}
        width={"100%"}
        minHeight={"87%"}
        paddingTop={"4%"}
        paddingHorizontal={"2%"}
        children={
          <>
            <Animated.FlatList
              ref={flatListRef}
              data={capsuleList}
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
