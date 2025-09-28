import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
} from "react-native"; 
import DragRightThickOutlineSvg from "@/app/assets/svgs/drag-right-thick-outline.svg";

const SlideToDeleteHeader = ({
  paddingHorizontal=6,
  onPress,
  itemToDelete,
  sliderText = "DELETE?",
  sliderTextColor = 'black',
  sliderColor = "red",
  targetIcon: TargetIcon,
  width = Dimensions.get("window").width - 50,
  appLightColor='hotpink',
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const position = useRef(new Animated.Value(0)).current;
  const isDraggingRef = useRef(false);
  const deleteItemRef = useRef(null); 
  const [deleteItem, setDeleteItem] = useState();

  const handlePress = () => {
    const item = deleteItemRef.current;
    if (item) {
      if (onPress) onPress(item);
    } else {
      console.error("Error: deleteItem is undefined");
    }
  };

  useEffect(() => {
    if (itemToDelete) {
      ///console.log('slider item: ', itemToDelete);
      setDeleteItem(itemToDelete);
      deleteItemRef.current = itemToDelete;
    }
  }, [itemToDelete]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= width) {
          position.setValue(gestureState.dx);

          if (gestureState.dx >= width * 0.2 && !isDraggingRef.current) {
            isDraggingRef.current = true; // Update ref immediately
            setIsDragging(true); // Update state for UI
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= width * 0.7) {
          handlePress();
          setIsPressed(true);
        }

        isDraggingRef.current = false; // Reset ref immediately
        setIsDragging(false); // Reset state for UI

        Animated.spring(position, {
          toValue: 0,
          useNativeDriver: true,
          speed: 15, // Faster spring animation
          bounciness: 8, // Lower bounciness for quicker reset
        }).start();
      },
    })
  ).current;

  const sliderWidth = width;

  return (
    <View
      style={[
        styles.container,
        {
          width: sliderWidth,
          backgroundColor: isDragging ? sliderColor : "transparent",
        },
      ]}
    >
      {deleteItem && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.slider,
            {
              flexDirection: "row",
              paddingHorizontal: paddingHorizontal,
              backgroundColor: isDragging ? "#000002" : "transparent",
              transform: [{ translateX: position }],
              width: "auto",
            },
          ]}
        >
          <Text
            style={[
              styles.sliderText,
              { color: isDragging ? "white" : sliderTextColor },
            ]}
          >
            {sliderText}
          </Text>

          <View style={{ paddingHorizontal: 10}}>
            <DragRightThickOutlineSvg
              height={18}
              width={18}
              color={isDragging ? "white" : sliderTextColor}
            />
          </View>
        </Animated.View>
      )}

      {TargetIcon && (
        <View style={[styles.iconContainer, {paddingRight: paddingHorizontal}]}>
          <TargetIcon
            height={30}
            width={30}
            color={isDragging ? appLightColor : "transparent"}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    margin: 0,
  },
  text: {
    position: "absolute",
    color: "#333",
    fontSize: 16,
  },
  slider: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",

    height: "100%",
    borderRadius: 30,
    borderWidth: 0.8,
    borderColor: "transparent",
  },
  sliderText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  iconContainer: {
    position: "absolute",
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SlideToDeleteHeader;
