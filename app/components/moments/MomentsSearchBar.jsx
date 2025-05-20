import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
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
  searchKeys,
  iconSize = 26,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();

  const handleItemPress = (item) => {
    onPress(item);
    handleOutsidePress();
    setSearchQuery("");
  };

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

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={[appContainerStyles.searchBarContainer, { width: width }]}>
        <View
          style={[
            appContainerStyles.searchBarInputContainer,
            {
              backgroundColor: backgroundColor,
              height: height,
              borderColor: borderColor,
            },
          ]}
        >
          <TextInput
            style={appFontStyles.searchBarInputText}
            placeholder={placeholderText}
            placeholderTextColor={textAndIconColor}
            color={textAndIconColor}
            value={searchQuery}
            onChangeText={handleSearch}
            onBlur={handleBlur} // Clear when the user moves away from the input
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

        {filteredData && filteredData.length > 0 && searchQuery.length > 0 && (
          <View
            style={[
              appContainerStyles.searchBarDropDownContainer,
              themeStyles.genericTextBackground,
            ]}
          >
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
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
              )}
              style={appContainerStyles.searchBarResultsListContainer}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled // Enable nested scroll for the FlatList
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MomentsSearchBar;
