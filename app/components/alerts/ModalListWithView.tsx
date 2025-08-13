import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Modal, Pressable, Text, Image } from "react-native";
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
import ListViewModalBigButton from "./ListViewModalBigButton";
import HelpButton from "./HelpButton";
import QuickView from "./QuickView";
import HelperMessage from "./HelperMessage";
import { ThemeAheadOfLoading } from "@/src/types/FriendTypes";
import TextInputView from "./TextInputView";
import { ItemViewProps } from "@/src/types/MiscTypes";
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
  helperMessageText?: string;
  helpModeTitle: string;
  quickView?: ItemViewProps | null; // set modal data in parent, render from this component to keep above footer button like helper message
  nullQuickView?: () => void;
  textInputView?: ItemViewProps | null; // set modal data in parent, render from this component to keep above footer button like helper message
  nullTextInputView?: () => void;
  secondInfoItem?: React.ReactElement;
}

const ModalListWithView: React.FC<Props> = ({
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
  helperMessageText = "helper message goes here",
  helpModeTitle = "Help mode",
  quickView,
  nullQuickView,
  textInputView,
  nullTextInputView,
  onClose,
  secondInfoItem,
}) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  // const fadeAnim = useRef(new Animated.Value(0)).current;

  const xAnim = useSharedValue(500);
  const scaleAnim = useSharedValue(0);

  const scaleWidthAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [helperMessage, setHelperMessage] = useState<null | {
    text: string;
    error: boolean;
  }>(null);

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
        {helperMessage && (
          <HelperMessage
            isInsideModal={true}
            topBarText={helpModeTitle}
            message={helperMessage.text}
            error={helperMessage.error}
            onClose={() => setHelperMessage(null)}
          />
        )}

        {quickView && (
          <QuickView
            topBarText={quickView.topBarText}
            isInsideModal={true}
            message={quickView.message}
            update={quickView.update}
            view={quickView.view}
            onClose={nullQuickView}
          />
        )}
                {textInputView && (
          <TextInputView
            topBarText={textInputView.topBarText}
            isInsideModal={true}
            message={textInputView.message}
            update={textInputView.update}
            view={textInputView.view}
            onClose={nullTextInputView}
          />
        )}
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
          <Animated.View //if you put padding here it will affect the info item
            style={[
              styles.modalContent,
              themeStyles.primaryBackground,
              {
                borderColor:
                  themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
                borderRadius: borderRadius,
                // backgroundColor: 'yellow',
              },
            ]}
          >
            <Animated.View
              style={[
                contentAnimationStyle,
                {
                  width: "100%",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-between",

                  // padding: contentPadding,
                  // paddingBottom: contentPadding * 1.7,
                },
              ]}
            >
              <View style={styles.bodyContainer}>
                <View style={{ flex: 1, padding: 20, paddingBottom: 4 }}>
                  {children}
                </View>
                {secondInfoItem != undefined && (
                  <Animated.View
                    entering={FadeInUp.delay(500)}
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderRadius: 30,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      //borderWidth: StyleSheet.hairlineWidth,
                      //  backgroundColor: "red",
                      //  borderColor: manualGradientColors.lightColor,
                      padding: 30,
                      paddingTop: 18,
                      paddingBottom: 26,
                      borderTopWidth: StyleSheet.hairlineWidth,
                      borderColor:
                        themeStyles.lighterOverlayBackgroundColor
                          .backgroundColor,

                      // marginBottom: 0,
                      backgroundColor:
                        themeStyles.primaryBackground.backgroundColor,

                      alignItems: "center",
                      height: "auto",
                      //  height: 100,
                    }}
                  >
                    {secondInfoItem}
                  </Animated.View>
                )}

                {infoItem != undefined && !isKeyboardVisible && (
                  <Animated.View
                    entering={FadeInUp.delay(500)}
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderRadius: 30,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      //borderWidth: StyleSheet.hairlineWidth,
                      //  backgroundColor: "red",
                      //  borderColor: manualGradientColors.lightColor,
                      padding: 30,
                      paddingTop: 18,
                      paddingBottom: 26,
                      borderTopWidth: StyleSheet.hairlineWidth,
                      borderColor:
                        themeStyles.lighterOverlayBackgroundColor
                          .backgroundColor,

                      // marginBottom: 0,
                      backgroundColor:
                        themeStyles.primaryBackground.backgroundColor,

                      alignItems: "center",
                      height: "auto",
                      //  height: 100,
                    }}
                  >
                    {infoItem}
                    <HelpButton
                      onPress={() =>
                        setHelperMessage({
                          text: `${helperMessageText}`,
                          error: false,
                        })
                      }
                    />
                  </Animated.View>
                )}
              </View>
            </Animated.View>
          </Animated.View>
          {!isKeyboardVisible && (
            <Animated.View
              entering={FadeInUp.duration(800)}
              exiting={FadeOutUp.duration(0)}
              style={{
                height: bottomSpacer,
                zIndex: 1,
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
              <ListViewModalBigButton
                onClose={handleCustomClose}
                // height={bottomSpacer}
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
    padding: 0,
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

export default ModalListWithView;
