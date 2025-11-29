import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import React, { useCallback, useState } from "react";
import { FlashList } from "@shopify/flash-list";

import { CheckBox } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import EscortBar from "./EscortBar";
import { Moment } from "@/src/types/MomentContextTypes";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment"; 

interface FinalizeListProps {
  data: [];
  categories: [];
  preSelected: Moment[];
}

const FinalizeList: React.FC<FinalizeListProps> = ({
  friendId,
  userId,
  data,
  categories,
  preSelected,
  manualGradientColors,
  subWelcomeTextStyle,
  primaryColor,
  primaryBackground,
}) => {
  const ITEM_HEIGHT = 70;
  const BOTTOM_MARGIN = 4;
  const COMBINED_HEIGHT = ITEM_HEIGHT + BOTTOM_MARGIN;
  const CATEGORY_MARGIN = 10;
  const [selectedMoments, setSelectedMoments] = useState<Moment[]>([]);
  const [changedMoments, setChangedMoments] = useState<Moment[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<Moment[]>(data); //so that we can use the same value for All and for individual ones

  const navigation = useNavigation();

  const { handlePreAddMoment } = usePreAddMoment({
    userId: userId,
    friendId: friendId,
  });

  const handleCategoryFilterPress = (category: string) => {
    const filtered = data.filter(
      (moment: Moment) => moment.user_category_name === category
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
    ({ item }: { item: Moment }) => {
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
                  : primaryColor,
                fontSize: 13,
              }}
              uncheckedColor={primaryColor}
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

  const handleUpdateMoments = () => {
    if (!friendId) {
      return;
    }

    changedMoments.forEach((moment) => {
      handlePreAddMoment({
        friendId: friendId,
        capsuleId: moment.id,
        isPreAdded: !moment.preAdded,
      });
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

  const renderCategoryButton = ({ item, index }) => {
    return (
      <View style={{ marginHorizontal: CATEGORY_MARGIN }}>
        <Pressable
          onPress={() => handleCategoryFilterPress(item)}
          style={styles.categoryPressable}
        >
          <Text style={{ color: primaryColor }}># {item}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.catBarContainer}>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategoryButton}
            ListHeaderComponent={
              <Pressable
                onPress={() => handleShowAllCategoriesPress()}
                style={styles.categoryPressable}
              >
                <Text
                  style={[
                    { color: primaryColor, fontSize: 13, fontWeight: "bold" },
                  ]}
                >
                  All categories
                </Text>
              </Pressable>
            }
          />
        </View>
        <View style={styles.listContainer}>
          <FlashList
            data={visibleCategories}
            extraData={selectedMoments}
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
            subWelcomeTextStyle={subWelcomeTextStyle}
            onPress={handleUpdateMoments}
            primaryColor={primaryColor}
            primaryBackground={primaryBackground}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
  catBarContainer: {
    width: "100%",
    height: 40,
  },
  categoryPressable: {
    width: "auto",
    paddingLeft: 10,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
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

export default FinalizeList;
