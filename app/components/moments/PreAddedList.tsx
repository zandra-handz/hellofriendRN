import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";

import { FlashList } from "@shopify/flash-list";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage"; // no error message for this one
import { AppFontStyles } from "@/app/styles/AppFonts";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import CheckboxListItem from "./CheckboxListItem";
import EscortBar from "./EscortBar";
const PreAddedList = ({
  updateCapsule,
  preAdded,
  allCapsulesList,
  friendId,
  manualGradientColors,
  primaryColor,
  primaryBackground,
}) => {
  const ITEM_HEIGHT = 70;
  const [selectedMoments, setSelectedMoments] = useState([]);

  const { navigateToMoments } = useAppNavigations();

  const renderListItem = ({ item, index }) => {
    const isSelected = !!selectedMoments.find(
      (moment) => moment.id === item.id
    );

    return (
      <CheckboxListItem
        item={item}
        selectedItems={selectedMoments}
        isSelected={isSelected}
        height={ITEM_HEIGHT}
        onPress={handleCheckboxChange}
        manualGradientColors={manualGradientColors}
        primaryColor={primaryColor}
      />
    );
  };

  const filterOutNonAdded = allCapsulesList.filter((capsule) =>
    preAdded?.includes(capsule.id)
  );

  const handleRestore = () => {
    if (!friendId) {
      return;
    }

    if (selectedMoments.length < 1) {
      return;
    }
    selectedMoments.forEach((moment) => {
      updateCapsule({
        friendId: friendId,
        capsuleId: moment.id,
        isPreAdded: false,
      }); // Replace with your actual function
    });

    showFlashMessage(`Ideas restored!`, false, 1000);
    navigateToMoments({ scrollTo: 0 });
  };

  const handleSelectAll = () => {
    setSelectedMoments(allCapsulesList);
  };

  const handleDeSelectAll = () => {
    console.log("deselect pressed");
    setSelectedMoments([]);
  };

  const handleCheckboxChange = (item) => {
    setSelectedMoments((prevSelectedMoments) => {
      const isItemSelected = prevSelectedMoments?.includes(item);
      const updatedSelection = isItemSelected
        ? prevSelectedMoments.filter((selectedItem) => selectedItem !== item)
        : [...prevSelectedMoments, item];

      return updatedSelection;
    });
  };

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `preAdded-${index}`;

  return (
    <>
      <View style={styles.topBarContainer}>
        <Text
          style={[
            AppFontStyles.welcomeText,
            { color: primaryColor, fontSize: 22 },
          ]}
        >
          Undo add
        </Text>
        <View style={styles.pressableContainer}>
          <Pressable onPress={handleSelectAll} style={styles.pressable}>
            <Text
              style={[styles.labels,
                { color: primaryColor },
              ]}
            >
              Select all
            </Text>
          </Pressable>
          <Pressable onPress={handleDeSelectAll} style={styles.resetPressable}>
            <Text
              style={[styles.labels,
                { color: primaryColor},
              ]}
            >
              Reset
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.listContainer}>
        <FlashList
          data={filterOutNonAdded}
          estimatedItemSize={90}
          renderItem={renderListItem}
          keyExtractor={extractItemKey}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
        />
      </View>
      <View style={styles.footerContainer}>
        <EscortBar
          manualGradientColors={manualGradientColors}
          subWelcomeTextStyle={AppFontStyles.welcomeText}
          primaryColor={primaryColor}
          primaryBackground={primaryBackground}
          forwardFlowOn={false}
          label={"Restore Selected"}
          onPress={handleRestore}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  pressableContainer: {
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  pressable: {
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  resetPressable: {
    height: "100%",
    alignItems: "center",
    marginLeft: 20,
    flexDirection: "row",
  },
  labels: {
    fontSize: 12,
    fontWeight: "bold",
  },
  listContainer: {
    width: "100%",
    flex: 1,
  },
  footerContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    
  },
});

export default PreAddedList;
