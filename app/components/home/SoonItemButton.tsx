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

interface SoonItemButtonProps {
  width: DimensionValue;
  date: string;
  friendName: string;
  onPress: () => void;
  onDoublePress: () => void;
  disabled: boolean;
}

const SoonItemButton: React.FC<SoonItemButtonProps> = ({
  width = "100%",
  date = "Tuesday, January 10",
  friendName = "N/A",
  onPress = () => console.log("Soon Item button single press"),
  onDoublePress = () => console.log("Soon Item button dounle press"),
  disabled = false,
}) => {
  const { themeStyles } = useGlobalStyle();
  const lastPress = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        {
          width: width,
          backgroundColor:
            themeStyles.lighterOverlayBackgroundColor.backgroundColor,
        },
      ]}
      disabled={disabled}
    >
      <View style={styles.blurOverlay} />

      <View style={[styles.calendarContainer]}>
        <Text style={{ fontSize: 11, fontWeight: "bold" }}>
          {formatMonth(date)}
        </Text>

        <UICalendarPageDynamic
          numberDate={formatNumDate(date)}
          month={formatMonth(date)}
          showMonth={false} // Hide the month inside the SVG if showMonth is true
          width={20}
          height={20}
          color={"#000002"}
        />
      </View>
      <View
        style={{
          flexDirection: "column",
          width: "100%",
          height: "100%",
          flex: 1,
          justifyContent: "center",
          paddingLeft: 20,
          alignItems: "start",
        }}
      >
        <Text style={styles.text}>{friendName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "column",
    justifyContent: "center",

    width: "100%",
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

export default SoonItemButton;
