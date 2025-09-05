import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Modal, Text } from "react-native"; 
import Animated, {
 
  useSharedValue,
  useAnimatedStyle, 
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { useLDTheme } from "@/src/context/LDThemeContext";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";
import ModalBarBack from "../buttons/scaffolding/ModalBarBack";

interface Props {
  isVisible: boolean;
  isFullscreen?: boolean;
  headerIcon: React.ReactElement;
  questionText: string;
  children: React.ReactElement;
  borderRadius?: number;
  contentPadding?: number;
  onClose: () => void;
  useModalBar: boolean;
}

const ModalWithGoBack: React.FC<Props> = ({
  isVisible,
  isFullscreen = false,

  headerIcon,
  questionText,
  children,
  borderRadius = 40,
  contentPadding = 10,
  useModalBar = false,

  onClose,
}) => {

  const { lightDarkTheme } = useLDTheme(); 
  // const fadeAnim = useRef(new Animated.Value(0)).current;

  const xAnim = useSharedValue(500);
  const scaleAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // const MODAL_CONTENT_PADDING = 10;
  // const MODAL_BORDER_RADIUS = 40;

  const [internalIsVisible, setInternalIsVisible] = useState(isVisible);

  const handleCustomClose = () => {
    setInternalIsVisible(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 300);
  };

  const modalAnimationStyle = useAnimatedStyle(() => {
    return { translateY: xAnim.value, scaleY: scaleAnim.value };
  });

  const contentAnimationStyle = useAnimatedStyle(() => {
    return { opacity: opacityAnim.value };
  });

  const formHeight = 610;
  const headerHeight = "auto";
  const buttonHeight = 50;
  const headerSpacing = 10;
  const headerPaddingTop = 10;

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
    // <>
    // {isVisible && (

    <Modal
      transparent={!isFullscreen}
      visible={isVisible}
      style={modalAnimationStyle}
      animationType="slide"
    >
      <Animated.View style={[modalAnimationStyle, styles.modalContainer]}>
        <Animated.View
          style={[
            styles.modalContent,
     
            { 
              backgroundColor: lightDarkTheme.primaryBackground,
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
              <Text style={[styles.questionText, {color: lightDarkTheme.primaryText}]}>
                {questionText}
              </Text>
            )}
          </View>
          <Animated.View
            style={[
              contentAnimationStyle,
              {
                width: "100%",
                flex: 1,
                padding: contentPadding,
                paddingBottom: contentPadding * 1.7,
              },
            ]}
          >
            {children}
          </Animated.View>
          {!useModalBar && (
            <ButtonBaseSpecialSave
              label="Back"
              image={require("@/app/assets/shapes/redheadcoffee.png")}
              imageSize={80}
              labelSize={17}
              labelPlacement={"start"}
              labelPaddingHorizontal={20}
              isDisabled={false}
              height={56}
              imagePositionHorizontal={0}
              imagePositionVertical={0}
              borderRadius={0}
              dynamicPadding={4}
              borderBottomLeftRadius={borderRadius}
              borderBottomRightRadius={borderRadius}
              borderTopLeftRadius={borderRadius / 2}
              borderTopRightRadius={borderRadius / 2}
              onPress={handleCustomClose} // adds a delay to let inside component animation run before modal closes
            />
          )}
          {useModalBar && (
            <ModalBarBack
              label="Back" 

              labelSize={17} 
              labelPlacement={"start"}
              labelPaddingHorizontal={20}
              isDisabled={false}
              height={56}
              borderRadius={0}
              dynamicPadding={1}
              borderBottomLeftRadius={borderRadius}
              borderBottomRightRadius={borderRadius}
              borderTopLeftRadius={borderRadius / 3}
              borderTopRightRadius={borderRadius / 3}
              onPress={handleCustomClose} // adds a delay to let inside component animation run before modal closes
           primaryColor={lightDarkTheme.primaryText}
              overlayColor={lightDarkTheme.overlayBackground}
            
            />
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    zIndex: 70000,
    elevation: 70000,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.84)", // Slightly transparent background
  },
  modalContent: {
    width: "94%", // Fixed width of 80% of the screen
    minHeight: 200, // Minimum height to prevent collapse
    height: "100%",

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

export default ModalWithGoBack;
