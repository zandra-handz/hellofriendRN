import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import SearchBigMagSvg from "@/app/assets/svgs/search-big-mag.svg";

const ImagesSearchBar = ({
  data,
  formattedData, 
  originalData, 
  height = 48,
  width = "100%", 
  backgroundColor,
  textAndIconColor = "gray", 
  placeholderText = "Search",
  borderColor = "#ccc",
  onPress,
  searchKeys,
}) => { 
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { themeStyles } = useGlobalStyle();

  const handleItemPress = (item) => {
    console.log(findOriginalItem(item));

    onPress(findOriginalItem(item));  
    handleOutsidePress();
    setSearchQuery("");
  };

  const findOriginalItem = (formattedItem) => {
    return originalData.find(item => item.id === formattedItem.id);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);

    const filtered = formattedData.filter((item) => {
      const searchText = text.toLowerCase();

      return searchKeys.some((key) => {
        const itemValue = item[key];

        if (typeof itemValue === "string") {
          return itemValue.toLowerCase().includes(searchText);
        }

        return false;
      });
    });

    setFilteredData(filtered);
  };

  const handleBlur = () => { 
    setSearchQuery("");
    setFilteredData([]); 
  };

  const handleOutsidePress = () => { 
    Keyboard.dismiss();
    handleBlur(); 
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={[styles.container, { width: width }]}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: backgroundColor,
              height: height,
              borderColor: borderColor,
            },
          ]}
        >
          <TextInput
            style={[styles.searchInput, themeStyles.genericText]}
            placeholder={placeholderText}
            placeholderTextColor={textAndIconColor}
            color={textAndIconColor}
            value={searchQuery}
            onChangeText={handleSearch}
            onBlur={handleBlur} // Clear when the user moves away from the input
          />
          <View>
            <SearchBigMagSvg
              height={26}
              width={26}
              color={textAndIconColor}
              style={styles.icon}
            />
          </View>
        </View>

        {searchQuery.length > 0 && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleItemPress(item)}
                  style={styles.itemContainer}
                >
                  <Text numberOfLines={1} style={styles.itemText}>
                    {searchKeys.map((key) => item[key]).join(" - ")}{" "}
                    {/* Display all matching fields */}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.dropdownList}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled // Enable nested scroll for the FlatList
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    //width: '100%',
    // flex: 1,
     

    zIndex: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    height: "100%",
    borderRadius: 20,
    //height: 30,
  },
  searchInput: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    fontSize: 16,
    textAlign: "right",
    overflow: "hidden",
    paddingHorizontal: "5%",
    marginRight: 6,
    height: 50,
    fontFamily: "Poppins-Regular",
  },
  icon: {
    paddingHorizontal: 10,
    overflow: "hidden",
  },
  dropdownContainer: {
    position: "absolute",
    top: 30,  
    right: -10,
    backgroundColor: "#fff",
    maxHeight: 100,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5, 
    width: Dimensions.get("screen").width - 200,
    zIndex: 1000,
    elevation: 1000,
  },
  dropdownList: {
    paddingHorizontal: '4%',
    borderRadius: 20,
    zIndex: 1000,
  },
  itemContainer: {
    paddingVertical: '2%',
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
    borderRadius: 26,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default ImagesSearchBar;
