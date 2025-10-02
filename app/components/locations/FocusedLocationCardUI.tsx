import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalPressable from "../appwide/button/GlobalPressable";
import manualGradientColors from "@/src/hooks/StaticColors";
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
  primaryColor,
  primaryBackground,
}) => {
  return (
    <GlobalPressable
    onPress={onViewPress}
    onLongPress={onSendPress}
      style={[
        styles.container,
        {
          backgroundColor: primaryBackground,
        },
      ]}
    >
      {focusedLocation && (
        <>
          <View style={styles.innerContainer}>
            <Text
              numberOfLines={1}
              style={[styles.textStyle, { color: primaryColor }]}
            >
              {focusedLocation && focusedLocation.title}
            </Text>
            <Text numberOfLines={1} style={[styles.subTextStyle, { color: primaryColor }]}>
              {focusedLocation && focusedLocation.address}
            </Text>
          </View>
          <View
            style={styles.buttonWrapper}
          >
     

            <GlobalPressable
              onPress={onSendPress}
              style={{
                height: 22,
                width: 22,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
                backgroundColor: manualGradientColors.homeDarkColor,
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
    </GlobalPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
    height: 'auto',
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
  
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column", 
 
    textAlign: 'center',
  },
  textStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 18, 
    textAlign: 'center',
  },
    subTextStyle: {
    fontSize: 12, 
    lineHeight: 22,
  },
  buttonWrapper: { 
    position: 'absolute',
    right: 10,
    justifyContent: "center",
    alignItems: 'center',
    height: "100%",
  },
});

export default FocusedLocationCardUI;
