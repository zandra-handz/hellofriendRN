import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import FooterButtonRow from "./FooterButtonRow";
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
import GlobalPressable from "@/app/components/appwide/button/GlobalPressable";
import useDeleteMoment from "@/src/hooks/CapsuleCalls/useDeleteMoment";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import manualGradientColors from "@/app/styles/StaticColors";

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
  onPressShare: () => void;
  saveToHello: () => void;
  deletMoment: () => void;
  triggerClose?: number;
  inputNumberVisible: boolean;
};

const GlassMoment = ({
  shouldResetRef,
  color = "red",
  backgroundColor = "orange",
  borderColor = "pink",
  darkerOverlayColor,
  moment,
  onPressBack,
  onPressNew,
  onPressShare,
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
  const { navigateToFriendHome } = useAppNavigations();

  const [dangerVisible, setDangerVisible] = useState(false);

  // const FOOTER_HEIGHT = 90;
  // const FOOTER_PADDING_BOTTOM = 12;
  const FOOTER_ICON_SIZE = 24;

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

  const handlePressHome = () => {
    if (shouldResetRef) {
      shouldResetRef.current = true;
    }
    translateY.value = withTiming(START_Y, { duration: 180 });
    setTimeout(() => {
      navigateToFriendHome({
        resetTimestamp: Date.now(),
      });
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

  const FooterButtonItem = ({
    iconName,
    label,
    onPress,
    confirmationRequired,
    confirmationTitle,
    confirmationMessage,
  }) => (
    <GlobalPressable
      onPress={() => {
        if (confirmationRequired) {
          Alert.alert(
            confirmationTitle || "Just to be sure",
            confirmationMessage || "Are you sure?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Yes", onPress },
            ],
          );
        } else {
          onPress();
        }
      }}
      style={styles.footerSection}
    >
      <SvgIcon name={iconName} size={FOOTER_ICON_SIZE} color={color} />
      <Text style={[styles.footerLabel, { color, fontSize: 11 }]}>{label}</Text>
    </GlobalPressable>
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
            </>
          )}

          {!moment && (
            <View style={styles.scrollViewContainer}>
              <Pressable
                onPress={onPressNew}
                style={styles.noMomentWrapper}
              ></Pressable>
            </View>
          )}

          {dangerVisible && moment && (
            <View
              style={[
                styles.dangerTray,
                { backgroundColor: darkerOverlayColor },
              ]}
            >
              <FooterButtonItem
                iconName="pencil"
                label="Edit"
                onPress={handleEditMoment}
              />
              <FooterButtonItem
                iconName="delete"
                label="Delete"
                onPress={() => handleDelete(moment)}
                confirmationRequired
                confirmationTitle="Delete moment?"
                confirmationMessage="This can't be undone."
              />
            </View>
          )}

          <FooterButtonRow
            backgroundColor={darkerOverlayColor}
            color={color}
            buttons={[
              { iconName: "home", label: "Home", onPress: handlePressHome },
              {
                iconName: dangerVisible ? "eye_closed" : "eye",
                label: dangerVisible ? "Hide" : "More",
                onPress: () => setDangerVisible((prev) => !prev),
              },
              { iconName: "close", label: "Close", onPress: handlePressBack },
              {
                iconName: "send_circle_outline",
                label: "Send",
                onPress: onPressShare,
              },
              { iconName: "plus_circle", label: "Add", onPress: saveToHello },
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
  dangerTray: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "space-around",
    height: 70,
    marginBottom: 8,
  },
  footerContainer: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "space-around",
  },
  footerSection: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  footerLabel: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: "bold",
  },
});

export default GlassMoment;
