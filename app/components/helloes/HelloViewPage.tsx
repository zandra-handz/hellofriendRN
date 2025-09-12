import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  DimensionValue,
} from "react-native";
import React, { useState  } from "react";
 
import { FlashList } from "@shopify/flash-list";
import Animated, { 
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
  marginBottom,
  darkerOverlayColor,
overlayColor,
  cardScaleValue,
  welcomeTextStyle,
  primaryColor = "orange",
  primaryBackground = "red",
  lighterOverlayColor = "yellow",
}) => { 

  //  console.log(item.thought_capsules_shared);
  const listifiedCapsules = item.thought_capsules_shared
    ? Object.keys(item.thought_capsules_shared).map((key) => {
        const capsule = item.thought_capsules_shared[key];

        return {
          id: key,
          capsule: capsule.capsule,
          typed_category: capsule.typed_capsule,
          user_category: capsule.user_category,
          user_category_name: capsule.user_category_name,
        };
      })
    : [];
  // console.log(`listifiedCapsules`, listifiedCapsules);

  const [momentsViewing, setMomentsViewing] = useState(listifiedCapsules);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigation = useNavigation();
  const iconSize = 18;
  const iconTextSpacer = 10;
  const categoryButtonSpacer = 14;

  const pointsCount = listifiedCapsules?.length || null;

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
      listifiedCapsules.filter(
        (capsule) => capsule.user_category_name === category
      )
    );
    setSelectedCategory(category);
  };

  const handleRemoveCategoryFilter = () => {
    setMomentsViewing(listifiedCapsules);
    setSelectedCategory(null);
  };

  const handleNavToReload = () => {
    navigation.navigate("Reload", {
      helloId: item.id,
      items: listifiedCapsules,
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
      {/* <View
        style={[
          styles.talkingPointCard,
          {
            backgroundColor: primaryBackground,
          },
        ]}
      > */}

            <View
              style={[
                {
                  width: "100%",
                  height: "100%",
                },
              ]}
            >
              <View
                style={[
                  {
                    padding: 20,
                    borderRadius: 40,
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    flex: 1,
                    marginBottom: marginBottom,
                    zIndex: 1,
                    overflow: "hidden",
                    backgroundColor:
                      lighterOverlayColor,
                  },
                ]}
              >

        <View style={{ height: "90%", width: "100%" }}>
          <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
            <Text style={[  welcomeTextStyle, {color: primaryColor}]}>
              {/* Hello # {currentIndex + 1} */}
              Hello details
              {/* # {listLength - currentIndex} */}
            </Text>

            <View style={{ padding: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Fontisto
                  name="date"
                  size={iconSize}
                  color={primaryColor}
                  style={{ marginRight: iconTextSpacer }}
                />
                <Text style={{color: primaryColor}}>{item.date}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="map-marker-radius-outline"
                  size={iconSize}
                  color={primaryColor}
                  style={{ marginRight: iconTextSpacer }}
                />
                <Text style={{color: primaryColor}}>
                  {item.location_name}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="message-outline"
                  size={iconSize}
                  color={primaryColor}
                  style={{ marginRight: iconTextSpacer }}
                />
                <Text style={{color: primaryColor}}>{item.type}</Text>
              </View>
              {pointsCount > 0 && (
                <>
                  <View style={styles.row}>
                    <MaterialIcons
                      name="tips-and-updates"
                      size={iconSize}
                      color={primaryColor}
                      style={{ marginRight: iconTextSpacer }}
                    />
                    <Text style={{color: primaryColor}}>
                      {item?.thought_capsules_shared?.length} point
                      {dePluralizer} talked
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleNavToReload()}
                      style={{ marginHorizontal: categoryButtonSpacer }}
                    >
                      <Text
                        style={[ 
                          { color: primaryColor, fontWeight: "bold" },
                        ]}
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
                   //   backgroundColor: "limegreen",
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
                                  primaryBackground
                              }}
                            >
                              All
                            </Text>
                          </TouchableOpacity>
                        }
                        ListFooterComponent={
                          <View style={{ width: 100 }}></View>
                        }
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        estimatedItemSize={100}
                        nestedScrollEnabled
                        data={[
                          ...new Set(
                            listifiedCapsules.map(
                              (capsule) => capsule.user_category_name
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
                                  {
                                    color: primaryColor, 
                                    backgroundColor: lighterOverlayColor,
                                    borderRadius: 10,
                                    paddingHorizontal: 14,
                                    paddingVertical: 3,
                                    fontSize: 12,
                                    fontWeight: "bold",
                                    color:
                                      selectedCategory === item
                                        ? "red"
                                        : primaryBackground,
                                    opacity:
                                      selectedCategory === item ? 1 : 0.8,
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
                              // backgroundColor:
                              //   themeStyles.genericTextBackgroundShadeTwo
                              //     .backgroundColor,
                            }}
                          >
                            <Text style={[{color: primaryColor}]}>
                              {item.user_category_original_name} {item.capsule}
                            </Text>
                          </View>
                        );
                      }}
                    />
                  </View>
                </>
              )}
              {item?.additional_notes && (
                <>
                  <View style={[styles.row, { marginVertical: 10 }]}>
                    <MaterialIcons
                      name="notes"
                      size={iconSize}
                      color={primaryColor}
                      style={{ marginRight: iconTextSpacer }}
                    />
                    <Text style={{color: primaryColor}}>
                      additional notes
                    </Text>
                  </View>
                  <View
                    style={{
                      height: "auto",
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
                        // backgroundColor:
                        //   themeStyles.genericTextBackgroundShadeTwo
                        //     .backgroundColor,
                      }}
                    >
                      <Text style={{color: primaryColor}}>
                        {item.additional_notes}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>
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
  talkingPointCard: {
    // not actually using for large talking point anymore
    // used with: backgroundColor: themeStyles.primaryBackground.backgroundColor,
    padding: 20,
    borderRadius: 40,
    width: "100%",
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
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
