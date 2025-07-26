import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Modal, Text } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import Animated, {
  SharedValue,
  SlideInLeft,
  SlideOutRight,
  FadeInUp,
  SlideInUp,
  SlideOutDown,
  FadeOutDown,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import GlobalPressable from "../appwide/button/GlobalPressable";
import { BouncyEntrance } from "../headers/BouncyEntrance";

interface Props {
  isVisible: boolean;
  isFullscreen: boolean;
  headerIcon: React.ReactElement;
  questionText: string;
  children: React.ReactElement;
  borderRadius?: number;
  contentPadding?: number;
  onClose: () => void;
}

const HalfScreenModal: React.FC<Props> = ({
  isVisible,

  headerIcon,
  questionText,
  children,
  borderRadius = 40,
  contentPadding = 10,

  onClose,
}) => {
  const { themeStyles } = useGlobalStyle();

  const xAnim = useSharedValue(500);
  const scaleAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);

  const timeoutRef = useRef(null);

  const [internalIsVisible, setInternalIsVisible] = useState(isVisible);

  const modalAnimationStyle = useAnimatedStyle(() => {
    return { translateY: xAnim.value, scaleY: scaleAnim.value };
  });
  const headerHeight = "auto";

  const headerSpacing = 10;

  const translateY = useSharedValue(50);

  //translateY.value = withTiming(60, { duration: 0 });

  useEffect(() => {
    // Start lower immediately (no animation)
    translateY.value = withTiming(60, { duration: 0 });

    // Then bounce to 0
    translateY.value = withSpring(0, {
      damping: 6,
      stiffness: 150,
      mass: 0.8,
      overshootClamping: false,
    });
  }, []);

  const springAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (internalIsVisible) {
      xAnim.value = withTiming(0, { duration: 300 });
      scaleAnim.value = withTiming(1, { duration: 300 });
      opacityAnim.value = withDelay(300, withTiming(1, { duration: 300 })); //withDelay value works with durations of two lines above
    }

    if (!internalIsVisible) {
      opacityAnim.value = withTiming(0, { duration: 100 });
      scaleAnim.value = withTiming(0, { duration: 300 });
      xAnim.value = withTiming(500, { duration: 300 });
    }
  }, [internalIsVisible]);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      style={modalAnimationStyle}
      animationType="slide"
    >
      <Animated.View style={[modalAnimationStyle, styles.modalContainer]}>
        <Animated.View
          style={[
            styles.modalContent,
            themeStyles.genericTextBackground,
            {
              borderColor:
                themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
              borderRadius: borderRadius,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: headerHeight,
              paddingTop: contentPadding,
              paddingHorizontal: contentPadding,
              maxHeight: 50,
              marginVertical: headerSpacing,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {headerIcon && headerIcon}
            {questionText && (
              <Text style={[styles.questionText, themeStyles.genericText]}>
                {questionText}
              </Text>
            )}
          </View>
          <View style={{flex: 1}}>
 {children}
 
            
          </View>
 
            {/* <BouncyEntrance delay={30}>
              
            <GlobalPressable
              //  onPress={handleNavToLocationSearch}
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                height: "auto",
                padding: 60,
                borderRadius: 10,
                backgroundColor: "red",
              }}
            ></GlobalPressable>
            
            </BouncyEntrance>  
                     <BouncyEntrance delay={60}>
              
            <GlobalPressable
              //  onPress={handleNavToLocationSearch}
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                height: "auto",
                padding: 60,
                borderRadius: 10,
                backgroundColor: "red",
              }}
            ></GlobalPressable>
            
            </BouncyEntrance> */}
        </Animated.View>
      </Animated.View>
    </Modal>

    // )}
    // </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.84)", // Slightly transparent background
  },
  modalContent: {
    width: "94%", // Fixed width of 80% of the screen
    minHeight: 200, // Minimum height to prevent collapse
    height: "50%",

    borderWidth: 2,
    alignItems: "center",
    backgroundColor: "white", // Ensure it's visible
    flexDirection: "column",
    justifyContent: "space-between",
    // overflow: 'hidden',
  },
  questionText: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    width: "100%",
    height: "8%",
    alignItems: "center",
  },
});

export default HalfScreenModal;
