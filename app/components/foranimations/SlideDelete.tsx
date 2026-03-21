import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
} from "react-native";
import SvgIcon from "@/app/styles/SvgIcons";

type Props = {
  onDelete: () => void;
  sliderText?: string;
  sliderTextColor?: string;
  sliderColor?: string;
  paddingHorizontal?: number;
  width?: number;
  appLightColor?: string;
};

const SlideDelete = ({
  onDelete,
  sliderText = "Delete?",
  sliderTextColor = "black",
  sliderColor = "red",
  paddingHorizontal = 6,
  width = Dimensions.get("window").width - 50,
  appLightColor = "hotpink",
}: Props) => {
  const position = useRef(new Animated.Value(0)).current;
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= width) {
          position.setValue(gestureState.dx);
          if (gestureState.dx >= width * 0.2 && !isDraggingRef.current) {
            isDraggingRef.current = true;
            setIsDragging(true);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= width * 0.7) {
          onDelete();
        }

        isDraggingRef.current = false;
        setIsDragging(false);

        Animated.spring(position, {
          toValue: 0,
          useNativeDriver: true,
          speed: 15,
          bounciness: 8,
        }).start();
      },
    }),
  ).current;

  return (
    <View
      style={[
        styles.container,
        {
          width,
          backgroundColor: isDragging ? sliderColor : "transparent",
        },
      ]}
    >
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slider,
          {
            paddingHorizontal,
            backgroundColor: isDragging ? "#000002" : "transparent",
            transform: [{ translateX: position }],
          },
        ]}
      >
        <Text style={[styles.sliderText, { color: isDragging ? "white" : sliderTextColor }]}>
          {sliderText}
        </Text>
        <View style={{ paddingHorizontal: 10 }}>
          <SvgIcon
            name={"hand_pointing_right"}
            size={22}
            color={isDragging ? "white" : sliderTextColor}
          />
        </View>
      </Animated.View>

      <View style={[styles.iconContainer, { paddingRight: paddingHorizontal }]}>
        <SvgIcon
          name={"delete"}
          size={22}
          color={isDragging ? appLightColor : "transparent"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  slider: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderRadius: 30,
    borderWidth: 0.8,
    borderColor: "transparent",
  },
  sliderText: {
    fontSize: 12,
  },
  iconContainer: {
    position: "absolute",
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SlideDelete;