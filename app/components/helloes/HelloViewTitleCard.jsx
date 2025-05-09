import React  from "react";
import { View, StyleSheet, Text  } from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import IconDynamicHelloType from "./IconDynamicHelloType";
import LocationSolidSvg from '@/app/assets/svgs/location-solid.svg'; 
import CalendarCheckOutlineSvg from '@/app/assets/svgs/calendar-check-outline.svg';


const HelloViewTitleCard = ({
  helloData,
  title = "DETAILS",
  height = "auto",
}) => {
  const { themeStyles } = useGlobalStyle();
  return (
    <View
      style={[
        styles.container,
        themeStyles.genericTextBackgroundShadeTwo,
        { height: height },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "auto",
        }}
      >
        <Text style={[styles.title, themeStyles.subHeaderText]}>{title}</Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.row}>
          <IconDynamicHelloType
            selectedChoice={helloData.type}
            svgWidth={20}
            svgHeight={20}
            svgColor={themeStyles.genericText.color}
          />
          <Text style={[styles.text, themeStyles.genericText]}>
            {helloData.type}
          </Text>
        </View>
        <View style={styles.row}>
          <LocationSolidSvg
            width={20}
            height={20}
            color={themeStyles.genericText.color}
          />
          <Text style={[styles.text, themeStyles.genericText]}>
            {helloData.locationName || 'Location not recorded'}
          </Text>
        </View>
        <View style={styles.row}> 
          <CalendarCheckOutlineSvg
            width={20}
            height={20}
            color={themeStyles.genericText.color}
          />
          <Text style={[styles.text, themeStyles.genericText]}>
            {helloData.date}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    //flex: 1,
    height: "auto",
    borderRadius: 30,
    alignSelf: "center",
    padding: 20,
    overflow: "hidden",

    //backgroundColor: 'red',
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  text: {
    marginLeft: "4%",
    fontSize: 15,
    lineHeight: 21,
  },
});

export default HelloViewTitleCard;
