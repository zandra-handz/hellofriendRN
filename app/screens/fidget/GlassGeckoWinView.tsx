import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import FooterButtonRow from "./FooterButtonRow";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { AppFontStyles } from "@/app/styles/AppFonts";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const PEEK_HEIGHT = 0;
const START_Y = SCREEN_HEIGHT - PEEK_HEIGHT;

type Props = {
  color: string;
  backgroundColor: string;
  borderColor: string;
  darkerOverlayColor: string;
  headerLabel?: string;
  subLabel?: string;
  capsule?: string;
  onBack: () => void;
  triggerClose?: number | boolean;
};

const GlassGeckoWinView = ({
  color = "red",
  backgroundColor = "orange",
  borderColor = "pink",
  darkerOverlayColor,
  headerLabel,
  subLabel,
  capsule,
  onBack,
  triggerClose,
}: Props) => {
  const translateY = useSharedValue(START_Y);
  const hasAnimated = useRef(false);
  const welcomeTextStyle = AppFontStyles.welcomeText;

  useFocusEffect(
    React.useCallback(() => {
      if (!hasAnimated.current) {
        translateY.value = withSpring(0, {
          damping: 40,
          stiffness: 500,
        });
        hasAnimated.current = true;
      }

      return () => {
        translateY.value = START_Y;
        hasAnimated.current = false;
      };
    }, []),
  );

  const containerAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const closeOut = (after: () => void) => {
    translateY.value = withTiming(START_Y, { duration: 180 });
    setTimeout(after, 200);
  };

  useEffect(() => {
    if (triggerClose) {
      translateY.value = withTiming(START_Y, { duration: 180 });
    }
  }, [triggerClose]);

  const handleBack = () => closeOut(onBack);

  return (
    <Animated.View style={[containerAnimationStyle, styles.previewOuter]}>
      <View style={[styles.previewWrapper, { backgroundColor, borderColor }]}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.categoryHeaderContainer}>
            {headerLabel ? (
              <Text
                numberOfLines={2}
                style={[
                  welcomeTextStyle,
                  {
                    color,
                    fontSize: 22,
                    fontWeight: "700",
                    letterSpacing: -0.4,
                    flex: 1,
                    paddingRight: 12,
                  },
                ]}
              >
                {headerLabel}
              </Text>
            ) : null}
          </View>

          {subLabel ? (
            <Text
              numberOfLines={1}
              style={[
                welcomeTextStyle,
                {
                  color,
                  fontSize: 12,
                  fontWeight: "600",
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  opacity: 0.7,
                  marginBottom: 14,
                },
              ]}
            >
              {subLabel}
            </Text>
          ) : null}

          <View style={styles.scrollViewContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              <Text
                style={[
                  welcomeTextStyle,
                  { color, fontSize: 15, lineHeight: 24, opacity: 0.85 },
                ]}
              >
                {capsule ?? ""}
              </Text>
            </ScrollView>
          </View>

          <FooterButtonRow
            backgroundColor={darkerOverlayColor}
            color={color}
            buttons={[
              {
                iconName: "chevron_left",
                label: "Back",
                onPress: handleBack,
              },
            ]}
          />
        </SafeAreaView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  previewOuter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  previewWrapper: {
    flex: 1,
    borderRadius: 70,
    padding: 30,
    paddingTop: 20,
    paddingBottom: 0,
  },
  categoryHeaderContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 6,
    marginBottom: 8,
  },
  scrollViewContainer: {
    flex: 1,
    width: "100%",
  },
});

export default GlassGeckoWinView;
