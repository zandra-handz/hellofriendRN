import React, { useEffect, useRef, useState } from "react";

import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  DimensionValue,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDerivedValue, runOnJS } from "react-native-reanimated";
import FriendHeaderMessageUI from "./FriendHeaderMessageUI";

import { useCapsuleList } from "@/src/context/CapsuleListContext";
import AnimatedClimber from "@/app/screens/fidget/AnimatedClimber";

import SvgIcon from "@/app/styles/SvgIcons";
import { AppFontStyles } from "@/app/styles/AppFonts";
// import TalkingPointsChart from "./TalkingPointsChart";
import MomentsField from "./MomentsField";

import History from "./History";
import Pics from "./Pics";
import Helloes from "./Helloes";
import Moments from "./Moments";
// import ItemFooterHelloes from "../appwide/statusbar/ItemFooterHelloes";
// import { useFocusEffect } from "@react-navigation/native";
// import { useCallback } from "react";

import { Image } from "react-native";
import { color } from "react-native-elements/dist/helpers";
const LeafImage = require("@/app/styles/pngs/leaf.png");
interface SelectedFriendHomeProps {
  borderRadius: DimensionValue;
  borderColor: string;
}

const SelectedFriendHome: React.FC<SelectedFriendHomeProps> = ({
  canvasKey,
  userId,

  paddingHorizontal,
  primaryColor,
  primaryOverlayColor,
  darkGlassBackground,
  darkerGlassBackground,
  categoryColorsArray,
  // darkerOverlayBackgroundColor,
  primaryBackground,
  selectedFriendId,
  selectedFriendName,
  skiaFontLarge,
  skiaFontSmall,
  themeColors,
  handleToggleColoredDots,
  coloredDotsModeValue,
}) => {
  // console.log("selected friend home rerendered");
  const headerRef = useRef(null);

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const CARD_BACKGROUND = "rgba(0,0,0,0.8)";

  const MESSAGE_HEADER_HEIGHT = 240;
  const { capsuleList } = useCapsuleList();
  // const scrollRef = useRef<ScrollView | null>(null);
  const [coloredDotsMode, setColoredDotsMode] = useState(false);

  useDerivedValue(() => {
    runOnJS(setColoredDotsMode)(coloredDotsModeValue.value);
  }, [coloredDotsModeValue]);
  // useFocusEffect(
  //   useCallback(() => {
  //     // This runs when screen gains focus (you can do nothing here)

  //     return () => {
  //       // This runs when screen loses focus
  //       if (scrollRef.current) {
  //         scrollRef.current.scrollTo({ y: 0, animated: true });
  //       }
  //     };
  //   }, [])
  // );
  const handleScroll = (event) => {
    if (!headerRef.current) return;

    headerRef.current.measure((x, y, width, height, pageX, pageY) => {
      const scrollY = event.nativeEvent.contentOffset.y;
      const isVisibleNow = pageY - scrollY >= 0;
      if (isVisibleNow !== true) {
        smallHeaderVisibility.value = withTiming(1, { duration: 300 });
      } else {
        smallHeaderVisibility.value = withTiming(0, { duration: 20 });
      }
    });
  };

  const scrollRef = useRef<ScrollView>(null);
  const momentsFieldY = useRef<number>(0);
  const momentsFieldRef = useRef<View>(null);

  const smallHeaderVisibility = useSharedValue(0);

  const smallHeaderAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: smallHeaderVisibility.value,
    };
  });

  const ELEMENTS_BACKGROUND = "transparent";
  useEffect(() => {
    if (coloredDotsMode && scrollRef.current && momentsFieldRef.current) {
      momentsFieldRef.current.measureLayout(
        scrollRef.current,
        (x, y) => {
          scrollRef.current?.scrollTo({ y, animated: true });
        },
        () => console.log("measure failed"),
      );
    } else if (!coloredDotsMode && scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [coloredDotsMode]);
  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingHorizontal: paddingHorizontal,
          },
        ]}
      > 

        <View style={styles.itemsContainer}>
          <View style={styles.containerOverScrollView}>
            {/* {!coloredDotsMode && (

       
            <Animated.View
              style={[
                smallHeaderAnimationStyle,
                styles.smallerHeaderContainer,
                {
                  backgroundColor: primaryOverlayColor,
                 
                },
              ]}
            >
              <Text style={[subWelcomeTextStyle, { color: primaryColor }]}>
                {selectedFriendName}
              </Text>
            </Animated.View>
                 )} */}

            <ScrollView
              ref={scrollRef}
              // ref={scrollRef}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              style={{ width: "100%", zIndex: 9 }}
              contentContainerStyle={{
                paddingHorizontal: 0,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: MESSAGE_HEADER_HEIGHT, // EYEBALL
                  width: "100%",
                  opacity: coloredDotsMode ? 0 : 1,
                }}
                ref={headerRef}
              >
                <FriendHeaderMessageUI
                  primaryBackground={primaryBackground}
                  height={MESSAGE_HEADER_HEIGHT} // SAME EYEBALL AS ABOVE
                  userId={userId}
                  friendId={selectedFriendId}
                  cardBackgroundColor={CARD_BACKGROUND}
                  darkGlassBackground={darkGlassBackground}
                  darkerGlassBackground={darkerGlassBackground}
                  selectedFriendName={`${selectedFriendName}`}
                  friendDarkColor={themeColors.darkColor}
                  primaryColor={primaryColor}
                  welcomeTextStyle={welcomeTextStyle}
                  backgroundColor={primaryOverlayColor}
                  onPress={() => console.log("nada!")}
                />
              </View>

              <View style={styles.itemsContainer}>
                {capsuleList && !coloredDotsMode && (
                  <View
                    pointerEvents="none"
                    style={styles.animatedClimberWrapper}
                  >
                    <AnimatedClimber
                      total={capsuleList.length}
                      skiaFont={skiaFontLarge}
                      textColor={primaryColor}
                    />
                  </View>
                )}

                <View
                  ref={momentsFieldRef}
                  style={{
                    width: "100%",
                    zIndex: 2000,
                    elevation: 2000, 
                    height: coloredDotsMode ? 600 : 380,
                  }}
                >
                  <MomentsField
                    canvasKey={canvasKey}
                    canvasHeight={300}
                    heightFull={600}
                    userId={userId}
                    textColor={primaryColor}
                    overlayColor={primaryOverlayColor}
                    darkerOverlayBackgroundColor={darkerGlassBackground}
                    themeColors={themeColors}
                    categoryColors={categoryColorsArray}
                    skiaFontLarge={skiaFontLarge}
                    skiaFontSmall={skiaFontSmall}
                    handleToggleColoredDots={handleToggleColoredDots}
                    coloredDotsModeValue={coloredDotsModeValue}
                  />
                </View>

                {/* {!coloredDotsMode && ( */}
                <View style={{ opacity: coloredDotsMode ? 0 : 1 }}>
                  <View style={{ width: "100%", marginBottom: 6, zIndex: 2 }}>
                    <Pics
                      primaryColor={primaryColor}
                      primaryOverlayColor={ELEMENTS_BACKGROUND}
                      userId={userId}
                      friendId={selectedFriendId}
                    />
                  </View>

                  <View style={{ width: "100%", marginVertical: 4, zIndex: 2 }}>
                    <Helloes
                      userId={userId}
                      primaryColor={primaryColor}
                      primaryOverlayColor={ELEMENTS_BACKGROUND}
                      friendId={selectedFriendId}
                    />
                  </View>
                  <View style={{ width: "100%", marginBottom: 6, zIndex: 2 }}>
                    <History
                      primaryColor={primaryColor}
                      primaryOverlayColor={ELEMENTS_BACKGROUND}
                      userId={userId}
                      friendId={selectedFriendId}
                    />
                  </View>
                </View>
                {/* )} */}
                {/* <View style={{ width: "100%", marginBottom: 6 }}>
                  <Moments
                    primaryColor={primaryColor}
                    primaryOverlayColor={ELEMENTS_BACKGROUND}
                    userId={userId}
                    friendId={selectedFriendId}
                  />
                </View> */}

                <View style={{ width: "100%", height: 330 }}></View>
              </View>
            </ScrollView>
            <View style={{ borderRadius: 40, height: 100 }}></View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    // zIndex: 3,
  },
  smallerHeaderContainer: {
    position: "absolute",
    width: "100%",
    top: 0,
    height: "auto",
    padding: 6,
    zIndex: 3,
    elevation: 3,
  }, 

  containerOverScrollView: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    // overflow: "hidden",
    borderColor: "black",
  },
  itemsContainer: {
    height: "100%",
    width: "100%",
  },
  animatedClimberWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
});

export default React.memo(SelectedFriendHome);
