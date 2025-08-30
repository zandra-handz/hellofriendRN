import { View, Text, DimensionValue } from "react-native";
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

import Hours from "./Hours";

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
  openModal,
  closeModal,
  themeAheadOfLoading,
  manualGradientColors,
  primaryColor,
  primaryBackground,
  welcomeTextStyle,
  subWelcomeTextStyle,
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

console.log(index);
  const { additionalDetails } = useFetchAdditionalDetails({userId: userId, locationObject: item, enabled:Math.abs(index - currentIndex) <= 1 })

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
          paddingBottom: 0,
          borderWidth: 0,
          //   height: ITEM_HEIGHT,
          width: width,
        },
      ]}
    >
      <View
        style={{
          backgroundColor: primaryBackground,
          padding: 10,
          borderRadius: 10,
          borderRadius: 40,
          width: "100%",
          height: "100%",
          zandleviewday: 1,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            flexWrap: "wrap",
            width: "100%",
            paddingHorizontal: 0,
            paddingTop: 20,
          }}
        >
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
                <Text style={[subWelcomeTextStyle, { color: primaryColor }]}>
                  No hours available
                </Text>
              )}
            </View>

            {/* 
            {additionalDetails && additionalDetails?.hours && (
              <View style={{marginTop: 70}}>
              <LocationHoursOfOperation
                location={item}
                data={additionalDetails?.hours}
                currentDayDrilledThrice={dayOfWeek}
              />
              
                
              </View>
            )} */}
          </>
        )}
        {/* <EditPencilOutlineSvg
          height={20}
          width={20}
          onPress={handleEditLocation}
          color={themeStyles.genericText.color}
        /> */}
        {/* <SlideToDeleteHeader
          itemToDelete={item}
          onPress={handleDelete}
          sliderWidth={"100%"}
          targetIcon={TrashOutlineSvg}
          sliderTextColor={themeStyles.primaryText.color}
        /> */}
      </View>
    </Animated.View>
    // </SafeViewAndGradientBackground>
  );
};

export default LocationViewPage;
