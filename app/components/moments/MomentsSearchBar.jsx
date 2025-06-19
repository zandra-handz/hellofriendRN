import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import SearchBigMagSvg from "@/app/assets/svgs/search-big-mag.svg";

const MomentsSearchBar = ({
  data,
  height = "100%",
  width = "100%",
  backgroundColor,
  textAndIconColor = "gray",
  placeholderText = "Search",
  borderColor = "#ccc",
  onPress,
  autoFocus,
  searchKeys,
  iconSize = 26,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();

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
        console.log("autofocus triggered");
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
    ({item, index}) => {
      return (
                    <TouchableOpacity
                onPress={() => handleItemPress(item)}
                style={[
                  appContainerStyles.searchBarResultListItem,
                  {
                    borderBottomColor:
                      filteredData?.length > 1
                        ? themeStyles.genericText.color
                        : "transparent",
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    appFontStyles.searchBarResultListItemText,
                    themeStyles.genericText,
                  ]}
                >
                  {searchKeys.map((key) => item[key]).join(" - ")}{" "}
                </Text>
              </TouchableOpacity>
      )

    }, [handleItemPress, filteredData]
  )

  return (
    <View style={[appContainerStyles.searchBarContainer, { width: width }]}>
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
         <View style={[styles.inputContainer, themeStyles.genericTextBackground, { borderRadius: INPUT_CONTAINER_BORDER_RADIUS, borderColor: themeStyles.primaryText.color}]}>
                 
          <TextInput
            ref={textInputRef}
            // style={appFontStyles.searchBarInputText}
             style={[styles.searchInput, themeStyles.genericText]}
            autoFocus={triggerAutoFocus}
            placeholder={placeholderText}
            placeholderTextColor={textAndIconColor}
            color={textAndIconColor}
            value={searchQuery}
            onChangeText={handleSearch}
            onBlur={handleBlur} // Clears when user moves away from the input
          />
          <View>
            <SearchBigMagSvg
              height={iconSize}
              width={iconSize}
              color={textAndIconColor}
              style={{ paddingHorizontal: 10, overflow: "hidden" }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      {filteredData && filteredData.length > 0 && searchQuery.length > 0 && (
        // <View
        //   style={[
        //     appContainerStyles.searchBarDropDownContainer,
        //     themeStyles.genericTextBackground,
        //     { width: width, top: height },
        //   ]}
        // >
           <View style={[styles.dropdownContainer, themeStyles.genericTextBackground]}>
                  
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSearchResultItem}
            style={appContainerStyles.searchBarResultsListContainer}
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
