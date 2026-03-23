import React, { useEffect, useCallback, useRef, useState } from "react";
import { StyleSheet, View, ScrollView, DimensionValue } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { useDerivedValue, runOnJS } from "react-native-reanimated";
import FriendHeaderMessageUI from "./FriendHeaderMessageUI";
import AnimatedToggler from "../buttons/AnimatedToggler";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import AnimatedClimber from "@/app/screens/fidget/AnimatedClimber";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import animationTimings from "@/app/styles/AnimationTimings";
import { AppFontStyles } from "@/app/styles/AppFonts";
import MomentsField from "./MomentsField";
import History from "./History";
import Pics from "./Pics";
import Helloes from "./Helloes";
// import Moments from "./Moments";

interface SelectedFriendHomeProps {
  borderRadius: DimensionValue;
  borderColor: string;
}

const SelectedFriendHome: React.FC<SelectedFriendHomeProps> = ({
  canvasKey,
  userId,
  friendId,
  friendName,
  friendNextDate,
  friendChangeTimestamp,
  paddingHorizontal,
  primaryColor,
  primaryOverlayColor,
  darkGlassBackground,
  darkerGlassBackground,
  categoryColorsArray,
  primaryBackground,
  skiaFontLarge,
  skiaFontSmall,
  friendLightColor,
  friendDarkColor,
  handleToggleColoredDots,
  coloredDotsModeValue,
  handleMomentScreenNoScroll,
  handleNavigateToGecko,
}) => {
  const { navigateToMoments } = useAppNavigations();

  const currentScrollY = useRef(0);
  const savedScrollY = useRef(0);
  const hasInitialized = useRef(false);

  const scrollRef = useRef<ScrollView>(null);

  const momentsFieldRef = useRef<View>(null);

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;
  const timing = animationTimings.toggleRotate;

  const MESSAGE_HEADER_HEIGHT = 240;
  const { capsuleList } = useCapsuleList();
  const [coloredDotsMode, setColoredDotsMode] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);

  const ELEMENTS_BACKGROUND = "transparent";

  useDerivedValue(() => {
    runOnJS(setColoredDotsMode)(coloredDotsModeValue.value);
  }, [coloredDotsModeValue]);

  useFocusEffect(
    useCallback(() => {
      if (hasInitialized.current && savedScrollY.current > 0) {
        const targetY = savedScrollY.current;
        savedScrollY.current = 0; // clear after capturing the value to use
        scrollRef.current?.scrollTo({ y: 1000, animated: false });
        setTimeout(() => {
          scrollRef.current?.scrollTo({ y: targetY, animated: true });
        }, 50);
      }
      hasInitialized.current = true;
    }, []),
  );

  const didNavToMoments = useRef(false);
  // const contentHeight = useRef(0); // DEBUG

  const handleNavToMoments = (categoryLabel) => {
    savedScrollY.current = currentScrollY.current;
    didNavToMoments.current = true;
    // console.log("handleNavToMoments - contentHeight:", contentHeight.current); // DEBUG
    scrollRef.current?.scrollTo({ y: 1500, animated: true });
    setTimeout(() => {
      navigateToMoments({ scrollTo: categoryLabel });
    }, 200);
  };

  const CANVAS_HEIGHT = 350;
  const FULL_HEIGHT = 920; // need this for the scroll when navving to and from moments list 



  useEffect(() => {
    if (coloredDotsMode && scrollRef.current && momentsFieldRef.current) {
      momentsFieldRef.current.measureLayout(
        scrollRef.current,
        (x, y) => {
          scrollRef.current?.scrollTo({ y, animated: true });
          setTimeout(() => setScrollLocked(true), 300);
        },
        () => console.log("measure failed"),
      );
    } else if (!coloredDotsMode && scrollRef.current) {
      setScrollLocked(false);
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
            <ScrollView
              ref={scrollRef}
              scrollEnabled={!scrollLocked}
              scrollEventThrottle={16}
              onScroll={(e) => {
                currentScrollY.current = e.nativeEvent.contentOffset.y;
              }}
              // onContentSizeChange={(w, h) => { // DEBUG
              //   contentHeight.current = h;
              // }}
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
                  height: MESSAGE_HEADER_HEIGHT,
                  width: "100%",
                  opacity: coloredDotsMode ? 0 : 1,
                }}
              >
                <FriendHeaderMessageUI
                  primaryBackground={primaryBackground}
                  friendChangeTimestamp={friendChangeTimestamp}
                  height={MESSAGE_HEADER_HEIGHT}
                  userId={userId}
                  friendId={friendId}
                  friendName={friendName}
                  friendNextDate={friendNextDate}
                  darkGlassBackground={darkGlassBackground}
                  darkerGlassBackground={darkerGlassBackground}
                  selectedFriendName={`${friendName}`}
                  friendDarkColor={friendDarkColor}
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
                      containerStyle={styles.aniamtedClimberPosition}
                    />
                  </View>
                )}

                <View
                  ref={momentsFieldRef}
                  style={[
                    styles.momentsFieldContainer,
                    {
                      height: coloredDotsMode ? FULL_HEIGHT : CANVAS_HEIGHT,
                    },
                  ]}
                >
                  <View style={styles.momentsFieldTopBar}>
                    <AnimatedToggler
                      labelA={`Categories`}
                      labelB={``}
                      fontStyle={subWelcomeTextStyle}
                      iconAName={`eye`}
                      iconBName={`chevron_left`}
                      rotationAtoB={-90}
                      rotationBtoA={90}
                      valueAB={!!coloredDotsMode}
                      timing={timing + 200}
                      colorA={primaryColor}
                      colorB={primaryColor}
                      onPressA={handleToggleColoredDots}
                      onPressB={handleToggleColoredDots}
                    />
                  </View>

                  <MomentsField
                    friendId={friendId}
                    canvasKey={canvasKey}
                    canvasHeight={CANVAS_HEIGHT}
                    heightFull={FULL_HEIGHT} //620
                    userId={userId}
                    textColor={primaryColor}
                    overlayColor={primaryOverlayColor}
                    darkerOverlayBackgroundColor={darkerGlassBackground}
                    friendColor={friendLightColor}
                    categoryColors={categoryColorsArray}
                    skiaFontLarge={skiaFontLarge}
                    skiaFontSmall={skiaFontSmall}
                    handleToggleColoredDots={handleToggleColoredDots}
                    coloredDotsModeValue={coloredDotsModeValue}
                    handleNavToMoments={handleNavToMoments}
                    handleMomentScreenNoScroll={handleMomentScreenNoScroll}
                    handleNavigateToGecko={handleNavigateToGecko}
                  />
                </View>

                <View style={{ opacity: coloredDotsMode ? 0 : 1 }}>
                  <View
                    style={{ width: "100%", marginBottom: 6, zIndex: 10000 }}
                  >
                    <Pics
                      primaryColor={primaryColor}
                      primaryOverlayColor={ELEMENTS_BACKGROUND}
                      userId={userId}
                      friendId={friendId}
                    />
                  </View>

                  <View style={{ width: "100%", marginVertical: 6, zIndex: 2 }}>
                    <Helloes
                      userId={userId}
                      primaryColor={primaryColor}
                      primaryOverlayColor={ELEMENTS_BACKGROUND}
                      friendId={friendId}
                    />
                  </View>
                  <View style={{ width: "100%", marginTop: 6, zIndex: 2 }}>
                    <History
                      primaryColor={primaryColor}
                      primaryOverlayColor={ELEMENTS_BACKGROUND}
                      userId={userId}
                      friendId={friendId}
                    />
                  </View>
                </View>

                <View style={styles.scrollViewSpacer}></View>
              </View>
            </ScrollView>
            <View style={styles.belowScrollViewSpacer}></View>
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
  aniamtedClimberPosition: {
    position: "absolute",
    top: -700,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  containerOverScrollView: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    borderColor: "black",
  },
  itemsContainer: {
    height: "100%",
    width: "100%",
  },
  momentsFieldTopBar: {
    height: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  toggleCategoryViewWrapper: {
    width: 100,
    height: 30,
    zIndex: 200000,
    backgroundColor: "limegreen",
  },
  momentsFieldContainer: {
    width: "100%",
    zIndex: 2000,
    elevation: 2000,
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
  scrollViewSpacer: {
    width: "100%",
    height: 330,
  },
  belowScrollViewSpacer: {
    borderRadius: 40,
    height: 100,
  },
});

export default React.memo(SelectedFriendHome);
