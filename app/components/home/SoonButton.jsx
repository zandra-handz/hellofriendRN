import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UICalendarPageDynamic from "@/app/components/foranimations/UICalendarPageDynamic"; // Import the calendar component
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
const SoonButton = ({
  width = "100%",
  height = 40,
  dateAsString = "Tuesday, January 10",
  friendName = "N/A",
  onPress,
  disabled = false,
}) => {

  const { themeStyles } = useGlobalStyle();
  const formatNumDate = (dateString) => {
    const match = dateString.match(/\d+/);
    return match ? match[0] : "";
  };

  const formatMonth = (dateString) => {
    const match = dateString.match(/([a-zA-Z]+)\s+\d+/);
    return match ? match[1].slice(0, 3) : "";
  };

  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => {}}
      style={[styles.container, { width: width, backgroundColor: themeStyles.lighterOverlayBackgroundColor.backgroundColor }]}
      disabled={disabled}
    >
      <View style={styles.blurOverlay} />

      <View style={[styles.calendarContainer]}>
        <Text style={{ fontSize: 11, fontWeight: "bold" }}>
          {formatMonth(dateAsString)}
        </Text>

        <UICalendarPageDynamic
          numberDate={formatNumDate(dateAsString)}
          month={formatMonth(dateAsString)}
          showMonth={false} // Hide the month inside the SVG if showMonth is true
          width={20}
          height={20}
          color={"#000002"}
        />
      </View>
      <View style={{ flexDirection: "column", width: "100%",   height: '100%', flex: 1, justifyContent: 'center', paddingLeft: 20, alignItems: 'start' }}>
        <Text style={styles.text}>{friendName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "column",
    justifyContent:'center',
  
    width: '100%',
    padding: 10,
    borderRadius: 14, 
    overflow: "hidden",
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: "100%",
    opacity: 0.2,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: "4%",
  },
  calendarContainer: {
    //   position: 'absolute',
    bottom: 0,

    right: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    // height: '50%',
    backgroundColor: "transparent",
  },
});

export default SoonButton;
