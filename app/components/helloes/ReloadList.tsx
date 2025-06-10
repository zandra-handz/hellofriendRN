import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { FlashList } from "@shopify/flash-list";
import { CheckBox } from "react-native-elements";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useHelloes } from "@/src/context/HelloesContext";
import useTalkingPFunctions from "@/src/hooks/useTalkingPFunctions";
import { useUser } from "@/src/context/UserContext"; 
 

const ReloadList = ({ helloId, items }) => {
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
const { user } = useUser();
  const ITEM_HEIGHT = 70;
  const BOTTOM_MARGIN = 4;
  const COMBINED_HEIGHT = ITEM_HEIGHT + BOTTOM_MARGIN;
  const [selectedMoments, setSelectedMoments] = useState([]);
  const navigation = useNavigation();

  const {
    updateCapsule,
    capsuleList,
    categoryCount,
    categoryNames,
    handleCreateMoment,
    createMomentMutation,
    preAdded,
    allCapsulesList,
    updateCapsuleMutation,
  } = useCapsuleList(); // also need to update cache
  const { themeStyles, manualGradientColors } = useGlobalStyle();

  const [combinedCategoryTotal, setCombinedCategoryTotal] = useState(categoryNames);
  //  const { helloesList } = useHelloes();
  //  const hello = helloesList.find((hello) => hello.id === helloId);

  const { getLargestCategory, getCategoryCap, getCreationsRemaining } =
    useTalkingPFunctions(capsuleList, friendDashboardData, categoryCount);

  const [remainingCategories, setRemainingCategories] = useState(
    getCreationsRemaining
  );
  const [categoryLimit, setCategoryLimit] = useState(getCategoryCap);

  const renderListItem = useCallback(
    ({ item, index }) => {
      const isSelected = !!selectedMoments.find(
        (moment) => moment.id === item.id
      );

      return (
        <View
          style={[
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
              title={`#${item.typed_category} - ${item.capsule}`}
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
                flexDirection: "row", // fixed typo from 'lexDirection'
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
    },
    [selectedMoments, manualGradientColors, themeStyles]
  );

  //   useEffect(() => {

  //   }, [updateCapsuleMutation]);

  // all at once
  // const handleRestore = async () => {
  //   await Promise.all(selectedMoments.map(moment => updateCapsule(moment.id, false)));
  // };
 

    const handleBulkCreateMoments = () => {
    selectedMoments.map((moment) => {
      const momentData = {
        user: user.id,
        friend: selectedFriend.id,

        selectedCategory: moment.typed_category,
        moment: moment.capsule,
      };

      handleCreateMoment(momentData);
    });
    navigation.navigate('Moments');
  };

  const handleCheckboxChange = (item) => {
    const isNewCategory = !combinedCategoryTotal.includes(item.typed_category);

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
        setCombinedCategoryTotal([...combinedCategoryTotal, item.typed_category]);
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
      <TouchableOpacity
        onPress={handleBulkCreateMoments}
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
        <Text style={{ color: manualGradientColors.lightColor }}>Reload</Text>
      </TouchableOpacity>
    </>
  );
};

export default ReloadList;
