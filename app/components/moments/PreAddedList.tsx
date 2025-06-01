import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { FlashList } from "@shopify/flash-list";
import { CheckBox } from "react-native-elements";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";

const PreAddedList = () => {
  const ITEM_HEIGHT = 70;
  const BOTTOM_MARGIN = 4;
  const COMBINED_HEIGHT = ITEM_HEIGHT + BOTTOM_MARGIN;
  const [selectedMoments, setSelectedMoments] = useState([]);
  const navigation = useNavigation();
  const { updateCapsule, capsuleList, preAdded, allCapsulesList, updateCapsuleMutation } =
    useCapsuleList(); // also need to update cache
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const renderListItem = ({ item, index }) => {
    return (
      <View
        style={[
          themeStyles.overlayBackgroundColor,
          {
            height: ITEM_HEIGHT,
            flexDirection: "row",
            width: "100%",
            padding: 20,
            paddingRight: 0,
            overflow: "hidden",
          },
        ]}
      >
        <View style={{ width: "70%" }}>
          <Text numberOfLines={2} style={[themeStyles.primaryText, {fontSize: 13}]}>
            {item?.capsule}
          </Text>
        </View>
        <View style={{ height: 30, width: "30&",  alignItems: 'center', justifyContent: 'center' }}>
          <CheckBox
            checked={selectedMoments?.includes(item)}
            onPress={() => handleCheckboxChange(item)}
            containerStyle={{ margin: 0, padding: 0 }}
          />
        </View>
      </View>
    );
  };

//   useEffect(() => {

//   }, [updateCapsuleMutation]);

  const filterNonAdded = allCapsulesList.filter((capsule) =>
    preAdded?.includes(capsule.id)
  );

  // all at once
// const handleRestore = async () => {
//   await Promise.all(selectedMoments.map(moment => updateCapsule(moment.id, false)));
// };


const handleRestore = () => {
  selectedMoments.forEach((moment) => {
    updateCapsule(moment.id, false); // Replace with your actual function
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
    item?.id ? item.id.toString() : `placeholder-${index}`;

  //   const getItemLayout = (item, index) => {
  //     return {
  //       length: COMBINED_HEIGHT,
  //       offset: COMBINED_HEIGHT * index,
  //       index,
  //     };
  //   };

  return (
    <>
    <View style={{ height: 500, width: 500 }}>
      <FlashList
        data={filterNonAdded}
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
    <TouchableOpacity onPress={handleRestore} style={[{width: '100%', height: 'auto', alignItems: 'center', padding: 10, borderRadius: 20, backgroundColor: manualGradientColors.homeDarkColor}]}>
        <Text style={{color: manualGradientColors.lightColor}}>
            Restore
        </Text>

    </TouchableOpacity>
    </>
  );
};

export default PreAddedList;
