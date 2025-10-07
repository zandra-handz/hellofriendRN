import { View, Text, ScrollView, DimensionValue } from "react-native";
import React, { useCallback, useState } from "react";

import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";

import LocationNumber from "./LocationNumber";
import LocationAddress from "./LocationAddress";
import LocationUtilityTray from "./LocationUtilityTray";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import LocationCustomerReviews from "./LocationCustomerReviews";
import useFetchAdditionalDetails from "@/src/hooks/LocationCalls/useFetchAdditionalDetails";
import manualGradientColors from "@/src/hooks/StaticColors";
import Hours from "./Hours";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
interface LocationPageViewProps {
  item: object;
  index: number;
  width: DimensionValue;
  height: DimensionValue;
  currentIndexValue: SharedValue;
  cardScaleValue: SharedValue;
  openModal: () => void;
  closeModal: () => void;
}

const LocationViewPage: React.FC<LocationPageViewProps> = ({
  userId,
  friendId,
  friendName,
  item,
  index,
  width,

  onAddPress,
  onRemovePress,
  currentIndexValue,
  cardScaleValue,
  currentDay, // object with .index and .day
  selectedDay,
  handleSelectedDay,
  marginBottom,
  lighterOverlayColor = "orange",
  darkerOverlayColor,
  openModal,
  closeModal,
  themeAheadOfLoading,
  primaryColor,
  primaryBackground,
}) => {
  const [currentIndex, setCurrentIndex] = useState();

  useAnimatedReaction(
    () => currentIndexValue.value,
    (newIndex, prevIndex) => {
      if (newIndex !== prevIndex) {
        runOnJS(setCurrentIndex)(newIndex);
      }
    },
    []
  );

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  // console.log(index);
  const { additionalDetails } = useFetchAdditionalDetails({
    userId: userId,
    locationObject: item,
    enabled: Math.abs(index - currentIndex) <= 1,
  });

  const { checkIfOpen } = useLocationDetailFunctions();

  const cardScaleAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: cardScaleValue.value }],
  }));

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  // console.log('LOCATION VIEW SCREEN RERENDERED', item.id);

  const RenderOpenStatus = () => {
    let isOpenNow;
    isOpenNow = checkIfOpen(additionalDetails?.hours);

    let color =
      isOpenNow === true
        ? manualGradientColors.lightColor
        : isOpenNow === false
          ? "red"
          : primaryColor;

    return (
      <>
        {additionalDetails && additionalDetails?.hours && (
          <View
            style={[
              {
                borderWidth: 1.4,
                borderColor: color,
                alignItems: "center",
                backgroundColor: "transparent",
                //  themeStyles.primaryText.color,

                width: "auto",
                width: 80,
                flexDirection: "row",
                justifyContent: "center",
                flexShrink: 1,
                padding: 10,
                paddingVertical: 6,
                borderRadius: 10,
              },
            ]}
          >
            <Text style={[subWelcomeTextStyle, { color: primaryColor }]}>
              {isOpenNow ? `Open` : isOpenNow === false ? `Closed` : ""}
            </Text>
          </View>
        )}
      </>
    );
  };

  const handleEditLocation = () => {
    console.log(
      "maybe i will create a screen for editing locations (if does not already exist"
    );
    // navigation.navigate("MomentFocus", {
    //   momentText: item?.capsule || null,
    //   updateExistingMoment: true,
    //   existingMomentObject: item || null,
    // });
  };

  // const [ selectedDay, setSelectedDay ] = useStater(null);

  const [rerenderCards, setRerenderCards] = useState(null);

  const handleViewDayHrs = (sD) => {
    handleSelectedDay(sD);
    setRerenderCards(sD);
  };

  const handleDelete = (item) => {
    // console.log("handle delete moment in navigator triggered: ", item);
    console.log("handleDelete in LocationEditLocation sliderided");
    // try {
    //   const momentData = {
    //     friend: selectedFriend.id,
    //     id: item.id,
    //   };

    //   deleteMomentRQuery(momentData);
    // } catch (error) {
    //   console.error("Error deleting moment:", error);
    // }
  };

  const renderHoursComponent = useCallback(() => {
    if (!additionalDetails?.hours?.weekday_text) return null;
    // console.log('rerendering cards!', rerenderCards);
    return (
      <Hours
        buttonHightlightColor={manualGradientColors.lightColor}
        currentDay={currentDay}
        onDaySelect={handleViewDayHrs}
        daysHrsData={additionalDetails.hours.weekday_text}
        initiallySelectedDay={selectedDay?.current || null}
        welcomeTextStyle={welcomeTextStyle}
        primaryColor={primaryColor}
        primaryBackground={primaryBackground}
      />
    );
  }, [
    additionalDetails?.hours?.weekday_text,
    manualGradientColors.lightColor,
    currentDay,
    handleViewDayHrs,
    selectedDay?.current,
  ]);
  return (
    // <SafeViewAndGradientBackground style={{ flex: 1, borderRadius: 40 }}>
    <Animated.View
      style={[
        cardScaleAnimation,
        {
          gap: 20,

          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          padding: 4,

          borderWidth: 0,
          //   height: ITEM_HEIGHT,
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
              flexDirection: "column",
              justifyContent: "flex-start",
              flex: 1,
              marginBottom: marginBottom,
              zIndex: 1,
              overflow: "hidden",
              backgroundColor: lighterOverlayColor,
            },
          ]}
        >
          <View style={{ height: "90%", width: "100%" }}>
            <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
              <View>
                <Text
                  numberOfLines={2}
                  style={[
                    welcomeTextStyle,
                    {
                      color: primaryColor,
                      flexDirection: "row",
                      width: "90%",
                      flexWrap: "wrap",
                    },
                  ]}
                >
                  {item.title}
                </Text>

                <LocationAddress
                  address={item?.address}
                  primaryColor={primaryColor}
                  subWelcomeTextStyle={subWelcomeTextStyle}
                />
              </View>
              <LocationNumber
                phoneNumber={additionalDetails?.phone}
                primaryColor={primaryColor}
                subWelcomeTextStyle={subWelcomeTextStyle}
              />

              <View style={{}}>
                <RenderOpenStatus />
              </View>
              <LocationUtilityTray
                themeAheadOfLoading={themeAheadOfLoading}
                primaryColor={primaryColor}
                onAddPress={onAddPress}
                onRemovePress={onRemovePress}
                userId={userId}
                friendId={friendId}
                friendName={friendName}
                location={item}
                openEditModal={openModal}
                closeEditModal={closeModal}
              />
              {additionalDetails && (
                <>
                  <Text
                    numberOfLines={2}
                    style={[
                      welcomeTextStyle,
                      {
                        color: primaryColor,
                        flexDirection: "row",
                        width: "90%",
                        flexWrap: "wrap",
                      },
                    ]}
                  >
                    Reviews
                  </Text>
                  <View style={{ marginVertical: 10 }}>
                    <LocationCustomerReviews
                      formatDate={formatDate}
                      reviews={additionalDetails.reviews}
                      primaryColor={primaryColor}
                      primaryBackground={primaryBackground}
                    />
                  </View>

                  <Text
                    numberOfLines={2}
                    style={[
                      welcomeTextStyle,
                      {
                        color: primaryColor,
                        flexDirection: "row",
                        width: "90%",
                        flexWrap: "wrap",
                      },
                    ]}
                  >
                    Hours
                  </Text>
                  <View style={{ marginVertical: 10 }}>
                    {renderHoursComponent()}

                    {!additionalDetails?.hours?.weekday_text && (
                      <Text
                        style={[subWelcomeTextStyle, { color: primaryColor }]}
                      >
                        No hours available
                      </Text>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Animated.View>
    // </SafeViewAndGradientBackground>
  );
};

export default LocationViewPage;
