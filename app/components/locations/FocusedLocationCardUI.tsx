import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  
}) => {
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();

  return (
    <View
      style={{
        backgroundColor: themeStyles.primaryBackground.backgroundColor,
        padding: 10,
        height: 110,
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
              style={[themeStyles.primaryText, appFontStyles.welcomeText]}
            >
              {focusedLocation && focusedLocation.title}
            </Text>
            <Text
              style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}
            >
              {focusedLocation && focusedLocation.address}
            </Text>
          </View>
          <View style={{ flexDirection: "column", justifyContent: "flex-end", height: '100%' }}>
           
                       <TouchableOpacity
              onPress={onViewPress}
              style={{
                marginBottom: 8,
                height: 30,
                width: 30,
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
                size={30}
                color={manualGradientColors.lightColor}
              />
            </TouchableOpacity>
           
            <TouchableOpacity
              onPress={onSendPress}
              style={{
                height: 30,
                width: 30,
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
                size={30}
                color={manualGradientColors.lightColor}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default FocusedLocationCardUI;
