import React  from "react";
import { View,  StyleSheet } from "react-native";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import MomentsSearchBar from "../moments/MomentsSearchBar";
 

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  onSearchPress: () => void;
  flattenHelloes: object[];
}

const SearchHelloesModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  onSearchPress,
  flattenHelloes,
  primaryColor='orange',
}) => { 
 
 
  const handleSearchPress = (hello) => {
    onSearchPress(hello.id);
    closeModal();
  };
 

  return (
    <ModalWithGoBack
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"comment-search-outline"}
          size={30}
          color={primaryColor}
        />
      }
      questionText="Search helloes"
      children={
        < View style={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            <MomentsSearchBar
              data={flattenHelloes}
              autoFocus={isVisible}
              height={40}
              width={"100%"}
              borderColor={primaryColor}
              placeholderText={"Search"}
              textAndIconColor={primaryColor}
              backgroundColor={"transparent"}
              onPress={handleSearchPress}
               searchKeys={["capsule", "additionalNotes", "date", "location"]}
              iconSize={0}
            />
          </View>
        </ View>
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
    width: '100%',
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

export default SearchHelloesModal;
