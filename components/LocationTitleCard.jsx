import React from "react";
import { View, Text,  StyleSheet } from "react-native";
 
import { useGlobalStyle } from "../context/GlobalStyleContext";
 
import DirectionsLink from "../components/DirectionsLink"; 

import ShopOutlineSvg from '../assets/svgs/shop-outline.svg';


const LocationTitleCard = ({
 
  location,
  width = "90%",
  height = "60%",
  iconColor = "white",
  icon: Icon,
  iconSize = 30,
}) => { 
  const { themeStyles } = useGlobalStyle();
 
 

  return (
      <View
        style={[
          styles.container,
          themeStyles.genericTextBackgroundShadeTwo,
          { width: width, height: height },
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
          <View style={styles.iconContainer}>
            <ShopOutlineSvg width={iconSize} height={iconSize} color={iconColor} />
          </View> 
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
  

        </View> 
  );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        alignSelf: "center",
        padding: 20,
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
    fontSize: 15,
    lineHeight: 21, 
    textTransform: "uppercase",
  },
});

export default LocationTitleCard;
