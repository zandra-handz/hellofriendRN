import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { useLDTheme } from "@/src/context/LDThemeContext";
 

type Props = {
  message: string;
  triggerMessage: number;
  visibleDuration: number;
  onClose: () => void;
};

const TinyFlashMessage = ({
  message = `message go here ape stronk`,
  triggerMessage,
  visibleDuration = 2000,
}: Props) => {
  const { lightDarkTheme} = useLDTheme(); 
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutRef2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  //   const [triggerMessage, setTriggerMessage] = useState<number>(0); // set with Date.now()

  useEffect(() => {
    console.log("!!!~!~!~!~!~!~!~!~!~!~!~ MESSAGE TRIGGERED IN TINY FLASH");
    if (triggerMessage) {
      setVisible(true);
    }
  }, [triggerMessage]);

  const scaleValue = useSharedValue(0);
  const opacityValue = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      scaleValue.value = withTiming(1, { duration: 200 });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (timeoutRef2.current) {
        clearTimeout(timeoutRef2.current);
        timeoutRef2.current = null;
      }

      timeoutRef2.current = setTimeout(() => {
        scaleValue.value = withTiming(0, { duration: 300 });
      }, visibleDuration - 300);

      timeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, visibleDuration);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  return (
    <>
      {visible && (
        <View
          style={[
            animatedStyle,
            StyleSheet.absoluteFillObject,
            {
              alignItems: "center",
              flexDirection: "column",
             // backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              paddingHorizontal: 50,
            },
          ]}
        >
          <Animated.View
            style={[
              animatedStyle,
              lightDarkTheme.primaryBackground,
              {
                width: "100%",
                height: "auto",
                minHeight: 100,
                padding: 20,
                alignItems: "center",
                borderRadius: 10,
                marginBottom: 100,
              },
            ]}
          >
            <Text style={lightDarkTheme.primaryText}>{message}</Text>
          </Animated.View>
        </View>
      )}
    </>
  );
};

export default TinyFlashMessage;
