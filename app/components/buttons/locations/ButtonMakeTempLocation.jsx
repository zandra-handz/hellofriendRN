import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
 
 import { FontAwesome5 } from "@expo/vector-icons"; 
import useAddTempLocation from "@/src/hooks/LocationCalls/useAddTempLocation"; 
 

const ButtonMakeTempLocation = ({
    userId,
  location,
  size = 11,
  iconSize = 16,
  family = "Poppins-Bold",
  color = "black",
  style,
}) => {
//   const {
//     locationList,
//     setLocationList,
//     selectedLocation,
//     setSelectedLocation,
//   } = useLocations();
 

  const { addTempLocationToBeginning } = useAddTempLocation({userId: userId});

  const generateTemporaryId = () => {
    return `temp_${Date.now()}`; // Use timestamp to generate a unique temporary ID
  };

//   const openLocationView = () => {
//     setIsLocationModalVisible(true);
//   };

  const handlePress = () => {
    if (location) {
      const { name, address, latitude, longitude } = location;
      const newLocation = {
        id: generateTemporaryId(), // Generate temporary ID here
        address: address || "Unknown Address",
        latitude: latitude || 0,
        longitude: longitude || 0,
        notes: "",
        title: name || "Search", // Use the name from the location object
        validatedAddress: true,
        friendsCount: 0,
        friends: [],
      };

      addTempLocationToBeginning(newLocation);

    //   setLocationList([newLocation, ...locationList]); // Add new location to the beginning of the list
      console.log("New Location Added:", newLocation);
    //   console.log(locationList);
 
 
    }
  };

 
  return (
    <View>
      <TouchableOpacity onPress={handlePress} style={[styles.container, style]}>
        <FontAwesome5 name="save" size={iconSize} />
        <Text
          style={[
            styles.saveText,
            { fontSize: size, color: color, fontFamily: family },
          ]}
        >
          {" "}
          SAVE
        </Text>
      </TouchableOpacity>

 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  iconContainer: {
    margin: 4,
  },
  saveText: {
    marginLeft: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ButtonMakeTempLocation;
