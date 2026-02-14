import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Vibration,
} from "react-native";
import { useLDTheme } from "@/src/context/LDThemeContext";
import React, { useState, useMemo, useEffect } from "react";
import SvgIcon from "@/app/styles/SvgIcons";

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
  const iconSize = 26;
  const highlightColor = color || "#FFD700"; // Use accent or gold as highlight

  const [localPaws, setLocalPaws] = useState([false, false, false, false]);

  // Initialize localPaws from momentsData
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
        console.log('setting local paws in pawsetter!!', Date.now())
      setLocalPaws(newPaws);
    });
  }, [registerSyncPaws, momentsData]);

  const runClearPaw = (index: number) => {
    // console.log("long press! clear paw here if any is here");
    const updatedHoldings = clearPaw(index);

    // Map holdings to boolean array for icon display
    setLocalPaws(updatedHoldings.map((h) => h.id !== null));
  };

  const handleClearPaw = (index: number) => {
    if (!localPaws[index]) {
      // console.log("nothing here for long press!");
      return;
    }

    Alert.alert(
      "Are you sure?",
      "Do you want to drop this moment?",
      [
        {
          text: "Wait no",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            runClearPaw(index);
          },
        },
      ],
      { cancelable: true },
    );
  };

 
  // useEffect(() => {
  //   if (triggerClearPaws) {
  //     console.log("clearing all paws in paw setter");
  //     handleClearAllPaws();
  //   }
  // }, [triggerClearPaws]);

  // const handlePawPress = (index: number) => {
  //   if (!lastSelected.id) {
  //     // console.log("no lastSelect");
  //     return;
  //   }

  //   if (localPaws[index]) {
  //     // console.log("one is held here");

  //     Alert.alert(
  //       "Are you sure?",
  //       "Select new moment?",
  //       [
  //         {
  //           text: "Oops no!",
  //           style: "cancel",
  //         },
  //         {
  //           text: "Yes please",
  //           onPress: () => {
  //             Vibration.vibrate(50);
  //             const last_selected = updateSelected(index);
  //             //  console.log(last_selected)
  //             handleGetMoment(last_selected.id);
  //           },
  //         },
  //       ],
  //       { cancelable: true },
  //     );
  //     return;
  //   }
  //   // console.log(lastSelected);
  //   const updatedHoldings = updatePaw(lastSelected, index);

  //   // Map holdings to boolean array for icon display
  //   setLocalPaws(updatedHoldings.map((h) => h.id !== null));
  //   // console.log(localPaws);
  // };

  const handlePawPress = (index: number) => {
    if (!lastSelected.id) {
      return; // no selected moment, do nothing
    }

    const momentInSlot = momentsData.find((m) => m.stored_index === index);

    // EARLY RETURN: if the paw already holds the lastSelected moment
    if (momentInSlot && momentInSlot.id === lastSelected.id) {
      return; // do nothing
    }

    if (localPaws[index]) {
      Alert.alert(
        "Are you sure?",
        "Select new moment?",
        [
          {
            text: "Oops no!",
            style: "cancel",
          },
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

    // Otherwise, assign lastSelected to this paw
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
    // console.log('paw color updating', index, lastSelected.id)
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
        { backgroundColor: backgroundColor, borderColor: borderColor },
      ]}
    >
      {/* <Pressable
        onPress={() => handleClearAllPaws()}
        style={{
          position: "absolute",
          top: -50,
          left: 0,
          height: 40,
          width: 40,
          borderRadius: 999,
          backgroundColor: "pink",
        }}
      ></Pressable> */}
      <View style={styles.row}>
        <Pressable
          onLongPress={() => handleClearPaw(0)}
          onPress={() => handlePawPress(0)}
          style={styles.buttonContainer}
        >
          <SvgIcon
            name={localPaws[0] ? `paw` : `paw_outline`}
            size={iconSize}
            color={getPawColor(0)}
          />
        </Pressable>
        <Pressable
          onLongPress={() => handleClearPaw(1)}
          onPress={() => handlePawPress(1)}
          style={styles.buttonContainer}
        >
          <SvgIcon
            name={localPaws[1] ? `paw` : `paw_outline`}
            size={iconSize}
            color={getPawColor(1)}
          />
        </Pressable>
      </View>
      <View style={styles.row}>
        <Pressable
          onLongPress={() => handleClearPaw(2)}
          onPress={() => handlePawPress(2)}
          style={styles.buttonContainer}
        >
          <SvgIcon
            name={localPaws[2] ? `paw` : `paw_outline`}
            size={iconSize}
            color={getPawColor(2)}
          />
        </Pressable>
        <Pressable
          onLongPress={() => handleClearPaw(3)}
          onPress={() => handlePawPress(3)}
          style={styles.buttonContainer}
        >
          <SvgIcon
            name={localPaws[3] ? `paw` : `paw_outline`}
            size={iconSize}
            color={getPawColor(3)}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 120,
    paddingTop: 18,
    paddingBottom: 20,
    width: 120,
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  row: {
    flexDirection: "row",
    height: "50%",
    width: "80%",
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
