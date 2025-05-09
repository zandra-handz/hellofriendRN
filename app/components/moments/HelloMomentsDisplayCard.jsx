import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text, 
  FlatList,
} from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
 
import MomentArchived from "./MomentArchived";
import ButtonColorBGSmall from "../buttons/scaffolding/ButtonColorBGSmall";
 

const HelloMomentsDisplayCard = ({
  momentsData,
  momentsCategories,
  showAllCategories = true,
  title = "MOMENTS",
  height = "auto",
 
}) => {
  const { themeStyles } = useGlobalStyle();
  const [selectedCategory, setSelectedCategory] = useState("All Moments");
  const [categoryItems, setCategoryItems] = useState({});
  const visibleCategories = showAllCategories
    ? momentsCategories
    : momentsCategories.slice(0, 5);

  useEffect(() => {
    handleViewAllMoments(); // Automatically select "All Moments" on mount
  }, []);

  useEffect(() => {
    if (momentsData) {
      handleViewAllMoments(); // Automatically select "All Moments" on mount
    } else {
        handleReset();
    }
  }, [momentsData]);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    const items = momentsData.filter(
      (moment) => moment.typed_category === category
    );
    setCategoryItems({ [category]: items });
  };

  const handleReset = () => {
    setCategoryItems({});
  }

  const handleViewAllMoments = () => {
    setSelectedCategory("All Moments");
    const groupedMoments = momentsData.reduce((groups, moment) => {
      const category = moment.typed_category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(moment);
      return groups;
    }, {});
    setCategoryItems(groupedMoments);
  };

  const renderMomentItem = ({ item }) => (
    <View style={{ width: "100%", flex: 1, height: "auto", marginBottom: "4%" }}>
      <MomentArchived
        moment={item}
        iconSize={26}
        size={14}
        color={"black"}
        disabled={true}
        sameStyleForDisabled={true}
      />
    </View>
  );

  const renderCategoryGroup = ({ item }) => (
    <View>
      <Text style={[styles.categoryGroupTitle, themeStyles.subHeaderText]}>
        {item}
      </Text>
      <FlatList
        data={categoryItems[item]}
        renderItem={renderMomentItem}
        keyExtractor={(momentItem, idx) => `${item}-${idx}`}
      />
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        themeStyles.genericTextBackgroundShadeTwo,
        { height: height },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "auto",
        }}
      >
        <Text style={[styles.title, themeStyles.subHeaderText]}>{title}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "auto",
        }}
      >
        <Text style={themeStyles.genericText}>View by category: </Text>
        <FlatList
          data={visibleCategories}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={{ paddingRight: 6 }}>
              <ButtonColorBGSmall
                onPress={() => handleCategoryPress(item)}
                useLightColor={selectedCategory === item}
                title={item}
                textStyle={[
                  styles.categoryButtonText,
                  selectedCategory === item &&
                    styles.selectedCategoryButtonText,
                ]}
              />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {momentsData && (
        <FlatList
          data={Object.keys(categoryItems)}
          renderItem={renderCategoryGroup}
          keyExtractor={(item, index) => item.toString()}
          ListEmptyComponent={
            <Text style={styles.noItemsText}>No moments</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "60%",
    borderRadius: 30,
    padding: 20,
    textAlign: "top",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },

  notesText: {
    fontSize: 15,
    lineHeight: 21,
  },
  categoryGroupTitle: {
    opacity: .5,
  },
});

export default HelloMomentsDisplayCard;
