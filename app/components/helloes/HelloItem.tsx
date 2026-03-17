import { View, Text, DimensionValue, StyleSheet } from "react-native";
import React from "react"; 
// import { MaterialCommunityIcons } from "@expo/vector-icons";
import SvgIcon from "@/app/styles/SvgIcons";
import OptionListItem from "../headers/OptionListItem";
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
<OptionListItem
  label={formatDate(helloData.date)}
  sublabel={helloData.type + (helloData.location_name ? " at " + helloData.location_name : "")}
  primaryColor={primaryColor}
  backgroundColor="transparent"
  buttonColor="transparent"
  icon={<SvgIcon name="calendar" color={primaryColor} size={20} />}
/>
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
