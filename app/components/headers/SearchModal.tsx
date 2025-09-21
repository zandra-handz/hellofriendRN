import React from "react";
import { View, StyleSheet } from "react-native";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import MomentsSearchBar from "../moments/MomentsSearchBar";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  onSearchPress: () => void;
}

// ICON IS HARD CODED
const SearchModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  onSearchPress,

  textColor,
  primaryBackgroundColor,
}) => {
  const { capsuleList } = useCapsuleList();

  const handleSearchPress = (moment) => {
    onSearchPress(moment);
    closeModal();
  };

  return (
    <ModalWithGoBack
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"comment-search-outline"}
          size={30}
          color={textColor}
        />
      }
      questionText="Search talking points"
      children={
        <View style={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            <MomentsSearchBar
              textColor={textColor}
              backgroundColor={primaryBackgroundColor}
              data={capsuleList}
              autoFocus={isVisible}
              height={40}
              width={"100%"}
              borderColor={textColor}
              placeholderText={"Search"}
              textAndIconColor={textColor}
              onPress={handleSearchPress}
              searchKeys={["capsule", "user_category_name"]}
              iconSize={1}
            />
          </View>
        </View>
      }
      onClose={closeModal}
    />
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  headerContainer: {
    margin: "2%",
  },
  sectionContainer: {
    height: 100,
    width: "100%",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 30,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
});

export default SearchModal;
