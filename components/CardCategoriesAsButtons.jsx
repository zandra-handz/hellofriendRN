import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useCapsuleList } from "../context/CapsuleListContext";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import { useFriendList } from "../context/FriendListContext";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import ButtonAddCategory from "../components/ButtonAddCategory";
import AlertFormSubmit from "../components/AlertFormSubmit";

import ThoughtBubbleOutlineSvg from "../assets/svgs/thought-bubble-outline.svg"; // Import the SVG
import AddOutlineSvg from "../assets/svgs/add-outline.svg"; // Import the SVG

import SingleLineEnterBox from "../components/SingleLineEnterBox";

import ButtonBottomActionBaseSmallLongPress from "../components/ButtonBottomActionBaseSmallLongPress";
import ButtonBottomSaveMomentToCategory from "./ButtonBottomSaveMomentToCategory";
import LoadingPage from "../components/LoadingPage";

import ArrowLeftCircleOutline from "../assets/svgs/arrow-left-circle-outline.svg";
//  {`CATEGORIES (${categoryCount} / ${friendDashboardData[0].suggestion_settings.category_limit_formula})`}

const CardCategoriesAsButtons = ({
  onCategorySelect,
  momentTextForDisplay,
  onParentSave,
  showAllCategories = false,
  showInModal = true,
}) => {
  const { themeStyles } = useGlobalStyle();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryCapsules, setSelectedCategoryCapsules] =
    useState(null);
  const { selectedFriend, friendDashboardData, loadingNewFriend } =
    useSelectedFriend();
  const { capsuleList, categoryCount, categoryNames } = useCapsuleList();
  const [containerHeight, setContainerHeight] = useState(0);
  const [categoryLimit, setCategoryLimit] = useState("");
  const [remainingCategories, setRemainingCategories] = useState(null);
  const [newCategoryEntered, setNewCategoryEntered] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pressedOnce, setPressedOnce] = useState(false);
  const { themeAheadOfLoading } = useFriendList();

  const newCategoryRef = useRef(null);

  const [viewExistingCategories, setViewExistingCategories] = useState(true);

  const updateNewCategoryText = (text) => {
    if (newCategoryRef && newCategoryRef.current) {
      newCategoryRef.current.setText(text);
      console.log("in parent", newCategoryRef.current.getText());
    }
  };

  useEffect(() => {
    if (selectedFriend) {
      setSelectedCategory(null);
      fetchCategoryLimitData();
    }
  }, [selectedFriend, friendDashboardData]);

  useEffect(() => {
    if (categoryCount < 3) {
      setContainerHeight("100%");
    } else if (categoryCount > 8) {
      setContainerHeight("100%");
    } else {
      setContainerHeight(`100%`);
    }
  }, [categoryCount]);

  const fetchCategoryLimitData = async () => {
    console.log("category names: ", categoryNames);
    console.log("category counts: ", categoryCount);

    if (categoryCount < 3) {
      setContainerHeight("100%");
    } else if (categoryCount > 8) {
      setContainerHeight("100%");
    } else {
      setContainerHeight(`100%`);
    }

    try {
      if (friendDashboardData && friendDashboardData.length > 0) {
        const firstFriendData = friendDashboardData[0];
        const categoryLimitResponse =
          firstFriendData.suggestion_settings.category_limit_formula;
        const categoryLimitValue = parseInt(categoryLimitResponse);
        setCategoryLimit(categoryLimitValue);
        setRemainingCategories(categoryLimit - categoryCount);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  useEffect(() => {
    setRemainingCategories(categoryLimit - categoryCount);
  }, [categoryCount, categoryLimit]);

  useEffect(() => {
    console.log("remaining categories updated: ", remainingCategories);
  }, [remainingCategories]);

  const getMostCapsulesCategory = () => {
    if (capsuleList.length === 0) return null;
    const categoryCounts = {};

    capsuleList.forEach((capsule) => {
      const category = capsule.typedCategory;
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
      }
      categoryCounts[category]++;
    });

    const maxCount = Math.max(...Object.values(categoryCounts));
    const mostCapsulesCategories = Object.keys(categoryCounts).filter(
      (category) => categoryCounts[category] === maxCount
    );

    return mostCapsulesCategories[
      Math.floor(Math.random() * mostCapsulesCategories.length)
    ];
  };

  useEffect(() => {
    if (categoryCount > 0) {
      const mostCapsulesCategory = getMostCapsulesCategory();
      if (mostCapsulesCategory) {
        setSelectedCategory(mostCapsulesCategory);
      }
    }
  }, [capsuleList, categoryCount, categoryNames]);

  useEffect(() => {
    if (onCategorySelect) {
      if (selectedCategory === null) {
        onCategorySelect(null, []);
      } else {
        const category = selectedCategory;
        const capsulesForCategory = capsuleList.filter(
          (capsule) => capsule.typedCategory === category
        );
        onCategorySelect(category, capsulesForCategory);
      }
    }
  }, [selectedCategory]);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
    console.log("SELECTED CATEGORY!!!");
  };

  const handlePressOut = (category) => {
    if (category === selectedCategory && pressedOnce) {
      handleSave();
      console.log("SAVED IN HANDLEPRESSOUT!!!");
      setPressedOnce(false);
    } else {
      setSelectedCategory(category);
      setPressedOnce(true);
    }
  };

  const handleSave = () => {
    if (selectedCategory) {
      console.log("no save");
      onParentSave();
    }
  };

  const handleAllCategoriesPress = () => {
    console.log("Clicked All Categories");
    console.log("All capsules:", capsuleList);
    setSelectedCategory(null);
  };

  const handleNewCategory = (newCategory) => {
    setSelectedCategory(newCategory);
    onCategorySelect(newCategory, []);
    setNewCategoryEntered(true);
  };

  useEffect(() => {
    if (newCategoryEntered) {
      onParentSave();
      setNewCategoryEntered(false);
    }
  }, [newCategoryEntered]);

  const renderCapsules = () => {
    if (selectedCategory === null) {
      return capsuleList.map((capsule, index) => (
        <Text key={index} style={styles.capsulesText}>
          {capsule.capsule}
        </Text>
      ));
    } else {
      return capsuleList
        .filter((capsule) => capsule.typedCategory === selectedCategory)

        .map((capsule, index) => (
          <Text key={index} style={styles.capsulesText}>
            {capsule.capsule}
          </Text>
        ));
    }
  };

  useEffect(() => {
    setSelectedCategoryCapsules(
      capsuleList.filter(
        (capsule) => capsule.typedCategory === selectedCategory
      )
    );
  }, [selectedCategory]);

  useEffect(() => {
    console.log("selected capsules: ", selectedCategoryCapsules);
  }, [selectedCategoryCapsules]);

  return (
    <View style={[themeStyles.genericTextBackgroundShadeTwo, { flex: 1 }]}>
      <View
        style={[
          styles.container,
          themeStyles.genericTextBackgroundShadeTwo,
          { maxHeight: containerHeight, minHeight: 130 },
        ]}
      >
        {loadingNewFriend && (
          <View style={styles.loadingWrapper}>
            <LoadingPage
              loading={loadingNewFriend}
              spinnnerType="wander"
              spinnerSize={60}
              includeLabel={false}
            />
          </View>
        )}

        {friendDashboardData && categoryNames && !loadingNewFriend && (
          <>
            <View
              style={[
                styles.categoriesContainer,
                themeStyles.genericTextBackgroundShadeTwo,
              ]}
            >
              {showAllCategories && (
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === null && styles.selectedCategoryButton,
                  ]}
                  onPress={handleAllCategoriesPress}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === null && styles.selectedCategoryText,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="end"
                  >
                    All Categories
                  </Text>
                </TouchableOpacity>
              )}
              {categoryCount === 0 ? (
                <Text style={styles.noCategoriesText}>
                  Please enter a category
                </Text>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start", // Align items to the bottom of the container
                    height: "auto",
                    width: "100%",
                  }}
                >
                  {viewExistingCategories && (
                    <FlatList
                      data={categoryNames}
                      horizontal={true}
                      keyboardShouldPersistTaps="handled"
                      keyExtractor={(item, index) => index.toString()} // index as key extractor (though using a unique identifier is better if possible)
                      renderItem={({ item }) => (
                        <View
                          key={item}
                          style={{ width: 100, marginRight: "2%" }}
                        >
                          <ButtonBottomActionBaseSmallLongPress
                            height={"auto"}
                            onPress={() => handlePressOut(item)} // Correct way to pass the function
                            onLongPress={() => handleCategoryPress(item)} // Correct way to pass the function
                            label={item}
                            selected={item === selectedCategory} // Pass 'item' as the label (since it represents each category)
                            width={100}
                            fontFamily={"Poppins-Regular"}
                            shapeWidth={44}
                            shapeHeight={44}
                            shapePosition="right"
                            shapePositionValue={0}
                            shapePositionValueVertical={4}
                          />
                        </View>
                      )}
                      // Set the FlatList's contentContainerStyle to push items to the bottom
                      contentContainerStyle={{
                        //flexGrow: 1, // Allow the FlatList to grow and fill space
                        justifyContent: "space-around", // Push items to the bottom
                        maxHeight: containerHeight,
                      }}
                      ListFooterComponent={<View style={styles.flatListEndSpace} />} 
                    />
                  )}

                  {!viewExistingCategories && (
                    <View
                      style={{
                        flex: 1,
                        width: "100%",                   
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <SingleLineEnterBox
                        ref={newCategoryRef}
                        onEnterPress={onCategorySelect}
                        title={"New category: "}
                        onTextChange={updateNewCategoryText}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingBottom: 10,
                alignContent: "center",
                alignItems: "center",
                textAlign: "left",
              }}
            >
              {remainingCategories !== null && remainingCategories > 0 && (
                <View style={{ paddingLeft: 0, paddingBottom: 5 }}>
                  <AddOutlineSvg
                    width={32}
                    height={32}
                    color={themeStyles.modalIconColor.color}
                    onPress={() => setViewExistingCategories((prev) => !prev)}
                  />
                  {/* <ButtonAddCategory color={themeStyles.subHeaderText.color} onInputValueChange={handleNewCategory} width={32} height={32} />
                   */}
                </View>
              )}
            </View>

            {!showInModal && (
              <View style={styles.capsulesContainer}>
                <ScrollView>{renderCapsules()}</ScrollView>
              </View>
            )}
            {showInModal && (
              <AlertFormSubmit
                isModalVisible={modalVisible}
                headerContent={
                  <ThoughtBubbleOutlineSvg
                    width={38}
                    height={38}
                    color={"transparent"}
                  />
                }
                questionIsSubTitle={false}
                questionText={`${momentTextForDisplay}`}
                saveMoment={true}
                onCancel={() => setModalVisible(false)}
                onConfirm={onParentSave}
                confirmText={"Add to category"}
                cancelText={"Cancel"}
                useSvgForCancelInstead={
                  <ArrowLeftCircleOutline
                    height={34}
                    width={34}
                    color={themeStyles.genericText.color}
                  />
                }
                formHeight={300}
                formBody={
                  <View style={styles.selectMomentListContainer}>
                    <View
                      style={{
                        height: 40,
                        paddingBottom: 30,
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AddOutlineSvg
                        width={42}
                        height={42}
                        color={themeStyles.modalIconColor.color}
                      />
                    </View>

                    <View
                      style={[
                        styles.momentModalContainer,
                        themeStyles.genericTextBackgroundShadeTwo,
                      ]}
                    >
                      <Text
                        style={[
                          styles.momentModalTitle,
                          themeStyles.subHeaderText,
                        ]}
                      >
                        {selectedCategory}
                      </Text>
                      <FlatList
                        data={selectedCategoryCapsules}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                          <View style={styles.momentCheckboxContainer}>
                            <View style={styles.momentItemTextContainer}>
                              <View style={{ height: "100%" }}>
                                <View style={styles.checkboxContainer}>
                                  <ThoughtBubbleOutlineSvg
                                    height={24}
                                    width={24}
                                    color={themeStyles.modalIconColor.color}
                                  />
                                </View>
                              </View>
                              <View style={{ width: "86%" }}>
                                <Text
                                  style={[
                                    styles.momentItemText,
                                    themeStyles.genericText,
                                  ]}
                                >
                                  {item.capsule}
                                </Text>
                              </View>
                            </View>
                          </View>
                        )}
                      />
                    </View>
                  </View>
                }
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 2,
    padding: 0,
    borderWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 2,
    flex: 1,
    alignContent: "center",
    flexDirection: "row",
    height: "auto",
  },
  loadingWrapper: {
    flex: 1,
    paddingRight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    width: "100%",
    borderRadius: 20,
    flexWrap: "wrap", // Change this to flex-start
    flexDirection: "column",
    flex: 1, // Allows it to grow to fill available space, if necessary
  },

  categoryButton: {
    padding: 10,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    height: 130,
    overflow: "hidden", // Ensures text does not overflow the button
  },
  selectedCategoryButton: {
    backgroundColor: "#d4edda",
  },
  categoryText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "black",
    // Ensure text does not wrap
    textAlign: "center",
    overflow: "hidden",
  },
  selectedCategoryText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins-Bold",
  },
  noCategoriesText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    width: "100%",
  },
  capsulesContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
  },
  capsulesText: {
    fontSize: 16,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  selectMomentListContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%",
    width: "100%",
    borderRadius: 20,
    borderTopRightWidth: 0.6,
    borderColor: "darkgray",
  },

  momentModalTitle: {
    paddingTop: 10,
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginBottom: 6,
  },
  momentCheckboxContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    paddingTop: 4,
    paddingRight: 10,
    paddingLeft: 6,
  },
  momentItemTextContainer: {
    flexDirection: "row", // Allows text to wrap
    // Ensures text wraps to the next line
    alignItems: "flex-start", // Aligns text to the top
    marginBottom: 20,
    paddingBottom: 20,
    width: "100%", // Takes full width of the container
    borderBottomWidth: 0.4, // Add bottom border
    borderBottomColor: "#fff", // White color for the border
  },
  newMomentItemTextContainer: {
    flexDirection: "row", // Allows text to wrap
    // Ensures text wraps to the next line
    alignItems: "flex-start", // Aligns text to the top
    marginBottom: 10,
    paddingBottom: 20,
    maxHeight: 200,
    width: "100%",
  },
  locationTitle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 17,
    fontFamily: "Poppins-Regular",
  },
  momentItemText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    width: "100%",
  },
  newMomentItemText: {
    fontSize: 20,
    fontFamily: "Poppins-Regular",
    width: "100%",
  },
  momentModalContainer: {
    width: "100%",
    borderRadius: 10,
    padding: 0,

    height: 480,
    maxHeight: "80&",
    alignItems: "center",
  },
  flatListEndSpace: {

    width: 50,
  },
});

export default CardCategoriesAsButtons;
