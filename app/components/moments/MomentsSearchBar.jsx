import React, { useState, useEffect, useRef, useCallback } from "react";
 
import {
  View,
  TextInput,
  FlatList,
  Text, 
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";

import GlobalPressable from "../appwide/button/GlobalPressable";

import SvgIcon from "@/app/styles/SvgIcons";

 
 

const MomentsSearchBar = ({
  data,
  width = "100%",
  textColor,
  backgroundColor,
  textAndIconColor = "gray",
  placeholderText = "Search",
  onPress,
  autoFocus,
  searchKeys,
  iconSize = 26,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

 const handleSelect = (item) => {

  handleItemPress(item);
 }

  const textInputRef = useRef(null);

  const INPUT_CONTAINER_BORDER_RADIUS = 10;

  const handleItemPress = (item) => {
 
    onPress(item);
    handleOutsidePress();
    setSearchQuery("");
  };

  const [triggerAutoFocus, setTriggerAutoFocus] = useState(false);

  useEffect(() => {
    if (autoFocus) {
      const timeout = setTimeout(() => {
        setTriggerAutoFocus(true); 
        if (textInputRef && textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 100); // adjust delay (in ms) as needed

      return () => clearTimeout(timeout); // cleanup if autoFocus changes early
    }
  }, [autoFocus]);

  const handleSearch = (text) => {
    setSearchQuery(text);

    const filtered = data.filter((item) => {
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

  const renderSearchResultItem = useCallback(
    ({ item, index }) => {

      
      return (
        <GlobalPressable
          onPress={() => handleSelect(item)}
          style={[
            styles.searchBarResultListItem,
            {
              borderBottomColor:
                filteredData?.length > 1 ? textColor : "transparent",
            },
          ]}
        >
          <Text numberOfLines={1} style={[{ color: textColor, fontSize: 15 }]}>
            {searchKeys.map((key) => item[key]).join(" - ")}{" "}
          </Text>
        </GlobalPressable>
      );
    },
    [handleSelect, filteredData]
  );

  return (
    <View style={[{ width: width, zIndex: 2 }]}>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        {/* <View
          style={[
            appContainerStyles.searchBarInputContainer,
            {
              backgroundColor: backgroundColor,
              height: height,
              borderColor: borderColor,
            },
          ]}
        > */}
        <View
          style={[
            styles.inputContainer,

            {
              backgroundColor: backgroundColor,
              borderRadius: INPUT_CONTAINER_BORDER_RADIUS,
              borderColor: textColor,
            },
          ]}
        >
          <TextInput
            ref={textInputRef}
            // style={appFontStyles.searchBarInputText}
            style={[styles.searchInput, { color: textColor }]}
            autoFocus={triggerAutoFocus}
            placeholder={placeholderText}
            placeholderTextColor={textAndIconColor}
            color={textAndIconColor}
            value={searchQuery}
            onChangeText={handleSearch}
            onBlur={handleBlur} // Clears when user moves away from the input
          />
          <View>
            <SvgIcon
              name={"comment_search_outline"}
              size={iconSize}
              color={textColor}
              style={{ paddingHorizontal: 10, overflow: "hidden" }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      {filteredData && filteredData.length > 0 && searchQuery.length > 0 && (
        <View
          style={[
            styles.dropdownContainer,
            { backgroundColor: backgroundColor },
          ]}
        >
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSearchResultItem}
            style={styles.listContainer}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled // Enable nested scroll for the FlatList
          />
        </View>
      )}
    </View>
  );
};

//took this from searchsavedlocations
const styles = StyleSheet.create({
  searchBarResultListItem: {
    paddingVertical: 6,
    marginVertical: 4,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    textAlign: "left",
    justifyContent: "flex-start",

    height: "auto",
    borderBottomWidth: 1,
    borderRadius: 0,
  },
  listContainer: {
    paddingHorizontal: 6,

    borderRadius: 20,
    zIndex: 1000,
  },

  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 48,
    backgroundColor: "transparent",
    // paddingLeft: "4%",
    paddingVertical: "3%",
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    textAlign: "left",
    paddingRight: 2,
    height: 48,
  },
  icon: {
    marginRight: "3%",
  },
  dropdownContainer: {
    position: "absolute",
    top: 54,
    left: 0,
    maxHeight: 300,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: "100%",
    zIndex: 2100,
    elevation: 2100,
  },
  dropdownList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1000,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
    borderRadius: 0,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default MomentsSearchBar;
