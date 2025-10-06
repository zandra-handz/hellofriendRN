import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
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
  primaryColor,
  compact = false,
  noLabel = false,
}) => {
  const { getNumericParkingScore } = useLocationDetailFunctions();

  const { getScoreColor } = useDynamicUIFunctions();
  // const { label, score } = getNumericParkingScore(location.parking_score);

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
  };

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
      scoreLabel: "Set parking score",
      scoreColor: primaryColor,
      hasNotes: false,
    };
  }, [location, primaryColor]);

  // since it's going inside of a TouchableOpacity which, I think, turns out, uses Animated View to control opacity of children
  // and is a mildly ugly color in DevTools when I profile
  const memoizedIcon = useMemo(
    () => (
      <MaterialCommunityIcons
        name={hasNotes ? "car" : "car-cog"}
        size={iconSize}
        color={hasNotes ? scoreColor : primaryColor}
        opacity={hasNotes ? 1 : fadeOpacity}
        style={{ marginRight: 4 }}
      />
    ),
    [hasNotes, iconSize, scoreColor, primaryColor, fadeOpacity]
  );

  return (
    <View>
      {location && !String(location.id).startsWith("temp") && (
        <View style={styles.container}>
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => ({
              flexDirection: compact ? "column" : "row",
              alignItems: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            {memoizedIcon}
            {!noLabel && (
              <Text style={{ color: primaryColor }}>{scoreLabel}</Text>
            )}
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
