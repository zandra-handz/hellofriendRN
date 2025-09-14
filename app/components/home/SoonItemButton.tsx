import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  DimensionValue,
} from "react-native";
import manualGradientColors from "@/src/hooks/StaticColors";
import GlobalPressable from "../appwide/button/GlobalPressable";
import FriendTintPressable from "../appwide/button/FriendTintPressable";
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
  friendId,
  onPress = () => console.log("Soon Item button single press"),
  onDoublePress = () => console.log("Soon Item button dounle press"),
  disabled = false,
  textColor = "white",
  friendList,
  primaryBackground,
  lighterOverlayColor,
  darkerOverlayColor,
  primaryColor,
  overlayColor = "hotpink",
}) => {
  const lastPress = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const DOUBLE_PRESS_DELAY = 300;

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

  const [fontColor, setFontColor] = useState(
    textColor
  );

  const handleChangeTextColor = () => {
    if (textColor) {
      setFontColor(textColor);
    }
  };

  const handleRestoreTextColor = () => {
    setFontColor(textColor);
  };
  return (
    <FriendTintPressable
      friendList={friendList}
      friendId={friendId}
      startingColor={overlayColor}
      onPress={handlePress}
      onPressIn={handleChangeTextColor}
      onPressOut={handleRestoreTextColor}
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
      <View
        style={[
          styles.container,
          {
            flex: 1,
            width: width,
            alignItems: "center",
            borderWidth: 2,
            borderColor: 'transparent',
            backgroundColor: darkerOverlayColor,
       
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            height: "100%",
            alignItems: "center",
          
            padding: 10, 
          }}
        >
          <View style={[styles.calendarContainer]}>
            <Text style={[styles.text, { color: fontColor }]}> {date}</Text>
          </View>
          <Text style={[styles.text, { color: fontColor }]}>{friendName}</Text>
        </View>
      </View>
    </FriendTintPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    
    width: "100%",
    // padding: 10,
borderRadius: 4,
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
