import { View, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";

import useTalkingPFunctions from "@/src/hooks/useTalkingPFunctions";
import useCreateMoment from "@/src/hooks/CapsuleCalls/useCreateMoment";

import EscortBar from "../moments/EscortBar";
import CheckboxListItem from "../moments/CheckboxListItem";
import useTalkingPCategorySorting from "@/src/hooks/useTalkingPCategorySorting";

const ReloadList = ({
  manualGradientColors,
  subWelcomeTextStyle,
  primaryColor,
  primaryBackground,
  capsuleList,
  userId,
  friendId,
  friendDash,
  items,
}) => {
  const ITEM_HEIGHT = 70;
  const BOTTOM_MARGIN = 4;
  const COMBINED_HEIGHT = ITEM_HEIGHT + BOTTOM_MARGIN;
  const [selectedMoments, setSelectedMoments] = useState([]);
  const navigation = useNavigation();

  const { handleCreateMoment } = useCreateMoment({
    userId: userId,
    friendId: friendId,
  });
  const { categoryNames, categoryCount } = useTalkingPCategorySorting({
    listData: capsuleList,
  });
  //i added id to category names at a later date to get category colors for charts, simplest way to update this component is to remove extra data here
  const [combinedCategoryTotal, setCombinedCategoryTotal] = useState(
    categoryNames.map((c) => c.category)
  );

  const { getCategoryCap } = useTalkingPFunctions({
    listData: capsuleList,
    friendData: friendDash,
    categoryCount,
  });

  const renderListItem = useCallback(
    ({ item, index }) => {
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
    },
    [selectedMoments]
  );

  const handleBulkCreateMoments = () => {
    selectedMoments.map((moment) => {
      const momentData = {
        friend: friendId,

        selectedCategory: moment.typed_category,
        selectedUserCategory: moment.user_category,
        moment: moment.capsule,
      };

      handleCreateMoment(momentData);
    });
    navigation.navigate("Moments", { scrollTo: null });
  };

  const handleCheckboxChange = (item) => {
    const isNewCategory = !combinedCategoryTotal.includes(
      item.user_category_name
    );

    if (isNewCategory) {
      const categoryLimit = getCategoryCap();
      if (categoryLimit <= combinedCategoryTotal.length) {
        Alert.alert(
          `I'm sorry!`,
          "You can't add any additional categories for this round.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );

        return;
      } else {
        setCombinedCategoryTotal([
          ...combinedCategoryTotal,
          item.typed_category,
        ]);
      }
    }
    setSelectedMoments((prevSelectedMoments) => {
      const isItemSelected = prevSelectedMoments?.includes(item);
      const updatedSelection = isItemSelected
        ? prevSelectedMoments.filter((selectedItem) => selectedItem !== item)
        : [...prevSelectedMoments, item];

      return updatedSelection;
    });
  };

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `reload-${index}`;

 

  return (
    <>
      <View style={[{ flex: 1, flexShrink: 1, width: "100%" }]}>
        <FlashList
          data={items}
          // data={hello.pastCapsules}
          extraData={selectedMoments} //NEED THIS FOR SOME REASON
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
        manualGradientColors={manualGradientColors}
        subWelcomeTextStyle={subWelcomeTextStyle}
        primaryColor={primaryColor}
        primaryBackground={primaryBackground}
        forwardFlowOn={false}
        label={"Reload Selected"}
        onPress={handleBulkCreateMoments}
      />
    </>
  );
};

export default ReloadList;
