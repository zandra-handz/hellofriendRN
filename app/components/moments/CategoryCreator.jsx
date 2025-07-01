import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import AddOutlineSvg from "@/app/assets/svgs/add-outline.svg";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import useTalkingPFunctions from "@/src/hooks/useTalkingPFunctions";
import SingleLineEnterBox from "@/app/components/appwide/input/SingleLineEnterBox";
import ButtonBottomActionBaseSmallLongPress from "../buttons/scaffolding/ButtonBottomActionBaseSmallLongPress";
import GradientBackground from "../appwide/display/GradientBackground";
import CategoryItemsModal from "../headers/CategoryItemsModal";

const CategoryCreator = ({
  updateCategoryInParent,
  updateExistingMoment,
  existingCategory,
  onParentSave,
}) => {
  const { themeStyles, appContainerStyles } = useGlobalStyle();
  const { selectedFriend, loadingNewFriend, friendDashboardData } =
    useSelectedFriend();
  const [selectedCategory, setSelectedCategory] = useState(existingCategory); //can start out as null
  const [selectedCategoryCapsules, setSelectedCategoryCapsules] =
    useState(null);
  const { capsuleList, categoryCount, categoryNames } = useCapsuleList();
  console.log("CATEGORY CREATOR RERENDERED");
  const [modalVisible, setModalVisible] = useState(false);

  const containerHeight = `100%`;

  const [newCategoryEntered, setNewCategoryEntered] = useState(false);

  const [pressedOnce, setPressedOnce] = useState(false);

  const newCategoryRef = useRef(null);

  const [viewExistingCategories, setViewExistingCategories] = useState(true);

  const { getLargestCategory, getCategoryCap, getCreationsRemaining } =
    useTalkingPFunctions({
      listData: capsuleList,
      friendData: friendDashboardData,
      categoryCount,
    });

  const [remainingCategories, setRemainingCategories] = useState(
    getCreationsRemaining
  );

  // const [categoryLimit, setCategoryLimit] = useState(getCategoryCap);

  // for data updates after initial render
  useEffect(() => {
    if (
      capsuleList &&
      selectedFriend &&
      friendDashboardData &&
      !loadingNewFriend
    ) {
      //Needed because user can change the friend in the middle of writing the moment
      setSelectedCategory(null);
      resetNewCategoryText();

      setRemainingCategories(getCreationsRemaining());
      // setCategoryLimit(getCategoryCap());

      if (updateExistingMoment && existingCategory) {
        setSelectedCategory(existingCategory);
      } else {
        setSelectedCategory(getLargestCategory());
      }
      setViewExistingCategories(capsuleList.length > 0);
    }
  }, [capsuleList, friendDashboardData, selectedFriend, loadingNewFriend]);

  const updateNewCategoryText = (text) => {
    if (newCategoryRef && newCategoryRef.current) {
      newCategoryRef.current.setText(text);
    }
  };

  const resetNewCategoryText = () => {
    if (newCategoryRef && newCategoryRef.current) {
      newCategoryRef.current.setText(null);
    }
  };

  useEffect(() => {
    if (updateCategoryInParent) {
      if (selectedCategory === null) {
        updateCategoryInParent(null, []);
      } else {
        const category = selectedCategory;
        const capsulesForCategory = capsuleList.filter(
          (capsule) => capsule.typedCategory === category
        );
        updateCategoryInParent(category, capsulesForCategory);
      }
    }
  }, [selectedCategory]);

  const handleFilterCategory = (category) => {
    if (category) {
      setSelectedCategory(category);
      setSelectedCategoryCapsules(
        capsuleList.filter(
          (capsule) => capsule.typedCategory === selectedCategory
        )
      );
    } else {
      setSelectedCategoryCapsules([]);
      setSelectedCategory(null);
    }
  };

  const handleCategoryPress = (category) => {
    handleFilterCategory(category);
    setModalVisible(true);
  };

  const handlePressOut = (category) => {
    if (category === selectedCategory && pressedOnce) {
      handleSave();
      setPressedOnce(false);
    } else {
      handleFilterCategory(category);
      setPressedOnce(true);
    }
  };

  const handleSave = () => {
    if (selectedCategory) {
      onParentSave();
    }
  };

  const handleNewCategory = (newCategory) => {
    setSelectedCategory(newCategory);
    updateCategoryInParent(newCategory, []);
    setNewCategoryEntered(true);
  };

  useEffect(() => {
    if (newCategoryEntered) {
      onParentSave();
      setNewCategoryEntered(false);
    }
  }, [newCategoryEntered]);

  const renderCategoryButtonItem = useCallback(
    ({ item, index }) => {
      return (
        <View
          key={item}
          style={{
            width: 140,
            height: "100%",
            overflow: "hidden",
            marginRight: 3,
          }}
        >
          <ButtonBottomActionBaseSmallLongPress
            height={"80%"}
            buttonPrefix={
              updateExistingMoment && existingCategory ? "Save to" : "Add to"
            }
            onPress={() => handlePressOut(item)} // Correct way to pass the function
            onLongPress={() => handleCategoryPress(item)} // Correct way to pass the function
            label={item}
            selected={item === selectedCategory} // Pass 'item' as the label (since it represents each category)
            width={140}
            fontFamily={"Poppins-Regular"}
            shapeWidth={44}
            shapeHeight={44}
            shapePosition="right"
            shapePositionValue={0}
            shapePositionValueVertical={4}
          />
        </View>
      );
    },
    [handlePressOut, handleCategoryPress, selectedCategory]
  );

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `category-${index}`;

  return (
    <View
      style={{
        position: "absolute",
        backgroundColor: "limegreen",
        height: 38,
        width: "100%",
        zIndex: 1000,
        top: "92%",
        flex: 1,
        transform: [{ translateY: -50 }],
        // alignItems: "center",
      }}
    >
      {selectedFriend &&
        friendDashboardData &&
        categoryNames &&
        capsuleList &&
        !loadingNewFriend && (
          <>
            <View
              style={[
                appContainerStyles.categoryCreatorContainer,
                themeStyles.genericTextBackgroundShadeTwo,
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  paddingLeft: "4%",
                }}
              >
                {categoryCount > 0 && viewExistingCategories && (
                  <FlatList
                    data={categoryNames}
                    horizontal={true}
                    keyboardShouldPersistTaps="handled"
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                    keyExtractor={extractItemKey}
                    renderItem={renderCategoryButtonItem}
                    initialNumToRender={15}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews={true}
                    contentContainerStyle={{
                      justifyContent: "space-around",
                      maxHeight: containerHeight,
                      flexGrow: 0,
                    }}
                    ListFooterComponent={
                      <View style={styles.flatListEndSpace} />
                    }
                  />
                )}

                {(!viewExistingCategories || categoryCount === 0) && (
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
                      autoFocus={false}
                      onEnterPress={updateCategoryInParent}
                      onSave={handleNewCategory}
                      title={"New category: "}
                      onTextChange={updateNewCategoryText}
                    />
                  </View>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    textAlign: "left",
                    justifyContent: "center",
                    width: "10%",
                  }}
                >
                  {remainingCategories !== null && remainingCategories > 0 && (
                    <View
                      style={{
                        zIndex: 7000,
                        elevation: 7000,
                        paddingHorizontal: "2%",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        alignContent: "center",
                        alignItems: "center",

                        alignContent: "center",
                      }}
                    >
                      {!viewExistingCategories && (
                        <AddOutlineSvg
                          width={32}
                          height={32}
                          color={themeStyles.modalIconColor.color}
                          onPress={() => setViewExistingCategories(true)}
                        />
                      )}
                      {viewExistingCategories && (
                        <AddOutlineSvg
                          width={32}
                          height={32}
                          color={themeStyles.modalIconColor.color}
                          onPress={() => setViewExistingCategories(false)}
                        />
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>

            {modalVisible && (
              <View>
                <CategoryItemsModal
                  isVisible={modalVisible}
                  title={selectedCategory}
                  data={selectedCategoryCapsules}
                  closeModal={() => setModalVisible(false)}
                />
              </View>
            )}
          </>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 6000,
    elevation: 6000,
    bottom: 200,
    left: 0,
    right: 0,
    borderRadius: 2,
    height: 66,
    paddingHorizontal: 2,
    flex: 1,
    alignContent: "center",
    flexDirection: "row",
  },
  loadingWrapper: {
    flex: 1,
    paddingRight: 40,
    justifyContent: "center",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 20,
    width: "100%",
    borderBottomWidth: 0.4,
    borderBottomColor: "#fff",
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
    width: 200,
  },
});

export default CategoryCreator;
