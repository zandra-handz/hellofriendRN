import React, { useRef } from "react";

import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  DimensionValue,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import FriendHeaderMessageUI from "./FriendHeaderMessageUI";

import SvgIcon from "@/app/styles/SvgIcons";
import { AppFontStyles } from "@/app/styles/AppFonts";
import TalkingPointsChart from "./TalkingPointsChart";
import Pics from "./Pics";
import Helloes from "./Helloes";
interface SelectedFriendHomeProps {
  borderRadius: DimensionValue;
  borderColor: string;
}

const SelectedFriendHome: React.FC<SelectedFriendHomeProps> = ({
  userId,

  paddingHorizontal,
  primaryColor,
  primaryOverlayColor,
  // darkerOverlayBackgroundColor,

  selectedFriendId,
  selectedFriendName,
  skiaFontLarge,
  skiaFontSmall,
  themeColors,
}) => {
  console.log("selected friend home rerendered");
  const headerRef = useRef(null);

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const CARD_BACKGROUND = "rgba(0,0,0,0.8)";

  const MESSAGE_HEADER_HEIGHT = 240;

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

  const smallHeaderVisibility = useSharedValue(0);

  const smallHeaderAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: smallHeaderVisibility.value,
    };
  });

  const ELEMENTS_BACKGROUND = "transparent";

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: paddingHorizontal,
        },
      ]}
    >
      <SvgIcon
        name={"leaf"}
        size={1200}
        color={"#8bc34a"}
        style={{
          position: "absolute",
          top: -740,
          left: -470,
          opacity: 0.8,
          transform: [{ rotate: "200deg" }, { scaleX: -1 }],
        }}
      />
      <View
        style={{
          zIndex: 30000,

          height: "100%",
          width: "100%",
        }}
      >
        <View style={styles.containerOverScrollView}>
          <View
            style={{
              flex: 1,
              width: "100%",
              alignItems: "center",
              paddingBottom: 0,
            }}
          >
            <Animated.View
              style={[
                smallHeaderAnimationStyle,
                {
                  position: "absolute",
                  width: "100%",
                  top: 0,
                  height: "auto",

                  padding: 6,

                  backgroundColor: primaryOverlayColor,

                  zIndex: 5000,
                  elevation: 5000,
                },
              ]}
            >
              <Text style={[subWelcomeTextStyle, { color: primaryColor }]}>
                {selectedFriendName}
              </Text>
            </Animated.View>

            <ScrollView
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              style={{ width: "100%" }}
              contentContainerStyle={{
                paddingHorizontal: 0,
                alignItems: "center",
              }}
            >
              <View
                style={{ flex: 1, height: MESSAGE_HEADER_HEIGHT, // EYEBALL
                   width: "100%" }}
                ref={headerRef}
              >
                <FriendHeaderMessageUI
                height={MESSAGE_HEADER_HEIGHT} // SAME EYEBALL AS ABOVE
                  userId={userId}
                  friendId={selectedFriendId}
                  cardBackgroundColor={CARD_BACKGROUND}
                  selectedFriendName={`${selectedFriendName}`}
                  primaryColor={primaryColor}
                  welcomeTextStyle={welcomeTextStyle}
                  backgroundColor={primaryOverlayColor}
                  onPress={() => console.log("nada!")}
                />
              </View>

              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  width: "100%",
                 // backgroundColor: "orange",
                }}
              >
                <View style={{ width: "100%", marginVertical: 3 }}>
                  {/* {!loadingDash && ( */}
                  <TalkingPointsChart
                    themeColors={themeColors}
                    skiaFontLarge={skiaFontLarge}
                    skiaFontSmall={skiaFontSmall}
                  />
                  {/* )} */}
                </View>

                <View style={{ width: "100%", marginVertical: 3 }}>
                  <Pics
                    primaryColor={primaryColor}
                    primaryOverlayColor={ELEMENTS_BACKGROUND}
                    userId={userId}
                    friendId={selectedFriendId}
                  />
                </View>

                <View style={{ width: "100%", marginVertical: 3 }}>
                  <Helloes
                    primaryColor={primaryColor}
                    primaryOverlayColor={ELEMENTS_BACKGROUND}
                    friendId={selectedFriendId}
                  />
                </View>

                <View style={{ width: "100%", height: 130 }}></View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    padding: 0,
    // minHeight: 190,
    height: "100%",
    alignContent: "center",

    alignItems: "center",
    justifyContent: "space-between",
  },
  containerOverScrollView: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    // flexGrow: 1,
    height: "100%",
    overflow: "hidden",
    borderWidth: 0,
    borderColor: "black",
  },
  textContainer: {
    zIndex: 5,
    width: "100%",
    flexWrap: "wrap",
    height: "100%",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(SelectedFriendHome);
