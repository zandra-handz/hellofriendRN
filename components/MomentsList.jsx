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
import LizardSvg from "../assets/svgs/lizard.svg";
import MomentCard from "../components/MomentCard";
import MomentsNavigator from "../components/MomentsNavigator";
import SearchBar from "../components/SearchBar";
import SpinOutlineSvg from "../assets/svgs/spin-outline.svg";
import { Easing } from "react-native-reanimated";

import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useCapsuleList } from "../context/CapsuleListContext";

const ITEM_HEIGHT = 180;
const ITEM_BOTTOM_MARGIN = 6; //Add to value for snapToInterval
const NUMBER_OF_LINES = 4;

const MomentsList = (navigation) => {
  const { themeStyles, gradientColors, gradientColorsHome } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const {
    capsuleList,
    setMomentIdToAnimate,
    momentIdToAnimate,
    updateCacheWithNewPreAdded,
    updateCapsuleMutation,
    categoryNames,
    categoryStartIndices,
    preAddedTracker,
    momentsSavedToHello,
    updateCapsule,
  } = useCapsuleList();

  const [selectedMomentToView, setSelectedMomentToView] = useState(null);
  const [isMomentNavVisible, setMomentNavVisible] = useState(false);
  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const heightAnim = useRef(new Animated.Value(ITEM_HEIGHT + ITEM_BOTTOM_MARGIN)).current;
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

  const openMomentNav = (moment) => {
    setSelectedMomentToView(moment);
    setMomentNavVisible(true);
  };

  const closeMomentNav = () => {
    setMomentNavVisible(false);
  };

  const scrollToCategoryStart = (category) => {
    const categoryIndex = categoryStartIndices[category];
    console.log("hi", categoryIndex);
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
      inputRange: [offset - (ITEM_HEIGHT - ITEM_BOTTOM_MARGIN), offset, offset + ITEM_HEIGHT + ITEM_BOTTOM_MARGIN],
      outputRange: [0.94, .94, 0.88], //[0.93, 0.98, 0.84],
      extrapolate: "clamp",
    });

    const dynamicTextSize = scrollY.interpolate({
      inputRange: [offset - ITEM_HEIGHT - ITEM_BOTTOM_MARGIN, offset, offset + ITEM_HEIGHT + ITEM_BOTTOM_MARGIN],
      outputRange: [15, 15, 15], //turned off for now  [14, 15, 13]
      extrapolate: "clamp",
    });


 

    const dynamicVisibility = scrollY.interpolate({
      inputRange: [offset - ITEM_HEIGHT - ITEM_BOTTOM_MARGIN, offset, offset + ITEM_HEIGHT + ITEM_BOTTOM_MARGIN],
      outputRange: [0.4, 1, 0], // 0 = fully transparent, 1 = fully visible
      extrapolate: "clamp",
    });

    const opacity = item.id === momentIdToAnimate ? fadeAnim : 1; // Fade out when it's being animated
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
          borderRadius={30}
          moment={item}
          index={index}
          size={dynamicTextSize}
          sliderVisible={dynamicVisibility}
          onPress={() => openMomentNav(item)} // Open the moment view when the card is pressed
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
        color="black"
        style={styles.lizardTransform}
      />
    {!isKeyboardVisible && (
        <>
        
      {renderCategoryButtons()}
        </>
      
    )}
      <View style={[styles.selectFriendContainer, { marginBottom: "2%" }]}>
        <TouchableOpacity
          style={{
            alignContent: "center",
            marginHorizontal: "1%",
            alignItems: "center",
            flexDirection: "row",
          }}
          onPress={scrollToRandomItem}
        >
          <SpinOutlineSvg
            height={34}
            width={34}
            color={themeAheadOfLoading.fontColor}
          />
          <Text
            style={[
              styles.randomButtonText,
              { color: themeAheadOfLoading.fontColorSecondary },
            ]}
          ></Text>
        </TouchableOpacity>
        <SearchBar
          data={capsuleList}
          height={30}
          width={'30%'}
          borderColor={"transparent"}
          placeholderText={'Search'}
          textAndIconColor={themeAheadOfLoading.fontColorSecondary}
          backgroundColor={'transparent'}
          onPress={openMomentNav}
          searchKeys={["capsule", "typedCategory"]}
        />
      </View>
              <View
                style={[
                  styles.innerContainer,
                 themeStyles.genericTextBackground,
                  { paddingHorizontal: 0, borderColor: themeAheadOfLoading.lightColor },
                ]}
              >
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
        />
      </View>

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
    bottom: 20,
    left: 8,
    zIndex: 5,
    borderRadius: 20,
    height: "auto",
    height: "auto",
    maxHeight: "18%",
    width: "40%",
    padding: 10,
    paddingBottom: 10,
  },
  categoryButton: {
    borderBottomWidth: 0.8,
    borderBottomColor: "transparent",
    backgroundColor: "#000002",
    alignText: "left",
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: "4%",
    paddingVertical: "4%",
    borderRadius: 20,
    marginBottom: 6,
    height: "auto",
  },
  categoryText: {
    fontWeight: "bold",
    fontSize: 13,
    textTransform: "uppercase",
  },
  searchBarContent: {
    width: "97%",
    marginVertical: "2%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
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
  listContainer: {
    height: Dimensions.get("screen").height - 230, //440
    width: Dimensions.get("screen").width,
    overflow: "visible",
    zIndex: 1,
  },
  cardContainer: {
    height: "auto",
    alignItems: "center",
  },
  innerContainer: {
    height: Dimensions.get("screen").height - 0, //440
    width: Dimensions.get("screen").width - 10,
    alignContent: "center",
    //paddingHorizontal: "4%",
    paddingTop: "4%",
    width: "101%",
    alignSelf: "center",
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: 'hidden', 
    // zIndex: 2000,
  },
  selectFriendContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: 'row',
    minHeight: 30,
    maxHeight: 30,
    height: 30,
    paddingHorizontal: '2%',
  },
});

export default MomentsList;
