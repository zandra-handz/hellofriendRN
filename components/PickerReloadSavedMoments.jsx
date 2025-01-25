import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  FlatList,
  Dimensions, 
} from "react-native";
import { CheckBox } from "react-native-elements";
import { useGlobalStyle } from "../context/GlobalStyleContext"; 
import { useSelectedFriend } from "../context/SelectedFriendContext";
import { useFriendList } from "../context/FriendListContext";
import MomentAdded from "../components/MomentAdded";
import ModalSelectMoments from "../components/ModalSelectMoments";
import AddOutlineSvg from "../assets/svgs/add-outline.svg";

const PickerReloadSavedMoments = ({
  onMomentSelect,
  savedMoments,
  containerText = "RELOAD MOMENTS",
  showAllCategories = true,
  showInModal = true,
}) => {
  const width = '100%';
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedMoments, setSelectedMoments] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [categoryLimit, setCategoryLimit] = useState("");
  const [remainingCategories, setRemainingCategories] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectionPercentage, setSelectionPercentage] = useState(0); // State for selection percentage

  const [isMomentSelectModalVisible, setIsMomentSelectModalVisible] =
    useState(false);
  const { selectedFriend, loadingNewFriend, friendDashboardData } =
    useSelectedFriend(); 

  const useScrollingCategorySelector = false;

  const closeMomentSelectModal = () => setIsMomentSelectModalVisible(false);

  const toggleMomentSelectModal = () => setIsMomentSelectModalVisible(true);

  const oneFifthWidth = width / 7;
  const oneFourthWidth = width / 4; 

  useEffect(() => {
    if (savedMoments.length > 0) {
      const totalCount = savedMoments.length;
      const selectedCount = selectedMoments.length;
      const percentage = calculatePercentage(selectedCount, totalCount);
      setSelectionPercentage(percentage);
    }
    if (selectedFriend) {
      setSelectedCategory(null);
      fetchCategoryLimitData();
    }
  }, [selectedFriend, friendDashboardData, savedMoments]);

  // Use effect to set moments when preAddedTracker updates
//   useEffect(() => {
//     const initialSelectedMoments = savedMoments.filter((capsule) =>
//       preAdded.includes(capsule.id)
//     );
//     setSelectedMoments(initialSelectedMoments);
//   }, [savedMoments]);

  const fetchCategoryLimitData = async () => {
    try {
      if (friendDashboardData && friendDashboardData.length > 0) {
        const firstFriendData = friendDashboardData[0];
        const categoryLimitResponse =
          firstFriendData.suggestion_settings.category_limit_formula;
        const categoryActivationsLeft =
          firstFriendData.category_activations_left;
        const categoryLimitValue = parseInt(categoryLimitResponse);
        setCategoryLimit(categoryLimitValue);
        setRemainingCategories(categoryActivationsLeft);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  useEffect(() => {
    const uniqueCategories = [
      ...new Set(savedMoments.map((capsule) => capsule.typed_category)),
    ];
    setCategories(uniqueCategories);
  }, [savedMoments]);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    const items = savedMoments.filter(
      (capsule) => capsule.typed_category === category
    );
    setCategoryItems(items);
    if (showInModal) {
      setModalVisible(true);
    }
  };

  const handleCategoryPressInModal = (category) => {
    setSelectedCategory(category);
    const items = savedMoments.filter(
      (capsule) => capsule.typed_category === category
    );
    setCategoryItems(items);
  };

  const handleCheckboxChange = (item) => {
    setSelectedMoments((prevSelectedMoments) => {
      const isItemSelected = prevSelectedMoments.includes(item);
      const updatedSelection = isItemSelected
        ? prevSelectedMoments.filter((selectedItem) => selectedItem !== item)
        : [...prevSelectedMoments, item];

      return updatedSelection;
    });
  };

  const calculatePercentage = (selectedCount, totalCount) => {
    return totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0;
  };

  useEffect(() => {
    if (onMomentSelect) {
      onMomentSelect(selectedMoments);
    }
  }, [selectedMoments]);

  useEffect(() => {
    if (loadingNewFriend) {
      setSelectedMoments([]);
    }
  }, [loadingNewFriend]);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 5);

  return (
    <View style={[styles.container, themeStyles.genericTextBackgroundShadeTwo]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "auto",
        }}
      >
        <Text style={[styles.title, themeStyles.subHeaderText]}>
          {containerText} ({selectedMoments.length}/{savedMoments.length})
        </Text>

        {!useScrollingCategorySelector && (
          <TouchableOpacity onPress={toggleMomentSelectModal}>
            <View
              style={{
                paddingLeft: 6,
                alignItems: "center",
                paddingBottom: 5,
                alignContent: "center",
              }}
            >
              <AddOutlineSvg
                height={30}
                width={30}
                color={themeStyles.modalIconColor.color}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {useScrollingCategorySelector && (
        <View style={styles.selectionContainer}>
          <Text style={[styles.modalTitle, themeStyles.genericText]}>add:</Text>
          <FlatList
            data={visibleCategories}
            horizontal={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryButton]}
                onPress={() => handleCategoryPress(item)}
              >
                <Text
                  style={[styles.categoryButtonText, themeStyles.genericText]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
      {selectedMoments.length > 0 && selectedMoments.length <= 10 && (
        <View style={[styles.momentsContainer, { width: "100%", height: 'auto' }]}>
          {selectedMoments.map((momentItem, index) => (
            <View style={[styles.momentsContainer, { width: oneFifthWidth, height: 40, margin: 4 }]}> 
                <MomentAdded
                  moment={momentItem}
                  iconSize={26}
                  size={14}
                  color={"black"}
                  disabled={true}
                  sameStyleForDisabled={true}
                />
              </View> 
          ))}
        </View>
      )}

      {selectedMoments.length > 10 && (
        <View style={[styles.momentsContainerFlatList, { width: "100%" }]}>
          <FlatList
            data={selectedMoments}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ width: oneFourthWidth, height: 50 }}>
                <MomentAdded
                  moment={item}
                  iconSize={26}
                  size={14}
                  color={"black"}
                  disabled={true}
                  sameStyleForDisabled={true}
                />
              </View>
            )}
            ListEmptyComponent={() => <Text style={styles.noItemsText}></Text>}
          />
        </View>
      )}

      {showInModal && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedCategory}</Text>
              <FlatList
                data={categoryItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={selectedMoments.includes(item)}
                      onPress={() => handleCheckboxChange(item)}
                      containerStyle={{ margin: 0, padding: 0 }}
                    />
                    <Text style={styles.itemText}>{item.capsule}</Text>
                  </View>
                )}
              />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
      <ModalSelectMoments
        isVisible={isMomentSelectModalVisible}
        formBody={
          <>
            <View style={styles.selectionContainer}>
              <Text style={[styles.modalTtitle, themeStyles.genericText]}>
                add:
              </Text>
              <FlatList
                data={visibleCategories}
                horizontal={true}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryButton}
                    onPress={() => handleCategoryPressInModal(item)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        themeStyles.genericText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={styles.selectMomentListContainer}>
              <View style={styles.momentModalContainer}>
                <Text
                  style={[styles.momentModalTitle, themeStyles.subHeaderText]}
                >
                  {selectedCategory}
                </Text>

                <FlatList
                  data={categoryItems}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.momentCheckboxContainer}>
                      <View style={styles.momentItemTextContainer}>
                        <View style={{ height: "100%" }}>
                          <CheckBox
                            checked={selectedMoments.includes(item)}
                            onPress={() => handleCheckboxChange(item)}
                            containerStyle={{ margin: 0, padding: 0 }}
                            checkedColor={themeAheadOfLoading.darkColor} // Change this to your desired checked color
                            uncheckedColor={themeAheadOfLoading.lightColor}
                          />
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
          </>
        }
        close={closeMomentSelectModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    //flex: 1,
    height: "auto",
    borderRadius: 30, 
    alignSelf: "center",
    padding: 20,
    overflow: "hidden",

    //backgroundColor: 'red',
  },
  contentContainer: {},
  momentsContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  momentsContainerFlatList: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  modalTitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 2,
  },
  selectedItemsContainer: {
    marginBottom: 10,
    //height: 200,
    padding: 10,
    borderWidth: 0,
    borderRadius: 10,
    borderColor: "dimgray",
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  noItemsText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "gray",
  },
  selectionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectMomentListContainer: {
    height: "92%",
    width: "100%",
    borderRadius: 20,
    borderTopRightWidth: 0.6,
    borderColor: "darkgray",
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    margin: 5,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
  },
  momentModalContainer: {
    width: "100%",
    borderRadius: 10,
    padding: 0,
    alignItems: "center",
  },
  momentModalTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginBottom: 6,
  },
  momentCheckboxContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 0,
    padding: 0,
    marginLeft: -10,
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
  momentItemText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginLeft: 0,
    width: "100%",
  },
});

export default PickerReloadSavedMoments;
