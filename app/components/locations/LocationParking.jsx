import React, { useLayoutEffect, useState, useMemo } from "react";
import {
  View,
  Text, 
  StyleSheet,
  Pressable,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import useLocationDetailFunctions from "@/src/hooks/useLocationDetailFunctions";
import useDynamicUIFunctions from "@/src/hooks/useDynamicUIFunctions";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LocationParking = ({
  location,
  iconSize = 26,
  fadeOpacity = 0.8,
  openEditModal,
  closeEditModal,
}) => {
  const { themeStyles } = useGlobalStyle();
  const { getNumericParkingScore } = useLocationDetailFunctions();

  const { getScoreColor } = useDynamicUIFunctions();
  // const [hasNotes, setHasNotes] = useState(location.parking_score);
  const { label, score } = getNumericParkingScore(location.parking_score);

  // const [scoreColor, setScoreColor] = useState(getScoreColor([1, 6], score));
  // const [scoreLabel, setScoreLabel] = useState(label);

  const navigation = useNavigation();

  const closeModalAfterDelay = () => {
    let timeout;
    timeout = setTimeout(() => {
      closeEditModal();
    }, 1000);
  };


  const handleGoToLocationEditScreenFocusParking = () => {
    navigation.navigate("LocationEdit", {
      location: location,
      category: location.category || "",
      notes: location.personal_experience_info || "",
      parking: location.parking_score || "",
      focusOn: "focusParking",
    });
    // not sure if working the way I want it
    closeModalAfterDelay();
  };

  const handlePress = () => {
    const modalData = {
      title: "Parking score",
      icon: memoizedIcon,
      contentData: scoreLabel,
      onPress: () => handleGoToLocationEditScreenFocusParking(),
    };
    openEditModal(modalData);
    //setModalVisible(true);
  };

  // useLayoutEffect(() => {
  //   if (location && location.parking_score) {
  //     let { label, score } = getNumericParkingScore(location.parking_score);

  //     setScoreColor(getScoreColor([1, 6], score));
  //     setScoreLabel(label);
  //     setHasNotes(true);
  //   } else {
  //     setHasNotes(false);
  //   }
  // }, [location]);


  const { scoreLabel, scoreColor, hasNotes } = useMemo(() => {
  if (location && location.parking_score) {
    const { label, score } = getNumericParkingScore(location.parking_score);
    return {
      scoreLabel: label,
      scoreColor: getScoreColor([1, 6], score),
      hasNotes: true,
    };
  }
  return {
    scoreLabel: "No data",
    scoreColor: themeStyles.genericText.color,
    hasNotes: false,
  };
}, [location, themeStyles]);

  // since it's going inside of a TouchableOpacity which, I think, turns out, uses Animated View to control opacity of children
  // and is a mildly ugly color in DevTools when I profile
const memoizedIcon = useMemo(() => (
  <MaterialCommunityIcons
    name={hasNotes ? "car" : "car-cog"}
    size={iconSize}
    color={hasNotes ? scoreColor : themeStyles.genericText.color}
    opacity={hasNotes ? 1 : fadeOpacity}
    style={{ marginRight: 4 }}
  />
), [hasNotes, iconSize, scoreColor, themeStyles, fadeOpacity]);


  return (
    <View>
      {location && !String(location.id).startsWith("temp") && (
        <View style={styles.container}>
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            {memoizedIcon}
            <Text style={[themeStyles.primaryText, {}]}>{scoreLabel}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 2,
  },
  contentContainer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
  },
  notesContainer: {
    width: "100%",
    height: "60%",
    borderRadius: 30,
    padding: 20,
    textAlign: "top",
    justifyContent: "flex-start",
  },
  notesText: {
    fontSize: 15,
    lineHeight: 21,
  },
  parkingScoreContainer: {
    width: "100%",
    height: "30%",
    borderRadius: 30,
    padding: 20,
  },
  iconContainer: {
    margin: 0,
  },
  saveText: {
    marginLeft: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  textContainer: {
    padding: 20,
  },
  containerTitle: {
    fontSize: 16,
    marginBottom: "4%",
  },
  textInput: {
    textAlign: "top",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    height: 100,
  },
});

export default LocationParking;
