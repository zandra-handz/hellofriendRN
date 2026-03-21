import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import SvgIcon from "@/app/styles/SvgIcons";
import { AppFontStyles } from "@/app/styles/AppFonts";
import GlobalHoldPressable from "@/app/components/appwide/button/GlobalHoldPressable";
import GlobalPressable from "@/app/components/appwide/button/GlobalPressable";
import SlideToDeleteHeader from "@/app/components/foranimations/SlideToDeleteHeader";
import useDeleteMoment from "@/src/hooks/CapsuleCalls/useDeleteMoment";
import manualGradientColors from "@/app/styles/StaticColors";
import SlideDelete from "@/app/components/foranimations/SlideDelete";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const PEEK_HEIGHT = 0;
const START_Y = SCREEN_HEIGHT - PEEK_HEIGHT;

type Props = {
  color: string;
  backgroundColor: string;
  borderColor: string;
  darkerOverlayColor: string;
  lighterOverlayColor: string;
  moment: object | null;
  hasContent: boolean;
  showButton: boolean;
  noContentText: string;
  userId: number;
  friendId: number;
  onPressNew: () => void;
  onPressBack: () => void;
  saveToHello: () => void; 
  deletMoment: () => void;
  triggerClose?: number;
};

const GlassMoment = ({
  color = "red",
  backgroundColor = "orange",
  borderColor = "pink",
  darkerOverlayColor,
  lighterOverlayColor,
  moment,
  hasContent = false,
  showButton = false,
  noContentText = "No content",
  onPressBack,
  onPressNew,
  userId,
  friendId,
  saveToHello,
  deleteMoment,
  triggerClose,
}: Props) => {
  const translateY = useSharedValue(START_Y);
  const hasAnimated = useRef(false);
  const navigation = useNavigation();
  const welcomeTextStyle = AppFontStyles.welcomeText;
  const { handleDeleteMoment } = useDeleteMoment({ userId, friendId });

  const [utilityTrayVisible, setUtilityTrayVisible] = useState(false);
  const closeUtilityTray = () => setUtilityTrayVisible(false);
  const toggleUtilityTray = () => setUtilityTrayVisible((prev) => !prev);

  const categoryColor = manualGradientColors.lightColor;

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

  const handlePressBack = () => {
    translateY.value = withTiming(START_Y, { duration: 180 });
    setTimeout(() => {
      onPressBack();
    }, 200);
  };

  useEffect(() => {
    if (triggerClose) {
      handlePressBack();
    }
  }, [triggerClose]);

  const handleEditMoment = () => {
    navigation.navigate("MomentFocus", {
      momentText: moment?.capsule || null,
      updateExistingMoment: true,
      existingMomentObject: moment || null,
    });
    closeUtilityTray();
  };

  const handleDelete = (item) => {
    try {
      handleDeleteMoment({
        friend: friendId,
        id: item.id,
        user_category_name: item.user_category_name,
      });
    } catch (error) {
      console.error("Error deleting moment:", error);
    }
  };

  const renderTrayToggler = useCallback(
    () => (
      <GlobalPressable
        onPress={toggleUtilityTray}
        style={styles.trayTogglerContainer}
      >
        <SvgIcon
          name={!utilityTrayVisible ? "eye" : "eye_closed"}
          size={20}
          color={color}
          style={{ opacity: 0.6 }}
        />
      </GlobalPressable>
    ),
    [toggleUtilityTray, color, utilityTrayVisible],
  );

  const renderTrashIcon = () => (
    <SvgIcon name={"delete"} size={20} color={color} />
  );

  return (
    <Animated.View style={[containerAnimationStyle, styles.previewOuter]}>
      <View style={[styles.previewWrapper, { backgroundColor, borderColor }]}>
        <SafeAreaView style={{ flex: 1 }}>
          {moment && (
            <>
              <View style={styles.categoryHeaderContainer}>
                <Text
                  numberOfLines={1}
                  style={[
                    welcomeTextStyle,
                    {
                      color,
                      fontSize: 22,
                      fontWeight: "700",
                      letterSpacing: -0.4,
                      paddingRight: 40,
                    },
                  ]}
                >
                  {moment.user_category_name}
                </Text>
              </View>

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
                    {moment.capsule}
                  </Text>
                </ScrollView>
              </View>

              <View style={styles.bottomUtilitiesContainer}>
                {utilityTrayVisible && (
                  <View style={styles.trayExpanded}>
                    <GlobalPressable
                      onPress={handleEditMoment}
                      style={[
                        styles.editBtn,
                        { backgroundColor: darkerOverlayColor },
                      ]}
                    >
                      <SvgIcon
                        name={"pencil"}
                        size={18}
                        color={lighterOverlayColor}
                      />
                    </GlobalPressable>
                    <View style={styles.deleteSliderWrapper}>
                      <SlideDelete
                        paddingHorizontal={6}
                        itemToDelete={moment}
                        onPress={deleteMoment}
                        sliderWidth={"100%"}
                        targetIcon={renderTrashIcon}
                        sliderTextColor={color}
                        onDelete={deleteMoment}
                      />
                    </View>
                  </View>
                )}
                <View style={styles.bottomActionRow}>
                  {renderTrayToggler()}
                  <GlobalHoldPressable
                    onPress={saveToHello}
                    style={[
                      styles.saveButtonStyle,
                      { borderColor: `${categoryColor}50`, borderWidth: 1 },
                    ]}
                  >
                    <SvgIcon
                      name={"plus_circle"}
                      size={20}
                      color={manualGradientColors.darkColor}
                    />
                  </GlobalHoldPressable>
                </View>
              </View>
            </>
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

          <View style={styles.closeButtonWrapper}>
            <Pressable onPress={handlePressBack} style={styles.closeButton}>
              <SvgIcon name={`close`} color={"pink"} size={24} />
            </Pressable>
          </View>
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
    marginBottom: 16,
  },
  scrollViewContainer: {
    flex: 1,
    width: "100%",
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
  bottomUtilitiesContainer: {
    width: "100%",
    paddingTop: 8,
  },
  trayExpanded: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 8,
    marginBottom: 10,
    height: 40,
  },
  editBtn: {
    padding: 8,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  deleteSliderWrapper: {
    flex: 1,
    height: 40,
  },
  bottomActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 4,
  },
  trayTogglerContainer: {
    padding: 4,
    paddingHorizontal: 2,
    alignItems: "center",
    borderRadius: 999,
  },
  saveButtonStyle: {
    padding: 6,
    borderRadius: 999,
    overflow: "hidden",
    height: 38,
    width: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonWrapper: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: 30,
  },
  closeButton: {
    backgroundColor: "red",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  closeX: {
    fontSize: 25,
  },
});

export default GlassMoment;