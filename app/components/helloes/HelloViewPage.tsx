import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  DimensionValue,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";
import Animated, {
  useSharedValue,
  SharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import {
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

interface Props {
  item: object;
  index: number;
  width: DimensionValue;
  height: DimensionValue;
  listLength: number;
  currentIndexValue: SharedValue;
  cardScaleValue: SharedValue;
  openModal: () => void;
  closeModal: () => void;
}

const HelloViewPage: React.FC<Props> = ({
  item,
  index,
  width,
  height,
  listLength,
  currentIndexValue,
  cardScaleValue,
}) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();
  const [momentsViewing, setMomentsViewing] = useState(item.pastCapsules);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigation = useNavigation();
  const iconSize = 18;
  const iconTextSpacer = 10;
  const categoryButtonSpacer = 14;

  const pointsCount = item?.pastCapsules?.length || null;
  const dePluralizer = pointsCount === 1 ? "" : "s";

  const [currentIndex, setCurrentIndex] = useState();

  useAnimatedReaction(
    () => currentIndexValue.value,
    (newIndex, prevIndex) => {
      if (newIndex !== prevIndex) {
        runOnJS(setCurrentIndex)(newIndex);
      }
    },
    []
  );

  const cardScaleAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: cardScaleValue.value }],
  }));

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `pastCapsules-${index}`;

  const handleCategoryFilterPress = (category) => {
    setMomentsViewing(
      item.pastCapsules.filter((capsule) => capsule.typed_category === category)
    );
    setSelectedCategory(category);
  };

  const handleRemoveCategoryFilter = () => {
    setMomentsViewing(item.pastCapsules);
    setSelectedCategory(null);
  };

  const handleNavToReload = () => {
    navigation.navigate("Reload", {
      helloId: item.id,
      items: item.pastCapsules,
    });
  };

  return (
    <Animated.View
      style={[
        cardScaleAnimation,
        {
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          padding: 4,
          borderWidth: 0,
          width: width,
        },
      ]}
    >
      <View
        style={[
          appContainerStyles.talkingPointCard,
          {
            backgroundColor: themeStyles.primaryBackground.backgroundColor,
          },
        ]}
      >
        <View style={{ height: "90%", width: "100%" }}>
          <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
            <Text
              style={[themeStyles.primaryText, appFontStyles.welcomeText, {}]}
            >
              {/* Hello # {currentIndex + 1} */}
                  Hello # {listLength - currentIndex}
            </Text> 

            <View style={{padding: 10}}>
      

            <View style={{ flexDirection: "row" }}>
              <Fontisto
                name="date"
                size={iconSize}
                color={themeStyles.primaryText.color}
                style={{ marginRight: iconTextSpacer }}
              />
              <Text style={themeStyles.primaryText}>{item.date}</Text>
            </View>
               <View style={{ flexDirection: "row" }}>
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                size={iconSize}
                color={themeStyles.primaryText.color}
                style={{ marginRight: iconTextSpacer }}
              />
              <Text style={themeStyles.primaryText}>{item.locationName}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <MaterialCommunityIcons
                name="message-outline"
                size={iconSize}
                color={themeStyles.primaryText.color}
                style={{ marginRight: iconTextSpacer }}
              />
              <Text style={themeStyles.primaryText}>{item.type}</Text>
            </View>
            {pointsCount > 0 && (
              <>
                <View style={styles.row}>
                  <MaterialIcons
                    name="tips-and-updates"
                    size={iconSize}
                    color={themeStyles.primaryText.color}
                    style={{ marginRight: iconTextSpacer }}
                  />
                  <Text style={themeStyles.primaryText}>
                    {item?.pastCapsules?.length} point{dePluralizer} talked
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleNavToReload()}
                    style={{ marginHorizontal: categoryButtonSpacer }}
                  >
                    <Text
                      style={[themeStyles.primaryText, { fontWeight: "bold" }]}
                    >
                      Reload?
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    height: 200,
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: 20,
                    padding: 10,
                    backgroundColor: "limegreen",
                  }}
                >
                  <View style={{ height: 40, width: "100%" }}>
                    <FlashList
                      ListHeaderComponent={
                        <TouchableOpacity
                          style={{ marginRight: categoryButtonSpacer }}
                          onPress={() => handleRemoveCategoryFilter()}
                        >
                          <Text
                            style={{
                              color:
                                themeStyles.primaryBackground.backgroundColor,
                            }}
                          >
                            All
                          </Text>
                        </TouchableOpacity>
                      }
                      ListFooterComponent={<View style={{ width: 100 }}></View>}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      estimatedItemSize={100}
                      nestedScrollEnabled
                      data={[
                        ...new Set(
                          item.pastCapsules.map(
                            (capsule) => capsule.typed_category
                          )
                        ),
                      ]}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity
                            onPress={() => handleCategoryFilterPress(item)}
                            style={{
                              marginHorizontal: categoryButtonSpacer,
                              height: 30,
                            }}
                          >
                            <Text
                              numberOfLines={1}
                              style={[
                                themeStyles.primaryText,
                                {
                                  backgroundColor:
                                    themeStyles.lighterOverlayBackgroundColor
                                      .backgroundColor,
                                  borderRadius: 10,
                                  paddingHorizontal: 14,
                                  paddingVertical: 3,
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  color:
                                    selectedCategory === item
                                      ? "red"
                                      : themeStyles.primaryBackground
                                          .backgroundColor,
                                  opacity: selectedCategory === item ? 1 : 0.8,
                                },
                              ]}
                            >
                              {item}
                              {selectedCategory === item &&
                                ` (${momentsViewing.length}) `}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                  <FlatList
                    data={momentsViewing}
                    keyExtractor={extractItemKey}
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          style={{
                            height: "auto",
                            width: "100%",
                            marginVertical: 4,
                            padding: 20,
                            flexWrap: "flex",
                            borderRadius: 10,
                            backgroundColor:
                              themeStyles.genericTextBackgroundShadeTwo
                                .backgroundColor,
                          }}
                        >
                          <Text style={[themeStyles.primaryText]}>
                            {item.typed_category} {item.capsule}
                          </Text>
                        </View>
                      );
                    }}
                  />
                </View>
              </>
            )}
            {item?.additionalNotes && (
              <>
                <View style={[styles.row, { marginVertical: 10 }]}>
                  <MaterialIcons
                    name="notes"
                    size={iconSize}
                    color={themeStyles.primaryText.color}
                    style={{ marginRight: iconTextSpacer }}
                  />
                  <Text style={themeStyles.primaryText}>additional notes</Text>
                </View>
                <View
                  style={{
                    height: 'auto',
                    flex: 1,
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: 20,
                    padding: 10,
                    flexGrow: 1,
                    backgroundColor: "limegreen",
                  }}
                >
                  <View
                    style={{
                      height: "auto",
                      width: "100%",
                      marginVertical: 4,
                      padding: 20,

                      flexWrap: "flex",
                      borderRadius: 10,
                      backgroundColor:
                        themeStyles.genericTextBackgroundShadeTwo
                          .backgroundColor,
                    }}
                  >
                    <Text style={themeStyles.primaryText}>
                      {item.additionalNotes}
                    </Text>
                  </View>
                </View>
              </>
            )}
                    
            </View>
          </ScrollView>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    padding: 20,
    borderRadius: 10,
    width: "100%",
    height: "100%",
  },
  row: {
    marginBottom: 4,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingVertical: 4,
  },
});

export default HelloViewPage;
