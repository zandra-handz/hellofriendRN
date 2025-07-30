import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { FlashList } from "@shopify/flash-list";
import { CheckBox } from "react-native-elements";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
const ReloadList = ({ data }) => {
  const ITEM_HEIGHT = 70;
  const BOTTOM_MARGIN = 4;
  const COMBINED_HEIGHT = ITEM_HEIGHT + BOTTOM_MARGIN;
  const [selectedMoments, setSelectedMoments] = useState([]);
  const navigation = useNavigation();
  const { updateCapsule, preAdded, allCapsulesList } = useCapsuleList(); // also need to update cache
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();

  const handleRestore = () => {
    if (!selectedFriend?.id) {
      return;
    }
    selectedMoments.forEach((moment) => {
      updateCapsule({
        friendId: selectedFriend.id,
        capsuleId: moment.id,
        isPreAdded: false,
      }); // Replace with your actual function
    });
  };

  const renderListItem = ({ item, index }) => {
    const isSelected = !!selectedMoments.find(
      (moment) => moment.id === item.id
    );

    return (
      <View
        style={[
          // themeStyles.overlayBackgroundColor,
          {
            height: isSelected ? "auto" : ITEM_HEIGHT,
            minHeight: ITEM_HEIGHT,
            flexDirection: "row",
            width: "100%",
            paddingRight: 0,
            paddingVertical: 10,
            overflow: "hidden",
            backgroundColor: isSelected
              ? manualGradientColors.homeDarkColor
              : "transparent",
          },
        ]}
      >
        <View
          style={{
            height: "100%",
            width: 400,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckBox
            checked={selectedMoments?.includes(item)}
            onPress={() => handleCheckboxChange(item)}
            title={`#${item.typedCategory} - ${item.capsule}`}
            containerStyle={{
              borderWidth: 0,
              backgroundColor: isSelected
                ? manualGradientColors.homeDarkColor
                : "transparent",
              padding: 0,
              flex: 1,
              width: "100%",
            }}
            wrapperStyle={{
              height: "100%",
              lexDirection: "row",
              justifyContent: "space-between",
            }}
            textStyle={{
              width: "82%",
              color: isSelected
                ? manualGradientColors.lightColor
                : themeStyles.primaryText.color,
              fontSize: 13,
            }}
            uncheckedColor={themeStyles.primaryText.color}
            checkedColor={manualGradientColors.lightColor}
            iconRight={true}
            right={true}
          />
        </View>
      </View>
    );
  };

  const filterOutNonAdded = allCapsulesList.filter((capsule) =>
    preAdded?.includes(capsule.id)
  );

  // all at once
  // const handleRestore = async () => {
  //   await Promise.all(selectedMoments.map(moment => updateCapsule(moment.id, false)));
  // };

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

  //   const getItemLayout = (item, index) => {
  //     return {
  //       length: COMBINED_HEIGHT,
  //       offset: COMBINED_HEIGHT * index,
  //       index,
  //     };
  //   };

  return (
    <>
      <View
        style={[themeStyles.overlayBackgroundColor, { flex: 1, width: 500 }]}
      >
        <FlashList
          data={filterOutNonAdded}
          estimatedItemSize={90}
          renderItem={renderListItem}
          keyExtractor={extractItemKey}
          //  getItemLayout={getItemLayout}
          // initialNumToRender={10}
          // maxToRenderPerBatch={10}
          // windowSize={10}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
        />
      </View>
      <TouchableOpacity
        onPress={handleRestore}
        style={[
          {
            width: "100%",
            height: "auto",
            position: "absolute",
            bottom: 0,
            alignItems: "center",
            padding: 10,
            borderRadius: 20,
            backgroundColor: manualGradientColors.homeDarkColor,
          },
        ]}
      >
        <Text style={{ color: manualGradientColors.lightColor }}>Restore</Text>
      </TouchableOpacity>
    </>
  );
};

export default ReloadList;
