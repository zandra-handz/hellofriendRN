import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Modal, Text } from "react-native";
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";

import PlainSafeView from "../appwide/format/PlainSafeView";

interface Props {
  isVisible: boolean;
  isFullscreen: boolean;
  headerIcon: React.ReactElement;
  questionText: string;
  children: React.ReactElement;
  borderRadius?: number;
  primaryColor: string;
  backgroundColor: string;
  contentPadding?: number;
  onClose: () => void;
}

const HalfScreenModal: React.FC<Props> = ({
  isVisible,
  primaryColor,
  backgroundColor,
  headerIcon,
  questionText,
  children,
  borderRadius = 40,
  contentPadding = 10,

  onClose,
  modalIsTransparent = true,
  padding = 10,
}) => {
  const xAnim = useSharedValue(500);
  const scaleAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);

  // const timeoutRef = useRef(null);

  const [internalIsVisible, setInternalIsVisible] = useState(isVisible);

  // const modalAnimationStyle = useAnimatedStyle(() => {
  //   return { translateY: xAnim.value, scaleY: scaleAnim.value };
  // });

  const translateY = useSharedValue(50);

  //translateY.value = withTiming(60, { duration: 0 });

  useEffect(() => {
    // Start lower immediately (no animation)
    translateY.value = withTiming(60, { duration: 0 });

    // Then bounce to 0
    translateY.value = withSpring(0, {
      // damping: 6,
      damping: 20, // higher = less bounce
      stiffness: 150,
      mass: 0.8,
      overshootClamping: false,
    });
  }, []);

  // const springAnimationStyle = useAnimatedStyle(() => ({
  //   transform: [{ translateY: translateY.value }],
  // }));

  useEffect(() => {
    if (internalIsVisible) {
      xAnim.value = withTiming(0, { duration: 300 });
      scaleAnim.value = withTiming(1, { duration: 300 });
      opacityAnim.value = withDelay(300, withTiming(1, { duration: 300 }));
    }

    if (!internalIsVisible) {
      opacityAnim.value = withTiming(0, { duration: 100 });
      scaleAnim.value = withTiming(0, { duration: 300 });
      xAnim.value = withTiming(500, { duration: 300 });
    }
  }, [internalIsVisible]);

  return (
    <Modal
      transparent={modalIsTransparent}
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      visible={isVisible}
      backdropColor={backgroundColor}
      // style={modalAnimationStyle}
      animationType="slide"
      style={{
        //  backgroundColor: "rgba(0, 0, 0, 0.5)"
        backgroundColor: backgroundColor,
        
      }}
    >
      <Animated.View
        style={[
          // modalAnimationStyle,
          styles.modalContainer,
          //  { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // semi-transparent black
        ]}
      >
        <PlainSafeView style={{ flex: 1 }}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: backgroundColor,
                // borderColor:
                //   themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
                borderRadius: borderRadius,
                padding: padding
              },
            ]}
          >
            <View
              style={[
                styles.headerContainer,
                {
                  paddingTop: contentPadding,
                  paddingHorizontal: contentPadding,
                },
              ]}
            >
              {/* {headerIcon && headerIcon} */}
              {questionText && (
                <Text style={[styles.questionText, { color: primaryColor }]}>
                  {questionText}
                </Text>
              )}
            </View>
            <View style={{ flex: 1 }}>{children}</View>
          </View>
        </PlainSafeView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,

    flexDirection: "column",

    justifyContent: "flex-start",
    //  paddingBottom: 80, // EYEBALL
    alignItems: "center",
    //  backgroundColor: "rgba(0, 0, 0, 0.84)",
  },
  modalContent: {
    width: "100%",
    minHeight: 200,
    height: "50%",
    flex: 1,

    //  borderWidth: 2,
    alignItems: "center",
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    maxHeight: 50,

    height: 100,
    marginVertical: 10, // header spacing
    alignItems: "center",
    justifyContent: "flex-start",
  },
  questionText: {
    fontSize: 24,
    textAlign: "center",
    // marginLeft: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    width: "100%",
    height: "8%",
    alignItems: "center",
  },
});

export default HalfScreenModal;
