// import React from "react";
// import { View, Text,  StyleSheet } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
 
// import LocationSavingActionsForCard from "./LocationSavingActionsForCard";

// import DirectionsLink from "./DirectionsLink";
// import LocationNotes from "./LocationNotes";
// import LocationCategory from "./LocationCategory";
// import LocationParking from "./LocationParking";
// import LocationSendText from './LocationSendText';

// import LocationTravelTimes from "./LocationTravelTimes";

// const LocationCard = ({
//   addToFavorites,
//   removeFromFavorites, 
//   location,
//   height = 100,
//   favorite = false, 
//   bottomMargin = 0,
//   iconColor = "white",
//   icon: Icon,
//   iconSize = 30,
// }) => {
//   const navigation = useNavigation();
//   const { themeStyles } = useGlobalStyle(); 

//   const MARGIN_LEFT_LOCATION_BUTTONS = "3%";
//   const LOCATION_BUTTONS_ICON_SIZE = 20; 
//   const SMALL_CLOCK_ICON_SIZE = 16;

 

//   const handleGoToLocationViewScreen = () => {
//     navigation.navigate("Location", { location: location, favorite: favorite });
//   };

//   // const handlePress = async () => {
//   //   handleGoToLocationViewScreen();
//   // };

//   return (
//     <View
//       style={[
//         styles.container,
//         themeStyles.genericTextBackgroundShadeTwo,
//         { overflow: "hidden", height: height, marginBottom: bottomMargin },
//       ]}
//     >
      
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "flex-start",
//           alignItems: "center",
//           textAlign: "center",
//           width: "100%",  
            
//         }}
//       > 
//         {Icon && (
//           <View style={styles.iconContainer}>
//             <Icon width={iconSize} height={iconSize} color={iconColor} />
//           </View>
//         )} 
//         <View style={styles.titleContainer}>
//           <Text style={[styles.title, themeStyles.subHeaderText]}>
//             {location.title}
//           </Text>
//         </View>
//       </View> 
              
             
               
//       <View style={styles.detailsContainer}>
//         {location.address && (
//           <DirectionsLink
//             address={location.address}
//             fontColor={themeStyles.genericText.color}
//           />
//         )}
//         {/* <Text style={[styles.optionText, {color: color}]}>{location.address}</Text> */}

//       </View>
//       <View
//           style={{
//             flexDirection: "row",
//             width: "auto",   
//             alignContent: 'center',
//             paddingVertical: "0%",
//             paddingHorizontal: "0%",
//             justifyContent: "space-between",
//             alignItems: "center",
//             //overflow: "hidden", 
//           }}
//         >

// <View style={{ marginLeft: MARGIN_LEFT_LOCATION_BUTTONS, width: '28%' }}>
//             <LocationCategory
//               iconSize={LOCATION_BUTTONS_ICON_SIZE}
//               location={location && location}
//             />
//           </View>

// <View style={{ marginLeft: MARGIN_LEFT_LOCATION_BUTTONS }}>
// <LocationSavingActionsForCard
//               iconSize={ LOCATION_BUTTONS_ICON_SIZE}
//                 location={location && location} 
//                 //location={copyLocation && copyLocation}
//                 handleAddToFaves={addToFavorites}
//                 handleRemoveFromFaves={removeFromFavorites}
//               />
//           </View>


//           <View style={{ marginLeft: MARGIN_LEFT_LOCATION_BUTTONS }}>
//             <LocationNotes
//               iconSize={LOCATION_BUTTONS_ICON_SIZE}
//               location={location && location}
//             />
//           </View>
//           <View style={{ marginLeft: MARGIN_LEFT_LOCATION_BUTTONS }}>
//             <LocationParking
//               iconSize={LOCATION_BUTTONS_ICON_SIZE}
//               location={location && location}
//             />
//           </View>
//           <View
//             style={{ 
//                 marginLeft: MARGIN_LEFT_LOCATION_BUTTONS}} //position: 'absolute', top: -100, right: 10 
//           >
//             <LocationTravelTimes
//               iconSize={LOCATION_BUTTONS_ICON_SIZE}
//               smallClockIconSize={SMALL_CLOCK_ICON_SIZE}
//               location={location && location}
//               flashListVersion={true}
//             />
//           </View>
//           <View style={{ marginLeft: MARGIN_LEFT_LOCATION_BUTTONS }}>
//             <LocationSendText
//               iconSize={LOCATION_BUTTONS_ICON_SIZE + 6}
//               location={location && location}
//             />
//           </View>

//         </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     borderRadius: 30,
//     padding: 20,
//     overflow: "hidden",
//   },
//   optionTitleText: {
//     fontSize: 12,
//     color: "white",
//     fontFamily: "Poppins-Bold",
//   },
//   optionText: {
//     fontSize: 12,
//     color: "white",
//     fontFamily: "Poppins-Regular",
//   },
//   iconContainer: {
//     flexDirection: "row",
//     justifyContent: 'flex-start',

//     width: "9%",
//   },
//   detailsContainer: {
//     flex: 1,
//     padding: '3%',
//   },
//   titleContainer: {
//     width: "70%",

//     flex: 1,
//   },
//   title: {
//     fontSize: 14,
//     lineHeight: 21, 
//     textTransform: "uppercase",
//   },
// });

// export default LocationCard;
