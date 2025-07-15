import { View, Text, DimensionValue } from "react-native";
import React, { useCallback, useState } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
 
 

import LocationNumber from "./LocationNumber";
import LocationAddress from "./LocationAddress";

import { useLocations } from "@/src/context/LocationsContext";
import LocationUtilityTray from "./LocationUtilityTray";
import SafeViewAndGradientBackground from "../appwide/format/SafeViewAndGradBackground";
import Animated, {
  useSharedValue,
  SharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import LocationCustomerReviews from "./LocationCustomerReviews";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  item,
  test,
  index,
  width,
  height,
  currentIndexValue,
  cardScaleValue,
  currentDay, // object with .index and .day
  selectedDay, 
  handleSelectedDay,
  openModal,
  closeModal,
}) => {
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { useFetchAdditionalDetails } = useLocations();
 

  const { checkIfOpen } = useLocationDetailFunctions();

  const navigation = useNavigation();
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

  const cardScaleAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: cardScaleValue.value }],
  }));

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  // console.log('LOCATION VIEW SCREEN RERENDERED', item.id);
  const { data: additionalDetails } = useFetchAdditionalDetails(
    item,
    Math.abs(index - currentIndex) <= 1
  );

  const RenderOpenStatus = () => {
    let isOpenNow;
    isOpenNow = checkIfOpen(additionalDetails?.hours);

    let color =
      isOpenNow === true
        ? manualGradientColors.lightColor
        : isOpenNow === false
          ? "red"
          : themeStyles.primaryText.color;

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
            <Text
              style={[
                themeStyles.genericText,
                appFontStyles.subWelcomeText,
                { color: color },
              ]}
            >
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

  // const [ selectedDay, setSelectedDay ] = useState(null);

  const [rerenderCards, setRerenderCards ] = useState(null);

  const handleViewDayHrs = (sD) => {

    // console.log('function passed in to onDaySelect,', sD);
    
    handleSelectedDay(sD);
    setRerenderCards(sD);

    // console.log('index: ', sD.index,'day: ', sD.day);
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
      initiallySelectedDay={ selectedDay?.current || null}
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
            backgroundColor: themeStyles.primaryBackground.backgroundColor,
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
                themeStyles.primaryText,
                appFontStyles.welcomeText,
                { flexDirection: "row", width: "90%", flexWrap: "wrap" },
              ]}
            >
              {item.title}
            </Text>

            <LocationAddress address={item?.address} />
          </View>
          <LocationNumber phoneNumber={additionalDetails?.phone} />

          <View style={{}}>
            <RenderOpenStatus />
          </View>
          <LocationUtilityTray
            location={item}
            openEditModal={openModal}
            closeEditModal={closeModal}
          />
          {additionalDetails && (
            <>
              <Text
                numberOfLines={2}
                style={[
                  themeStyles.primaryText,
                  appFontStyles.welcomeText,
                  { flexDirection: "row", width: "90%", flexWrap: "wrap" },
                ]}
              >
                Reviews
              </Text>
              <View style={{ marginVertical: 10 }}>
                <LocationCustomerReviews
                  formatDate={formatDate}
                  reviews={additionalDetails.reviews}
                />
              </View>

              <Text
                numberOfLines={2}
                style={[
                  themeStyles.primaryText,
                  appFontStyles.welcomeText,
                  { flexDirection: "row", width: "90%", flexWrap: "wrap" },
                ]}
              >
                Hours
              </Text>
              <View style={{ marginVertical: 10 }}>
                {renderHoursComponent()}

                {!additionalDetails?.hours?.weekday_text && (
                  <Text
                    style={[
                      appFontStyles.subWelcomeText,
                      themeStyles.primaryText,
                    ]}
                  >
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
