import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "../context/GlobalStyleContext";

import LocationSavingActionsForCard from "../components/LocationSavingActionsForCard";

import DirectionsLink from "../components/DirectionsLink";
import LocationNotes from "../components/LocationNotes";
import LocationCategory from "../components/LocationCategory";
import LocationParking from "../components/LocationParking";
import LocationSendText from '../components/LocationSendText';

import LocationTravelTimes from "../components/LocationTravelTimes";

const LocationCard = ({
  addToFavorites,
  removeFromFavorites,
  location,
  height = 100,
  favorite = false,
  color = "white",
  bottomMargin = 0,
  iconColor = "white",
  icon: Icon,
  iconSize = 30,
}) => {
  const navigation = useNavigation();
  const { themeStyles } = useGlobalStyle();

  const MARGIN_LEFT_LOCATION_BUTTONS = "3%";
  const LOCATION_BUTTONS_ICON_SIZE = 20;
  const FAVORITE_LOCATION_ICON_SIZE = 24;
  const SMALL_CLOCK_ICON_SIZE = 16;

  const handleGoToLocationViewScreen = () => {
    navigation.navigate("Location", { location: location, favorite: favorite });
  };

  const handlePress = async () => {
    handleGoToLocationViewScreen();
  };

  return (
    <View
      style={[
        styles.container,
        themeStyles.genericTextBackgroundShadeTwo,
        { overflow: "hidden", height: height, marginBottom: bottomMargin },
      ]}
    >
      
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          textAlign: "center",
          width: "100%",  
            
        }}
      > 
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon width={iconSize} height={iconSize} color={iconColor} />
          </View>
        )} 
        <View style={styles.titleContainer}>
          <Text style={[styles.title, themeStyles.subHeaderText]}>
            {location.title}
          </Text>
        </View>
      </View> 
              
             
               
      <View style={styles.detailsContainer}>
        {location.address && (
          <DirectionsLink
            address={location.address}
            fontColor={themeStyles.genericText.color}
          />
        )}
        {/* <Text style={[styles.optionText, {color: color}]}>{location.address}</Text> */}

      </View>
      <View
          style={{
            flexDirection: "row",
            width: "auto",   
            alignContent: 'center',
            paddingVertical: "0%",
            paddingHorizontal: "0%",
            justifyContent: "space-between",
            alignItems: "center",
            //overflow: "hidden", 
          }}
        >

<View style={{ marginLeft: MARGIN_LEFT_LOCATION_BUTTONS, maxWidth: '38%' }}>
            <LocationCategory
              iconSize={LOCATION_BUTTONS_ICON_SIZE}
              location={location && location}
            />
          </View>

<View style={{ marginLeft: MARGIN_LEFT_LOCATION_BUTTONS }}>
<LocationSavingActionsForCard
              iconSize={ LOCATION_BUTTONS_ICON_SIZE}
                location={location && location}
                handleAddToFaves={addToFavorites}
                handleRemoveFromFaves={removeFromFavorites}
              />
          </View>


          <View style={{ marginLeft: MARGIN_LEFT_LOCATION_BUTTONS }}>
            <LocationNotes
              iconSize={LOCATION_BUTTONS_ICON_SIZE}
              location={location && location}
            />
          </View>
          <View style={{ marginLeft: MARGIN_LEFT_LOCATION_BUTTONS }}>
            <LocationParking
              iconSize={LOCATION_BUTTONS_ICON_SIZE}
              location={location && location}
            />
          </View>
          <View
            style={{ 
                marginLeft: MARGIN_LEFT_LOCATION_BUTTONS }}
          >
            <LocationTravelTimes
              iconSize={LOCATION_BUTTONS_ICON_SIZE}
              smallClockIconSize={SMALL_CLOCK_ICON_SIZE}
              location={location && location}
              flashListVersion={true}
            />
          </View>
          <View style={{ marginLeft: MARGIN_LEFT_LOCATION_BUTTONS }}>
            <LocationSendText
              iconSize={LOCATION_BUTTONS_ICON_SIZE + 6}
              location={location && location}
            />
          </View>

        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 30,
    padding: 20,
    overflow: "hidden",
  },
  optionTitleText: {
    fontSize: 12,
    color: "white",
    fontFamily: "Poppins-Bold",
  },
  optionText: {
    fontSize: 12,
    color: "white",
    fontFamily: "Poppins-Regular",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: 'flex-start',

    width: "9%",
  },
  detailsContainer: {
    flex: 1,
    padding: '3%',
  },
  titleContainer: {
    width: "70%",

    flex: 1,
  },
  title: {
    fontSize: 14,
    lineHeight: 21, 
    textTransform: "uppercase",
  },
});

export default LocationCard;
