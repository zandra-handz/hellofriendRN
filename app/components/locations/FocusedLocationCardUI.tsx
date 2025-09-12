import { View, Text  } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalPressable from "../appwide/button/GlobalPressable";
interface FocusedLocation {
  title: string;
  address: string;
}

interface FocusedLocationCardProps {
  focusedLocation: FocusedLocation;
  onViewPress: () => void;
  onSendPress: () => void;
}

const FocusedLocationCardUI: React.FC<FocusedLocationCardProps> = ({
  focusedLocation,
  onViewPress,
  onSendPress,
  manualGradientColors,
  primaryColor,
  primaryBackground,
  welcomeTextStyle,
  subWelcomeTextStyle,
}) => {
  return (
    <View
      style={{
        backgroundColor: primaryBackground,
        padding: 10,
        height: 80,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {focusedLocation && (
        <>
          <View
            style={{
              flexDirection: "column",
              height: "100%",
              flexShrink: 1,
              paddingRight: 10,
            }}
          >
            <Text
              numberOfLines={2}
              style={[
                // welcomeTextStyle, 
                { color: primaryColor, fontSize: 20, lineHeight: 24 }]}
            >
              {focusedLocation && focusedLocation.title}
            </Text>
            <Text style={[
              // subWelcomeTextStyle, 
              { color: primaryColor }]}>
              {focusedLocation && focusedLocation.address}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-end",
              height: "100%",
            }}
          >
            <GlobalPressable
              onPress={onViewPress}
              style={{
                marginBottom: 8,
                height: 22,
                width: 22,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
                backgroundColor: manualGradientColors.homeDarkColor,
                // borderWidth: StyleSheet.hairlineWidth,
                // borderColor: manualGradientColors.lightColor
              }}
            >
              <MaterialCommunityIcons
                name={"information"}
                size={22}
                color={manualGradientColors.lightColor}
              />
            </GlobalPressable>

            <GlobalPressable
              onPress={onSendPress}
              style={{
                height: 22,
                width: 22,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
                backgroundColor: manualGradientColors.homeDarkColor,
                // borderWidth: StyleSheet.hairlineWidth,
                // borderColor: manualGradientColors.lightColor
              }}
            >
              <MaterialCommunityIcons
                name={"send-circle-outline"}
                size={22}
                color={manualGradientColors.lightColor}
              />
            </GlobalPressable>
          </View>
        </>
      )}
    </View>
  );
};

export default FocusedLocationCardUI;
