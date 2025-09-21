import { View, Text } from "react-native";
import React, { useState, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalPressable from "../appwide/button/GlobalPressable";
import SearchModal from "../headers/SearchModal";

type Props = {
  onSearchPress: () => void;
  primaryColor: string;
  backgroundColor: string;
};

const MomentSearcher = ({
  onSearchPress,
  primaryColor = "orange",
  backgroundColor = "red",
}: Props) => {
  const [searcherVisible, setSearcherVisible] = useState(false);

  const handleOpenSearcher = () => {
    setSearcherVisible(true);
  };

  const handleCloseSearcher = () => {
    setSearcherVisible(false);
  };

  return (
    <>
      <GlobalPressable
        onPress={handleOpenSearcher}
        style={{ width: 40, height: 40, backgroundColor: "red" }}
      >
        <MaterialCommunityIcons
          name={"text-search"}
          size={26}
          color={primaryColor}
          style={{}}
        />
      </GlobalPressable>
      {searcherVisible && (
        <SearchModal
          isVisible={searcherVisible}
          textColor={primaryColor}
          primaryBackgroundColor={backgroundColor}
          onSearchPress={onSearchPress}
          closeModal={handleCloseSearcher}
        />
      )}
    </>
  );
};

export default MomentSearcher;
