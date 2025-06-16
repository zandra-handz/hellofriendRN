import { View, Text, DimensionValue, Linking } from "react-native";
import React, { useEffect } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendLocationsContext } from "@/src/context/FriendLocationsContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import SlideToDeleteHeader from "../foranimations/SlideToDeleteHeader";
import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";
import SlideToAdd from "../foranimations/SlideToAdd";
import TrashOutlineSvg from "@/app/assets/svgs/trash-outline.svg";
import EditPencilOutlineSvg from "@/app/assets/svgs/edit-pencil-outline.svg";

import LocationSavingActions from "./LocationSavingActions";
import LocationNotes from "./LocationNotes";
import LocationParking from "./LocationParking";
import { useLocations } from "@/src/context/LocationsContext";
import LocationUtilityTray from "./LocationUtilityTray";

import LocationTravelTimes from "./LocationTravelTimes";

import CallNumberLink from "./CallNumberLink";

import LocationImages from "./LocationImages";
import LocationCustomerReviews from "./LocationCustomerReviews";
import LocationHoursOfOperation from "./LocationHoursOfOperation";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface LocationPageViewProps {
  item: object;
  index: number;
  width: DimensionValue;
  height: DimensionValue;
  currentIndex: number;
}

const LocationViewPage: React.FC<LocationPageViewProps> = ({
  item,
  index,
  width,
  height,
  currentIndex,
}) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { useFetchAdditionalDetails } = useLocations();

  const { faveLocations, nonFaveLocations } = useFriendLocationsContext();
  const navigation = useNavigation();

  const handleGetDirections = () => {
    if (item && item?.address) {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.address)}`
      );
    }
  };

  const handleCallLocation = () => {
    if (additionalDetails && additionalDetails?.phone) {
      Linking.openURL(`tel:${additionalDetails.phone}`);
    }
  };

  const now = new Date(); // Get the current date and time
  const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });

  // const { data: additionalDetails } = useFetchAdditionalDetails(
  //   item,
  //   !!(index === currentIndex - 1)
  // );

  const { data: additionalDetails } = useFetchAdditionalDetails(
  item,
  Math.abs(index - currentIndex) <= 1
);
  //  useEffect(() => {
  //   if (additionalDetails) {
  //     console.log(`OH YAY ADDITIONAL DETAILS FETCHED: `, additionalDetails?.hours);
  //   }

  //  }, [additionalDetails]);

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

  return (
    <View
      style={{
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        padding: 4,
        borderWidth: 0,
        //   height: ITEM_HEIGHT,
        width: width,
      }}
    >
      <View
        style={{
          backgroundColor: themeStyles.primaryBackground.backgroundColor,
          padding: 10,
          borderRadius: 10,
          width: "100%",
          height: "100%",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {/* <BelowHeaderContainer
          height={30}
          alignItems="center"
          marginBottom={0} //default is currently set to 2
          justifyContent="center"
          // children={
          //   <SlideToAdd
          //     onPress={saveToHello}
          //     sliderText={"Add to hello"}
          //     sliderTextSize={15}
          //     sliderTextColor={themeStyles.primaryText.color}
          //     // sliderTextColor={themeAheadOfLoading.fontColor}
          //   />
          // }
        /> */}
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

          <Text
            numberOfLines={1}
            onPress={handleGetDirections}
            style={[
              themeStyles.primaryText,
              appFontStyles.subWelcomeText,
              { flexDirection: "row", width: "90%", flexWrap: "wrap" },
            ]}
          >
            {" "}
            {item.address}
          </Text>
        </View>
        <LocationUtilityTray location={item} />
        {additionalDetails && (
          <>
           {/* <LocationImages photos={additionalDetails.photos} /> */}
               <LocationCustomerReviews reviews={additionalDetails.reviews} />
            <View style={{ flexDirection: "row", width: "100%" }}>
              <MaterialCommunityIcons name="phone" size={26} color={themeStyles.primaryText.color} />
              <Text
                numberOfLines={1}
                onPress={handleCallLocation}
                style={[
                  themeStyles.primaryText,
                  appFontStyles.subWelcomeText,
                  { flexDirection: "row", width: "90%", flexWrap: "wrap" },
                ]}
              >
                {" "}
                {additionalDetails?.phone}
              </Text>
            </View>
  

            {additionalDetails && additionalDetails?.hours && (
              <View style={{marginTop: 70}}>
              <LocationHoursOfOperation
                location={item}
                data={additionalDetails?.hours}
                currentDayDrilledThrice={dayOfWeek}
              />
              
                
              </View>
            )}
          </>
        )}
        {/* <EditPencilOutlineSvg
          height={20}
          width={20}
          onPress={handleEditLocation}
          color={themeStyles.genericText.color}
        /> */}
        <SlideToDeleteHeader
          itemToDelete={item}
          onPress={handleDelete}
          sliderWidth={"100%"}
          targetIcon={TrashOutlineSvg}
          sliderTextColor={themeStyles.primaryText.color}
        />
      </View>
    </View>
  );
};

export default LocationViewPage;
