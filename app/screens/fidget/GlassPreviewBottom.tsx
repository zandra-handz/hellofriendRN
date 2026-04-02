import React, { useRef } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import SvgIcon from "@/app/styles/SvgIcons";

import FooterButtonRow from "./FooterButtonRow";
import FooterButtonRowConditional from "./FooterButtonRowConditional";

type Props = {
  color: string;
  backgroundColor: string;
  borderColor: string;
  moment: object | null;
  hasContent: boolean;
  showButton: boolean;
  noContentText: string;
  onPressEdit: (moment: object) => void;
  onPressNew: () => void;
};

const GlassPreviewBottom = ({
  readingMode = false,
  speedSetting = 1,
  autoPickUp = false,
  isPollMode = false,
  color = "red",
  highlightColor = "yellow",
  backgroundColor = "orange",
  borderColor = "pink",
  moment,
  hasContent = false,
  showButton = false,
  noContentText = "No content",
  onPressEdit,
  onPressNew,
  onPress_rescatterMoments,
  onPress_recenterMoments,
  onPress_saveAndExit,
  onPress_toggleReadMode,
  onPress_changeSpeed,
  onPress_geckoVoice,
  onPress_autoPickUpScreen,
  onPress_QRCodeScreen,
}: Props) => {
  const translateY = useSharedValue(300); // Start off-screen
  const hasAnimated = useRef(false); // Track if we've animated
  useFocusEffect(
    React.useCallback(() => {
      // Only animate if we haven't animated yet
      if (!hasAnimated.current) {
        translateY.value = withSpring(100, {
          damping: 40,
          stiffness: 500,
        });
        hasAnimated.current = true;
      }

      // Reset when screen loses focus (navigating away)
      return () => {
        translateY.value = 300;
        hasAnimated.current = false;
      };
    }, []),
  );

  const containerAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[containerAnimationStyle, styles.previewOuter]}>
      <View
        style={[
          styles.previewWrapper,
          {
            backgroundColor,
            borderColor,
          },
        ]}
      >
        {/* <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}> */}

<View style={styles.momentContentWrapper}>


        {moment?.id && (
          <Pressable
            onPress={() => onPressEdit(moment)}
            style={styles.momentViewButton}
          >
            {/* <SvgIcon name={`chevron_double_right`} size={28} color={color} /> */}
          </Pressable>
        )}

        {moment && (
          <View style={styles.scrollViewContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.previewHeader, { color }]}>
                {moment.category}
              </Text>

              <Text style={[styles.previewText, { color }]}>
                {moment.capsule}
              </Text>
            </ScrollView>
          </View>
        )}

        {!moment && (
          <View style={styles.scrollViewContainer}>
            <Pressable onPress={onPressNew} style={styles.noMomentWrapper}>
              <Text style={[styles.noMomentText, { color }]}>
                {noContentText}{" "}
                <Text style={[styles.buttonText, { color }]}>Add one?</Text>
              </Text>
            </Pressable>
          </View>
        )}
        </View>
        <FooterButtonRowConditional
          backgroundColor="transparent"
          color={color}
          style={{ marginBottom: 0 }}
          iconSize={20}
          showSecondary={readingMode}
          centerButton={{
            iconName: "close",
            label: "Exit",
            onPress: onPress_saveAndExit,
          }}
          primaryButtons={[
            {
              iconName: "motion_play_outline",
              label: "Resting",
              onPress: onPress_toggleReadMode,
            },
            { iconName: "chat", label: "Ask", onPress: onPress_geckoVoice },
                        {
              iconName: "close",
              label: "Exit",
              onPress: onPress_saveAndExit,
              confirmationRequired: true,
              confirmationMessage: "Save game and exit?",
            },
               {
              iconName: "image_filter_center_focus",
              label: "Reset",
              onPress: onPress_recenterMoments,
            },
                 {
              iconName: "qrcode_scan",
              label: isPollMode ? "Polling..." : "Scan",
              color: isPollMode ? highlightColor : color,
              onPress: onPress_QRCodeScreen, 
            },


          ]}
          secondaryButtons={[
            {
              iconName: "motion_pause_outline",
              label: "Reading...",
              onPress: onPress_toggleReadMode,
            },
            {
              iconName:
                speedSetting === 0
                  ? "speedometer_slow"
                  : speedSetting === 1
                    ? "speedometer_medium"
                    : "speedometer",
              label: "Speed",
              onPress: onPress_changeSpeed,
            },
            // {
            //   iconName: "close",
            //   label: "Exit",
            //   onPress: onPress_saveAndExit,
            //   confirmationRequired: true,
            //   confirmationMessage: "Save and exit?",
            // },

            {
              iconName: "auto_mode",
              color: autoPickUp ? highlightColor : color,
              label: autoPickUp ? "Auto on" : "Auto off",
              onPress: onPress_autoPickUpScreen,
            },
       
                        {
              iconName: "scatter_plot",
              label: "Scatter",
              onPress: onPress_rescatterMoments,
            },
         
                 {
              iconName: "qrcode_scan",
              label: isPollMode ? "Polling..." : "Scan",
              color: isPollMode ? highlightColor : color,
              onPress: onPress_QRCodeScreen, 
            },
          ]}
        />

        {/* </SafeAreaView> */}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  previewOuter: {
    width: "100%",
    paddingHorizontal: 0,
    //  bottom: -70,
    height: 320,
    paddingBottom: 200,
    // backgroundColor: 'orange'
  },
  previewWrapper: {
    width: "100%",
    height: 280,
    // borderWidth: 2,
    borderRadius: 70,
    padding: 30,
    paddingHorizontal: 10,
    paddingTop: 20,

    paddingBottom: 0,
  },
  momentContentWrapper: {
    paddingHorizontal: 20,

  },

  noMomentWrapper: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noMomentText: {
    fontSize: 17,
  },
  previewText: {
    fontSize: 14,
    lineHeight: 22,
    alignSelf: "center",
  },
  previewHeader: {
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 32,
    alignSelf: "center",
  },
  scrollViewContainer: {
    height: 110,
    width: "100%",

    // backgroundColor: 'pink',
  },
  momentViewButton: {
    padding: 20,
    width: "100%",
    height: 50,
    top: 0,
    right: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    zIndex: 9000,
    position: "absolute",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default React.memo(GlassPreviewBottom);
