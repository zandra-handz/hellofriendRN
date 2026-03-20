import {
  View,
  Text,
  DimensionValue,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import SlideToDeleteHeader from "../foranimations/SlideToDeleteHeader";
import useDeleteMoment from "@/src/hooks/CapsuleCalls/useDeleteMoment";
import { AppFontStyles } from "@/app/styles/AppFonts";
import GlobalHoldPressable from "../appwide/button/GlobalHoldPressable";
import SvgIcon from "@/app/styles/SvgIcons";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import GlobalPressable from "../appwide/button/GlobalPressable";
import manualGradientColors from "@/app/styles/StaticColors";

interface Props {
  item: object;
  index: number;
  width: DimensionValue;
  height: DimensionValue;
  marginBottom: number;
  currentIndexValue: SharedValue;
  cardScaleValue: SharedValue;
  marginKeepAboveFooter: number;
}

const RIM = 10;

const MomentViewPage: React.FC<Props> = ({
  userId,
  friendId,
  textColor,
  darkerOverlayColor,
  lighterOverlayColor,
  darkGlassBackground,
  item,
  index,
  width,
  height,
  marginBottom,
  marginKeepAboveFooter, // ← restored
  currentIndexValue,
  cardScaleValue,
  handlePreAddMoment,
}) => {
  const { handleDeleteMoment } = useDeleteMoment({ userId, friendId });
  const navigation = useNavigation();
  const welcomeTextStyle = AppFontStyles.welcomeText;

  const [utilityTrayVisible, setUtilityTrayVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState();

  const closeUtilityTray = () => setUtilityTrayVisible(false);
  const toggleUtilityTray = () => setUtilityTrayVisible((prev) => !prev);

  if (!item || !item.user_category) return null;

  const categoryColor = manualGradientColors.lightColor;

  useAnimatedReaction(
    () => currentIndexValue.value,
    (newIndex, prevIndex) => {
      if (newIndex !== prevIndex) runOnJS(setCurrentIndex)(newIndex);
    },
    [],
  );

  const cardScaleAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: cardScaleValue.value }],
  }));

  const renderTrayToggler = useCallback(
    () => (
      <GlobalPressable onPress={toggleUtilityTray} style={styles.trayTogglerContainer}>
        <SvgIcon
          name={!utilityTrayVisible ? "eye" : "eye_closed"}
          size={20}
          color={textColor}
          style={{ opacity: 0.6 }}
        />
      </GlobalPressable>
    ),
    [toggleUtilityTray, textColor, utilityTrayVisible],
  );

  const renderTrashIcon = () => (
    <SvgIcon name={"delete"} size={20} color={textColor} />
  );

  const handleEditMoment = () => {
    navigation.navigate("MomentFocus", {
      momentText: item?.capsule || null,
      updateExistingMoment: true,
      existingMomentObject: item || null,
    });
    closeUtilityTray();
  };

  const saveToHello = async () => {
    if (!friendId || !item?.id) return;
    try {
      handlePreAddMoment({ friendId, capsuleId: item.id, isPreAdded: true });
    } catch (error) {
      console.error("Error during pre-save:", error);
    }
  };

  const handleDelete = (item) => {
    try {
      handleDeleteMoment({ friend: friendId, id: item.id, user_category_name: item.user_category_name });
    } catch (error) {
      console.error("Error deleting moment:", error);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        cardScaleAnimation,
        {
          width,
          paddingBottom: marginKeepAboveFooter, // ← pushes card up from footer
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            marginBottom,
            backgroundColor: darkGlassBackground,
            borderColor: `${categoryColor}22`,
          },
        ]}
      >
        {/* Top glow line */}
        <View style={[styles.cardGlowLine, { backgroundColor: categoryColor }]} />

        {/* Category strip */}
        {/* <View style={styles.catStrip}>
          <View style={[styles.catDot, { backgroundColor: categoryColor, shadowColor: categoryColor }]} />
          <Text numberOfLines={1} style={[styles.catLabel, { color: categoryColor }]}>
            {item.user_category_name?.toUpperCase()}
          </Text>
          <View style={[styles.catLine, { backgroundColor: `${categoryColor}28` }]} />
        </View> */}

        {/* Category title */}
        <View style={styles.categoryHeaderContainer}>
          <Text
            numberOfLines={1}
            style={[
              welcomeTextStyle,
              { color: textColor, fontSize: 22, fontWeight: "700", letterSpacing: -0.4, paddingRight: 40 },
            ]}
          >
            {item.user_category_name}
          </Text>
        </View>

        {/* Body */}
        <View style={styles.bodyWrapper}>
          <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
            <Text style={[welcomeTextStyle, { color: textColor, fontSize: 15, lineHeight: 24, opacity: 0.85 }]}>
              {item.capsule}
            </Text>
          </ScrollView>
        </View>

        {/* Bottom utilities */}
        <View style={styles.bottomUtilitiesContainer}>
          {utilityTrayVisible && (
            <View style={styles.trayExpanded}>
              <GlobalPressable
                onPress={handleEditMoment}
                style={[styles.editBtn, { backgroundColor: darkerOverlayColor }]}
              >
                <SvgIcon name={"pencil"} size={18} color={lighterOverlayColor} />
              </GlobalPressable>
              <View style={styles.deleteSliderWrapper}>
                <SlideToDeleteHeader
                  paddingHorizontal={6}
                  itemToDelete={item}
                  onPress={handleDelete}
                  sliderWidth={"100%"}
                  targetIcon={renderTrashIcon}
                  sliderTextColor={textColor}
                />
              </View>
            </View>
          )}

          <View style={styles.bottomActionRow}>
            {renderTrayToggler()}
            <GlobalHoldPressable
              onPress={saveToHello}
              style={[styles.saveButtonStyle, { borderColor: `${categoryColor}50`, borderWidth: 1 }]}
            >
              <SvgIcon name={"plus_circle"} size={20} color={manualGradientColors.darkColor} />
            </GlobalHoldPressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RIM,
    backgroundColor: "transparent",
  },
  card: {
    flex: 1,
    width: "100%",
    borderRadius: 70,
    borderWidth: 2,
    padding: 30,
    paddingTop: 20,
    flexDirection: "column",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  cardGlowLine: {
    position: "absolute",
    top: 0,
    left: "15%",
    right: "15%",
    height: 1,
    opacity: 0.45,
    borderRadius: 1,
  },
  catStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 3,
  },
  catLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.4,
    fontFamily: "Poppins-Regular",
  },
  catLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    borderRadius: 1,
  },
  categoryHeaderContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 6,
    marginBottom: 16,
  },
  bodyWrapper: {
    flex: 1,
    width: "100%",
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
});

export default MomentViewPage;