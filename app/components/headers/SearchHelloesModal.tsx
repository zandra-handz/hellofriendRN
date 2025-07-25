import React  from "react";
import { View,  StyleSheet } from "react-native";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
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
}) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle();
 
// useEffect(() => {
//   if (flattenHelloes) {
//     console.log('flattenhelloesin seach modal!', flattenHelloes);
//   }

// }, [flattenHelloes]); 

  const handleSearchPress = (hello) => {
    onSearchPress(hello.id);
    closeModal();
  };


  
  // React.useEffect(() => {
  //   if (isModalVisible) {
  //     AccessibilityInfo.announceForAccessibility("Information opened");
  //   }
  // }, [isModalVisible]);

  return (
    <ModalWithGoBack
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"comment-search-outline"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      questionText="Search helloes"
      children={
        < View contentContainerStyle={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            <MomentsSearchBar
              data={flattenHelloes}
              autoFocus={isVisible}
              height={40}
              width={"100%"}
              borderColor={themeStyles.primaryText.color}
              placeholderText={"Search"}
              textAndIconColor={themeStyles.primaryText.color}
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
