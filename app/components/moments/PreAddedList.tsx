import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { FlashList } from "@shopify/flash-list";
import { CheckBox } from "react-native-elements";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import CheckboxListItem from "./CheckboxListItem";
import EscortBar from "./EscortBar";
const PreAddedList = () => {
  const ITEM_HEIGHT = 70;
  const BOTTOM_MARGIN = 4;
  const COMBINED_HEIGHT = ITEM_HEIGHT + BOTTOM_MARGIN;
  const [selectedMoments, setSelectedMoments] = useState([]);

  const { updateCapsule, preAdded, allCapsulesList } = useCapsuleList(); // also need to update cache
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();

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

      /> 
    );
  };

  //   useEffect(() => {

  //   }, [updateCapsuleMutation]);

  const filterOutNonAdded = allCapsulesList.filter((capsule) =>
    preAdded?.includes(capsule.id)
  );

  // all at once
  // const handleRestore = async () => {
  //   await Promise.all(selectedMoments.map(moment => updateCapsule(moment.id, false)));
  // };

  const handleRestore = () => {
    if (!selectedFriend?.id) {
      return;
    }
    selectedMoments.forEach((moment) => {
      updateCapsule({
        friendId: selectedFriend?.id,
        capsuleId: moment.id,
        isPreAdded: false,
      }); // Replace with your actual function
    });
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
      <View style={[{ flex: 1, flexShrink: 1, width: "100%" }]}>
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
      <EscortBar
        forwardFlowOn={false}
        label={"Restore Selected"}
        onPress={handleRestore}
      />
    </>
  );
};

export default PreAddedList;
