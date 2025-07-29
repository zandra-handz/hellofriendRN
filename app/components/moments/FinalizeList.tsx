import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useCallback, useState } from "react";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { FlashList } from "@shopify/flash-list";
import { CheckBox } from "react-native-elements";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import EscortBar from "./EscortBar";

interface FinalizeListProps {
  data: [];
  categories: [];
  preSelected: [];
}

const FinalizeList: React.FC<FinalizeListProps> = ({
  data,
  categories,
  preSelected,
}) => {
  const ITEM_HEIGHT = 70;
  const BOTTOM_MARGIN = 4;
  const COMBINED_HEIGHT = ITEM_HEIGHT + BOTTOM_MARGIN;
  const CATEGORY_MARGIN = 10;
  const [selectedMoments, setSelectedMoments] = useState([]);
  const [changedMoments, setChangedMoments] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(data); //so that we can use the same value for All and for individual ones

  const navigation = useNavigation();
  const { updateCapsule } = useCapsuleList(); // also need to update cache
  const { themeStyles, manualGradientColors } = useGlobalStyle();

  const handleCategoryFilterPress = (category) => {
    const filtered = data.filter(
      (moment) => moment.user_category_name === category
    );
    setVisibleCategories(filtered);
  };

  const handleShowAllCategoriesPress = () => {
    setVisibleCategories(data);
  };

  useFocusEffect(
    useCallback(() => {
      //console.log(preSelected);
      // if (data?.length < 1 || preSelected.length < 1) {
      //     return;
      // }

      const selected = data.filter((moment) => preSelected.includes(moment.id));
      setSelectedMoments(selected);

      return () => {
        setVisibleCategories([]);
        setSelectedMoments([]); //for displaying UI checkbox
        setChangedMoments([]); //tracks which moments need to be updated on backend so that can do all at once with 'save and continue' button
      };
    }, [data, preSelected])
  );

  const renderListItem = useCallback(
    ({ item }) => {
      const isSelected = selectedMoments?.some((m) => m.id === item.id);

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
              marginBottom: 5,
              borderRadius: 30,
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
              // width: 300,
              flexShrink: 1,
              paddingHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckBox
              checked={selectedMoments?.some((m) => m.id === item.id)}
              onPress={() => handleCheckboxChange(item)}
              title={`#${item.user_category_name} - ${item.capsule}`}
              titleProps={{ numberOfLines: isSelected ? undefined : 1 }}
              containerStyle={{
                borderWidth: 0,
                borderRadius: 30,
                overflow: "hidden",
                backgroundColor: isSelected
                  ? manualGradientColors.homeDarkColor
                  : "transparent",
                padding: 0,
                flex: 1,
                width: "100%",
              }}
              wrapperStyle={{
                height: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              textStyle={{
                width: "100%",
                flexShrink: 1,
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
    [selectedMoments, manualGradientColors]
  );
  //   useEffect(() => {

  //   }, [updateCapsuleMutation]);

  // all at once
  // const handleRestore = async () => {
  //   await Promise.all(selectedMoments.map(moment => updateCapsule(moment.id, false)));
  // };

  const handleUpdateMoments = () => {
    changedMoments.forEach((moment) => {
      updateCapsule(moment.id, !moment.preAdded);
    });
    navigation.navigate("AddHello");
  };

  const handleCheckboxChange = (item) => {
    setSelectedMoments((prevSelectedMoments) => {
      const isItemSelected = prevSelectedMoments?.some((m) => m.id === item.id);
      const updatedSelection = isItemSelected
        ? prevSelectedMoments.filter(
            (selectedItem) => selectedItem.id !== item.id
          )
        : [...prevSelectedMoments, item];
      return updatedSelection;
    });

    setChangedMoments((prevChangedMoments) => {
      const isItemChanged = prevChangedMoments?.some((m) => m.id === item.id);
      const updatedChangedList = isItemChanged
        ? prevChangedMoments.filter(
            (selectedItem) => selectedItem.id !== item.id
          )
        : [...prevChangedMoments, item];
      return updatedChangedList;
    });
  };

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `finalize-${index}`;

  //   const getItemLayout = (item, index) => {
  //     return {
  //       length: COMBINED_HEIGHT,
  //       offset: COMBINED_HEIGHT * index,
  //       index,
  //     };
  //   };

  const renderCategoryButton = ({ item, index }) => {
    return (
      <View style={{ marginHorizontal: CATEGORY_MARGIN }}>
        <TouchableOpacity
          onPress={() => handleCategoryFilterPress(item)}
          style={{
            width: "auto",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={themeStyles.genericText}># {item}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <View style={[{ flex: 1, flexShrink: 1, width: "100%" }]}>
        <View style={{ width: "100%", height: 40 }}>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategoryButton}
            ListHeaderComponent={
              <TouchableOpacity
                onPress={() => handleShowAllCategoriesPress()}
                style={{
                  width: "auto",
                  paddingLeft: 10,
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[
                    themeStyles.primaryText,
                    { fontSize: 13, fontWeight: "bold" },
                  ]}
                >
                  All categories
                </Text>
              </TouchableOpacity>
            }
          />
        </View>

        <FlashList
          data={visibleCategories}
          extraData={selectedMoments}
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
      <EscortBar   onPress={handleUpdateMoments} />
      {/* <TouchableOpacity
        onPress={handleUpdateMoments}
        style={[
          {
            width: "100%",
            height: "auto",
            // position: "absolute",
            bottom: 0,
            alignItems: "center",
            padding: 10,
            borderRadius: 20,
            backgroundColor: manualGradientColors.homeDarkColor,
          },
        ]}
      >
        <Text style={{ color: manualGradientColors.lightColor }}>
          Save and continue
        </Text>
      </TouchableOpacity> */}
    </>
  );
};

export default FinalizeList;
