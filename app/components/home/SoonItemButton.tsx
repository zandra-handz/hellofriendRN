import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  DimensionValue,
} from "react-native";
import UICalendarPageDynamic from "@/app/components/foranimations/UICalendarPageDynamic"; // Import the calendar component
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import { LinearGradient } from "expo-linear-gradient";
interface SoonItemButtonProps {
  width: DimensionValue;
  date: string;
  friendName: string;
  onPress: () => void;
  onDoublePress: () => void;
  disabled: boolean;
  textColor: string;
  backgroundColor: string;
}

const SoonItemButton: React.FC<SoonItemButtonProps> = ({
  width = "100%",
  date = "Tuesday, January 10",
  friendName = "N/A",
  onPress = () => console.log("Soon Item button single press"),
  onDoublePress = () => console.log("Soon Item button dounle press"),
  disabled = false,
  textColor = "white",
  backgroundColor = "red",
}) => {
  const lastPress = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { manualGradientColors, themeStyles } = useGlobalStyle();

  const DOUBLE_PRESS_DELAY = 300;

  const formatNumDate = (dateString) => {
    const match = dateString.match(/\d+/);
    return match ? match[0] : "";
  };

  const formatMonth = (dateString) => {
    const match = dateString.match(/([a-zA-Z]+)\s+\d+/);
    return match ? match[1].slice(0, 3) : "";
  };

  const handlePress = () => {
    const now = Date.now();
    if (
      lastPress &&
      lastPress.current &&
      now - lastPress.current < DOUBLE_PRESS_DELAY
    ) {
      onDoublePress();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onPress();
      }, DOUBLE_PRESS_DELAY - 10);
    }
    lastPress.current = now;
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.container,
        {
          width: width,
          // backgroundColor:
          //   backgroundColor,
        },
      ]}
      disabled={disabled}
    >
      <LinearGradient
        colors={[
          themeStyles.overlayBackgroundColor.backgroundColor,
          manualGradientColors.homeDarkColor,
        ]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.container,
          { flex: 1, width: width, alignItems: "center", borderRadius: 20 },
        ]}
      >
        {/* <View style={[styles.calendarContainer]}>
        <Text style={{ fontSize: 11, fontWeight: "bold", color: textColor }}>
          {formatMonth(date)}
        </Text>

        <UICalendarPageDynamic
          numberDate={formatNumDate(date)}
          month={formatMonth(date)}
          showMonth={false} // Hide the month inside the SVG if showMonth is true
          width={20}
          height={20}
          color={textColor}
        />
      </View> */}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            height: "100%",
            alignItems: 'center',

            // justifyContent: "center",
            padding: 10,
            borderRadius: 10,
         //   backgroundColor: themeStyles.primaryBackground.backgroundColor,
            // alignItems: "start",
          }}
        >
          <View style={[styles.calendarContainer]}>
              <Text style={[styles.text, { color: textColor }]}> {date}
              {/* {formatMonth(date)} */}
            </Text>

            {/* <UICalendarPageDynamic
              numberDate={formatNumDate(date)}
              month={formatMonth(date)}
              showMonth={false} // Hide the month inside the SVG if showMonth is true
              width={20}
              height={20}
              color={textColor}
            /> */}
          </View>
          <Text style={[styles.text, { color: textColor }]}>
            {friendName}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    width: "100%",
    // padding: 10,
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
  },
  calendarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    // backgroundColor: "red",
    borderRadius: 20,
    paddingHorizontal: 10, 
    width: "auto",
    flex: 1,
    width: "100%",
    flexShrink: 1,
  },
});

export default SoonItemButton;
