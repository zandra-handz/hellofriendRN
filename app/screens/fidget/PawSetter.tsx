import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Vibration,
  Animated,
} from "react-native";
import { useLDTheme } from "@/src/context/LDThemeContext";
import React, { useState, useMemo, useEffect, useRef } from "react";
import SvgIcon from "@/app/styles/SvgIcons";

const AnimatedPawButton = ({
  onPress,
  onLongPress,
  iconName,
  iconSize,
  color,
}: {
  onPress: () => void;
  onLongPress: () => void;
  iconName: string;
  iconSize: number;
  color: string;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const prevIconName = useRef(iconName);

  useEffect(() => {
    if (prevIconName.current !== iconName) {
      prevIconName.current = iconName;
      scale.setValue(0.6);
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 16,
      }).start();
    }
  }, [iconName]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.8,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 12,
      bounciness: 14,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.buttonContainer}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <SvgIcon name={iconName} size={iconSize} color={color} />
      </Animated.View>
    </Pressable>
  );
};

type Props = {
  color: string;
  backgroundColor: string;
  borderColor: string;
  momentsData: any[];
  lastSelected: any;
  updatePaw: (moment: any, index: number) => any;
};

const PawSetter = ({
  color,
  backgroundColor,
  borderColor,
  momentsData,
  lastSelected,
  updatePaw,
  clearPaw,
  registerClearAll,
  registerSyncPaws,
  clearAllPaws,
  triggerClearPaws,
  updateSelected,
  handleGetMoment,
}: Props) => {
  const iconSize = 22;
  const highlightColor = color || "#FFD700";

  const [localPaws, setLocalPaws] = useState([false, false, false, false]);

  useEffect(() => {
    const newPaws = [false, false, false, false];
    momentsData.forEach((moment) => {
      if (
        moment.stored_index !== null &&
        moment.stored_index >= 0 &&
        moment.stored_index < 4
      ) {
        newPaws[moment.stored_index] = true;
      }
    });
    setLocalPaws(newPaws);
  }, [momentsData]);

  useEffect(() => {
    if (!registerSyncPaws) return;

    registerSyncPaws(() => {
      const newPaws = [false, false, false, false];
      momentsData.forEach((moment) => {
        if (
          moment.stored_index !== null &&
          moment.stored_index >= 0 &&
          moment.stored_index < 4
        ) {
          newPaws[moment.stored_index] = true;
        }
      });
      console.log("setting local paws in pawsetter!!", Date.now());
      setLocalPaws(newPaws);
    });
  }, [registerSyncPaws, momentsData]);

  const runClearPaw = (index: number) => {
    const updatedHoldings = clearPaw(index);
    setLocalPaws(updatedHoldings.map((h) => h.id !== null));
  };

  const handleClearPaw = (index: number) => {
    if (!localPaws[index]) {
      return;
    }

    Alert.alert(
      "Are you sure?",
      "Do you want to drop this moment?",
      [
        { text: "Wait no", style: "cancel" },
        { text: "Yes", onPress: () => runClearPaw(index) },
      ],
      { cancelable: true },
    );
  };

  const handlePawPress = (index: number) => {
    if (!lastSelected.id) {
      return;
    }

    const momentInSlot = momentsData.find((m) => m.stored_index === index);

    if (momentInSlot && momentInSlot.id === lastSelected.id) {
      return;
    }

    if (localPaws[index]) {
      Alert.alert(
        "Are you sure?",
        "Select new moment?",
        [
          { text: "Oops no!", style: "cancel" },
          {
            text: "Yes please",
            onPress: () => {
              Vibration.vibrate(50);
              const last_selected = updateSelected(index);
              handleGetMoment(last_selected.id);
            },
          },
        ],
        { cancelable: true },
      );
      return;
    }

    const updatedHoldings = updatePaw(lastSelected, index);
    setLocalPaws(updatedHoldings.map((h) => h.id !== null));
  };

  useEffect(() => {
    if (registerClearAll) {
      registerClearAll(() => {
        const updatedHoldings = clearAllPaws();
        setLocalPaws(updatedHoldings.map((h) => h.id !== null));
        Vibration.vibrate(100);
      });
    }
  }, [registerClearAll, clearAllPaws]);

  const getPawColor = (index: number) => {
    const moment = momentsData.find((m) => m.stored_index === index);
    if (moment && lastSelected && moment.id === lastSelected.id) {
      return highlightColor;
    }
    return borderColor;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: "transparent", borderColor: borderColor },
      ]}
    >
      <View style={styles.row}>
        <AnimatedPawButton
          onPress={() => handlePawPress(0)}
          onLongPress={() => handleClearPaw(0)}
          iconName={localPaws[0] ? "circle" : "circle_outline"}
          iconSize={iconSize}
          color={getPawColor(0)}
        />
        <AnimatedPawButton
          onPress={() => handlePawPress(1)}
          onLongPress={() => handleClearPaw(1)}
          iconName={localPaws[1] ? "circle" : "circle_outline"}
          iconSize={iconSize}
          color={getPawColor(1)}
        />
      </View>
      <View style={styles.row}>
        <AnimatedPawButton
          onPress={() => handlePawPress(2)}
          onLongPress={() => handleClearPaw(2)}
          iconName={localPaws[2] ? "circle" : "circle_outline"}
          iconSize={iconSize}
          color={getPawColor(2)}
        />
        <AnimatedPawButton
          onPress={() => handlePawPress(3)}
          onLongPress={() => handleClearPaw(3)}
          iconName={localPaws[3] ? "circle" : "circle_outline"}
          iconSize={iconSize}
          color={getPawColor(3)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 100,
    width: 100,
    padding: 10,
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    height: "50%",
    width: "100%",
    justifyContent: "space-evenly",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PawSetter;