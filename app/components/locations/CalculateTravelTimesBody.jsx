//change height percentage of container inside the main container to adjust screen

import React, { useState  } from "react";
import { View, Text, StyleSheet } from "react-native";  

//DELETED. use the new components or just the default settings from the address hooks
// import AddressSelectorFriend from '../selectors/AddressSelectorFriend';
// import AddressSelectorUser from '../selectors/AddressSelectorUser';

import TravelTimesResults from "../locations/TravelTimesResults";
import useStartingFriendAddresses from "@/src/hooks/useStartingFriendAddresses";
import useStartingUserAddresses from "@/src/hooks/useStartingUserAddresses";

import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";

// THREW IN DEFAULTS JUST TO REMOVE OTHER STUFF, THIS COMPONENT MIGHT NOT WORK IN CURRENT FORM
const CalculateTravelTimesBody = ({ userId, friendId, friendName, lightDarkTheme, location }) => {
  const {   userAddresses } = useStartingUserAddresses();
  const { friendAddresses } = useStartingFriendAddresses({userId: userId, friendId: friendId});
  
  const [triggerFetch, setTriggerFetch] = useState(false); 

  const handleCalculate = () => {
    setTriggerFetch((prev) => !prev);
  };

  return (
    <View style={[styles.container, {backgroundColor: lightDarkTheme.primaryBackground}]}>
      <View
        style={{
          height: "46%",
          paddingHorizontal: "2%",
          paddingVertical: "4%",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            marginVertical: "1%",
            height: "10%",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Text style={[styles.locationTitle, {color: lightDarkTheme.primaryText}]}>
            {location?.title}
          </Text>
          <Text style={[styles.locationAddress, {color: lightDarkTheme.primaryText}]}>
            {location?.address}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            maxHeight: 120,
            height: "30%",
            justifyContent: "center",
            marginVertical: "4%",
            width: "100%",
          }}
        >
          <View style={{ marginBottom: "1%" }}>
 
          </View>
        </View>

        <View
          style={{
            flexDirection: "column",
            height: "30%",
            maxHeight: 120,
            justifyContent: "center",
            marginVertical: "4%",
            width: "100%",
          }}
        >
          <View style={{ marginBottom: "1%" }}>
 
          </View>
        </View>
      </View>
      <View
        style={{
          flexGrow: 1,
          width: "100%",
          paddingBottom: "4%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TravelTimesResults
        lightDarkTheme={lightDarkTheme}
          userAddress={
            userAddresses?.chosen || {
              address: "User Address",
              lat: "0",
              lng: "0",
            }
          }
          friendAddress={
            friendAddresses?.chosen || { address: "Friend Address", lat: "0", lng: "0" }
          }
          friendName={friendName || null}
          destinationLocation={location}
          triggerFetch={triggerFetch}
        />
      </View>

      <ButtonBaseSpecialSave
        label="CALCULATE "
        maxHeight={80}
        onPress={handleCalculate}
        isDisabled={!userAddresses?.chosen || !friendAddresses?.chosen}
        fontFamily={"Poppins-Bold"}
        // image={require("@/app/assets/shapes/redheadcoffee.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-between",
  },
  locationDetailsContainer: {
    borderRadius: 8,
    marginVertical: "2%",
    justifyContent: "space-between",
  },
  headerContainer: {},
  locationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  locationAddress: {
    fontSize: 18,
  },
  cardContainer: {
    marginVertical: 10,
  },
  selectorContainer: {
    marginVertical: 10,
  },
  selectorTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
  },
  previewContainer: {
    marginVertical: 10,
  },
  previewTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
  },
  textInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontFamily: "Poppins-Regular",
    height: 100,
  },
  sliderContainer: {
    height: 24,
    borderRadius: 20,
    zIndex: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default CalculateTravelTimesBody;
