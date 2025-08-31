import { View, Text, DimensionValue, StyleSheet } from "react-native";
import React from "react"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  helloData: object;
  combinedHeight: DimensionValue;
  index: number;
};

const formatDate = (createdOn) => {
  if (!createdOn) return "";
  console.log('running format date');

  const date = new Date(createdOn);
  const now = new Date();
 
  const isCurrentYear = date.getUTCFullYear() === now.getUTCFullYear();

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(isCurrentYear ? {} : { year: "numeric" }),
    timeZone: "UTC", 
  }).format(date);
};

const HelloItem = ({
  helloData,
  itemHeight,
  bottomMargin,
  combinedHeight,
  index,
  primaryColor='orange',
  welcomeTextStyle,
  subWelcomeTextStyle,
}: Props) => { 
  return (
    <View
      style={[
        styles.container,
        {
          height: itemHeight,
          marginBottom: bottomMargin,
          // backgroundColor:
          //   index % 2 === 0
          //     ? themeStyles.primaryBackground.backgroundColor
          //     : themeStyles.overlayBackgroundColor.backgroundColor
        },
      ]}
    >
      <View style={{ flexDirection: "column" }}>
        <Text
          style={[ 
            welcomeTextStyle,
            { color: primaryColor, lineHeight: 22, fontSize: 18 },
          ]}
        >
          {formatDate(helloData.date)}
        </Text>
        <View style={{flexDirection: 'row', width: '90%'}}>
          <MaterialCommunityIcons
          name={"map-marker"}
          color={primaryColor}
          size={20}/>
        <Text numberOfLines={1} style={[  subWelcomeTextStyle, { color: primaryColor}]}>
          {helloData.type}
          {helloData.location_name && " at " + helloData.location_name}
        </Text>
        
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 30,
    height: "100%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default HelloItem;
