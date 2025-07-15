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
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";

interface Props {
  isVisible: boolean;
  isFullscreen: boolean;
  headerContent: React.ReactElement;
  headerIcon: React.ReactElement;
  questionText: string;
  children: React.ReactElement;
  borderRadius: number;
  contentPadding: number;
  onClose: () => void;
}

const ModalWithGoBack: React.FC<Props> = ({
  isVisible,
  isFullscreen=false,
  headerContent,
  headerIcon,
  questionText,
  children,
  borderRadius = 40,
  contentPadding = 10,

  onClose,
}) => {
  const { themeStyles } = useGlobalStyle();
  // const fadeAnim = useRef(new Animated.Value(0)).current;

  const xAnim = useSharedValue(500);
  const scaleAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);

  const timeoutRef = useRef(null);


  const MODAL_CONTENT_PADDING = 10;
  const MODAL_BORDER_RADIUS = 40;

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
      opacityAnim.value = withDelay(300, withTiming(1, { duration: 300})); //withDelay value works with durations of two lines above
    }

    if (!internalIsVisible) {
       opacityAnim.value = withTiming(0, { duration: 100});
      scaleAnim.value = withTiming(0, { duration: 300 });
      xAnim.value = withTiming(500, { duration: 300 });
    }
  }, [internalIsVisible]);
  // useEffect(() => {
  //   Animated.timing(fadeAnim, {
  //     toValue: isVisible ? 1 : 0,
  //     duration: 300,
  //     useNativeDriver: true,
  //   }).start();
  // }, [isVisible]);

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
          <Animated.View style={[contentAnimationStyle, { width: "100%", flex: 1, padding: contentPadding, paddingBottom: contentPadding * 1.7 }]}>
            {children}
            
            </Animated.View>
            <ButtonBaseSpecialSave
              label="Back" 
               image={require("@/app/assets/shapes/redheadcoffee.png")}
              imageSize={80}
              labelSize={17}
                    labelPlacement={'start'}
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
    height: '100%',

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
