import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Modal, Text, Image } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import Animated, {
  SharedValue,
  SlideInLeft,
  SlideOutRight,
  FadeIn,
  FadeInUp,
  FadeOutUp,
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
import ModalBarBack from "../buttons/scaffolding/ModalBarBack";
import GlobalPressable from "../appwide/button/GlobalPressable";
import TreeModalBigButton from "./TreeModalBigButton";

import { ThemeAheadOfLoading } from "@/src/types/FriendTypes";

interface Props {
  isVisible: boolean;
  isFullscreen?: boolean;
  headerIcon: React.ReactElement;
  children: React.ReactElement;
  borderRadius?: number;
  contentPadding?: number;
  onClose: () => void;
  useModalBar: boolean;
  bottomSpacer: number;
  isKeyboardVisible?: boolean;
  buttonTitle: string;
  rightSideButtonItem: React.ReactElement;
  friendTheme?: ThemeAheadOfLoading | undefined;
  infoItem?: React.ReactElement;
}

const ModalScaleLikeTree: React.FC<Props> = ({
  isVisible,
  isFullscreen = false,
  isKeyboardVisible,
  buttonTitle = "",
  children,
  borderRadius = 40,
  contentPadding = 10,
  bottomSpacer = 0,
  rightSideButtonItem,
  friendTheme,
  infoItem, 

  onClose,
}) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  // const fadeAnim = useRef(new Animated.Value(0)).current;

  const xAnim = useSharedValue(500);
  const scaleAnim = useSharedValue(0);
  console.log(friendTheme);

  const scaleWidthAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    return {
      translateY: xAnim.value,
      scaleY: scaleAnim.value,
      scaleX: scaleWidthAnim.value,
    };
  });

  const contentAnimationStyle = useAnimatedStyle(() => {
    return { opacity: opacityAnim.value };
  });

  // const formHeight = 610;
  // const headerHeight = "auto";
  // const buttonHeight = 50;
  // const headerSpacing = 10;
  // const headerPaddingTop = 10;

  useEffect(() => {
    if (internalIsVisible) {
      xAnim.value = withTiming(0, { duration: 280 });
      scaleAnim.value = withTiming(1, { duration: 200 });
      scaleWidthAnim.value = withDelay(100, withTiming(1, { duration: 200 }));
      //   opacityAnim.value = withDelay(300, withTiming(1, { duration: 300 })); //withDelay value works with durations of two lines above

      opacityAnim.value = withTiming(1, { duration: 300 }); //withDelay value works with durations of two lines above
    }

    if (!internalIsVisible) {
      opacityAnim.value = withTiming(0, { duration: 80 });
      scaleAnim.value = withTiming(0, { duration: 300 });
      scaleWidthAnim.value = withTiming(0, { duration: 200 });
      xAnim.value = withTiming(500, { duration: 300 });
    }
  }, [internalIsVisible]);

  return (
    <>
      <Modal
        transparent={!isFullscreen}
        visible={isVisible}
        style={{}}
        //   style={modalAnimationStyle}
        animationType="slide"
      >
        <Animated.View
          style={[
            modalAnimationStyle,
            styles.modalContainer,

            {
              //   marginBottom: bottomSpacer,
              //   borderColor:
              //     themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
              //   borderRadius: borderRadius,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.modalContent,
              themeStyles.primaryBackground,
              {
                borderColor:
                  themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
                borderRadius: borderRadius,
              },
            ]}
          >
            <Animated.View
              style={[
                contentAnimationStyle,
                {
                  width: "100%",
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: contentPadding,
                  // paddingBottom: contentPadding * 1.7,
                },
              ]}
            >
              <View style={styles.bodyContainer}>
                {children}
                <Animated.View
                entering={FadeInUp.delay(500)}
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    paddingVertical: 10,
                    borderRadius: 30,
                    borderWidth:StyleSheet.hairlineWidth,

                    borderColor: manualGradientColors.lightColor,
                    padding: 10,
             
                   // marginBottom: 0,
                  //  backgroundColor: "orange",
                    marginTop: 10, // this plus flexShrink in sectionUserCategories gets the category flatlist to play nice with this
                 
                    alignItems: "center",
                    height: "auto",
                  //  height: 100,
                  }}
                >
                  {infoItem}
                </Animated.View>
              </View>
            </Animated.View>
          </Animated.View>
          {!isKeyboardVisible && (
            <Animated.View
              entering={FadeInUp.duration(800)}
              exiting={FadeOutUp.duration(0)}
              style={{
                height: bottomSpacer,
                //   position: 'absolute',
                bottom: 0,

                width: "100%",
                backgroundColor:
                  friendTheme === undefined
                    ? manualGradientColors.lightColor
                    : friendTheme.lightColor, //to match friend profile button circle color
                borderRadius: 10,
              }}
            >
              <TreeModalBigButton
                onClose={handleCustomClose}
                friendTheme={friendTheme}
                label={buttonTitle}
                labelColor={
                  friendTheme === undefined
                    ? manualGradientColors.homeDarkColor
                    : friendTheme.fontColorSecondary
                }
                rightSideElement={rightSideButtonItem}
              />
            </Animated.View>
          )}
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    backgroundColor: "rgba(0, 0, 0, 0.84)",
  },
  modalContent: {
    padding: 10,
    width: "100%", // Fixed width of 80% of the screen
    minHeight: 200, // Minimum height to prevent collapse
    height: "auto",
    flex: 1,
    //flexGrow: 1,

    borderWidth: 2,
    alignItems: "center",
    backgroundColor: "white", // Ensure it's visible
    flexDirection: "column",
    justifyContent: "space-between",

    // overflow: 'hidden',
  },
  bodyContainer: { 
    flex: 1,
   // paddingBottom: 10,

    textAlign: "left",
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
    // height: "8%",
    alignItems: "center",
  },
});

export default ModalScaleLikeTree;
