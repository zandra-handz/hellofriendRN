import { View, Text, DimensionValue, ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import SlideToDeleteHeader from "../foranimations/SlideToDeleteHeader";
import useDeleteMoment from "@/src/hooks/CapsuleCalls/useDeleteMoment";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import { AppFontStyles } from "@/app/styles/AppFonts";
 
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
  categoryColorsMap: object;
  currentIndexValue: SharedValue;
  cardScaleValue: SharedValue;

  marginKeepAboveFooter: number;
}

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
  categoryColorsMap,
  currentIndexValue,
  cardScaleValue,
}) => {
  const { handlePreAddMoment } = usePreAddMoment({
    userId: userId,
    friendId: friendId,
  });
  const { handleDeleteMoment, deleteMomentMutation } = useDeleteMoment({
    userId: userId,
    friendId: friendId,
  });
  const navigation = useNavigation();
  const welcomeTextStyle = AppFontStyles.welcomeText;
  const CARD_BACKGROUND = "rgba(0,0,0,0.8)";

  const [utilityTrayVisible, setUtilityTrayVisible] = useState(false);

  const openUtilityTray = () => {
    setUtilityTrayVisible(true);
  };

  const closeUtilityTray = () => {
    setUtilityTrayVisible(false);
  };

  const toggleUtilityTray = () => {
    setUtilityTrayVisible((prev) => !prev);
  };

  const renderTrayToggler = useCallback(() => {
    return (
      <GlobalPressable
        onPress={toggleUtilityTray}
        style={{
          padding: 4,
          paddingHorizontal: 2,
          width: 'auto',

          alignItems: "center",
          //  backgroundColor: darkerOverlayColor,
          borderRadius: 999,
        }}
      >
        <SvgIcon
          name={!utilityTrayVisible ? "eye" : "eye_closed"}
          size={20}
          color={textColor}
        />
      </GlobalPressable>
    );
  }, [toggleUtilityTray, textColor]);

  const [currentIndex, setCurrentIndex] = useState();

  if (!item || !categoryColorsMap || !item.user_category) {
    return null; // or a fallback component
  }

  const categoryColor = item?.user_category
    ? (categoryColorsMap[String(item.user_category)] ?? "#ccc")
    : "#ccc";

  useAnimatedReaction(
    () => currentIndexValue.value,
    (newIndex, prevIndex) => {
      if (newIndex !== prevIndex) {
        runOnJS(setCurrentIndex)(newIndex);
      }
    },
    []
  );

  const cardScaleAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: cardScaleValue.value }],
  }));

  const renderTrashIcon = () => {
    return (
      <SvgIcon name={"delete"} size={20} color={textColor} />
    );
  };

  const handleEditMoment = () => {
    console.log("navving to edit screen", item?.capsule);

    navigation.navigate("MomentFocus", {
      momentText: item?.capsule || null,
      updateExistingMoment: true,
      existingMomentObject: item || null,
    });
    closeUtilityTray();
  };

  const saveToHello = async () => {
    if (!friendId || !item?.id) {
      return;
    }
    try {
      handlePreAddMoment({
        friendId: friendId,
        capsuleId: item.id,
        isPreAdded: true,
      });
    } catch (error) {
      console.error("Error during pre-save:", error);
    }
  };

  const handleDelete = (item) => {
    // console.log("handle delete moment in navigator triggered: ", item);
    try {
      const momentData = {
        friend: friendId,
        id: item.id,
        user_category_name: item.user_category_name,
      };

      handleDeleteMoment(momentData);
    } catch (error) {
      console.error("Error deleting moment:", error);
    }
  };

  return (
    <Animated.View
      style={[
        cardScaleAnimation,
        {
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          padding: 6,
          borderWidth: 0,
          width: width,
        },
      ]}
    >
      <View
        style={[
          {
            width: "100%",
            height: "100%",
          },
        ]}
      >
        <View
          style={[
            {
              padding: 20,
              borderRadius: 40,
             // borderRadius: 12,
              flexDirection: "column",
              justifyContent: "flex-start",
              flex: 1,
              marginBottom: marginBottom,
              zIndex: 1,
              overflow: "hidden",
              // backgroundColor: darkerOverlayColor,
              backgroundColor: darkGlassBackground,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              //  height: 30,
              height: "auto",
              flexGrow: 1,
              flexWrap: "wrap",
              alignItems: "top",
              paddingTop: 6, // WEIRD EYEBALLIN
              justifyContent: "space-between",
              //  flex: 1,
              width: "100%",
            }}
          > 

            <Text
              style={[
                welcomeTextStyle,
                {
                  color: textColor,
                  fontSize: 24,
                  paddingRight: 80,
                },
              ]}
            >
              {" "}
              {item.user_category_name}
            </Text>
          </View>

          <View style={{ height: "90%", width: "100%" }}>
            <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
              <Text
                style={[
                  welcomeTextStyle,
                  { color: textColor, fontSize: 15, lineHeight: 24 },
                ]}
              >
                {" "}
                {item.capsule}
              </Text>
            </ScrollView>
            <View
              style={{
                width: "100%",
                height: "auto",
                // backgroundColor: "orange",
                justifyContent: "center",
                position: "absolute",
                flexDirection: "column",
                bottom: 0,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  right: 0,
                  bottom: 10,
                }}
              >
                {renderTrayToggler()}
              </View>

              {utilityTrayVisible && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      marginBottom: 20,
                      justifyContent: "flex-end",
                    }}
                  >
                    <GlobalPressable
                    onPress={saveToHello}
                      style={{
                        padding: 2,
                        borderRadius: 999,
                        backgroundColor: manualGradientColors.lightColor,
                      }}
                    >
                      <SvgIcon
                        name={"plus_circle"} 
                        size={20}
                        color={lighterOverlayColor}
                        color={manualGradientColors.darkColor}
                      />
                    </GlobalPressable>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginBottom: 12,
                      justifyContent: "flex-end",
                    }}
                  >
                    <GlobalPressable
                    // onPress={handleEditMoment}
                         onPress={handleEditMoment}
                      style={{
                        padding: 2,
                        borderRadius: 999,
                        backgroundColor: manualGradientColors.lightColor,
                        backgroundColor: darkerOverlayColor,
                      }}
                    >
                      <SvgIcon
                        name={"pencil"} 
                        size={20}
                        color={lighterOverlayColor}
                        color={categoryColor}
                      />
                    </GlobalPressable>
                  </View>
                  <View style={{ flexDirection: "row", height: 40 }}>
                    <SlideToDeleteHeader
                    paddingHorizontal={6}
                      itemToDelete={item}
                      onPress={handleDelete}
                      sliderWidth={"100%"}
                      targetIcon={renderTrashIcon}
                      sliderTextColor={textColor}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
        {/* <SlideToDeleteHeader
          itemToDelete={item}
          onPress={handleDelete}
          sliderWidth={"100%"}
          targetIcon={TrashOutlineSvg}
          sliderTextColor={textColor}
        /> */}
      </View>
    </Animated.View>
  );
};

export default MomentViewPage;
