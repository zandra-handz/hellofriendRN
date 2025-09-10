import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import HalfScreenModal from "../alerts/HalfScreenModal";
import AlertSingleInput from "../alerts/AlertSingleInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AddCustomLocation from "./AddCustomLocation";
import CarouselItemModal from "../appwide/carouselItemModal";
import LocationItemsModal from "./LocationItemsModal";
const PickerComplexList = ({
  primaryColor,
  backgroundColor = "red",
  onLabelChange,
  modalHeader,
  primaryOptions = [],
  primaryOptionsHeader,
  secondaryOptions = [],
  secondaryOptionsHeader,
  objects = false,
  modalVisible = false,
  setModalVisible,
  primaryIcon: PrimaryIcon,
  secondaryIcon: SecondaryIcon,
  iconSize = 22,
  allowCustomEntry = false,
}) => {
  const [isCustomModalVisible, setCustomModalVisible] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const combinedOptions = [
    {
      type: `${primaryOptionsHeader}`,
      data: primaryOptions,
      icon: PrimaryIcon,
    },
    {
      type: `${secondaryOptionsHeader}`,
      data: secondaryOptions,
      icon: SecondaryIcon,
    },
  ];

  const handleSelectLabel = (selectedItem) => {
    onLabelChange(selectedItem);
    setModalVisible(false);
  };

  const handleCustomEntry = (value) => {
    setCustomValue(value);
    onLabelChange(value);
    // setCustomModalVisible(false);
    setModalVisible(false);
  };

  const handleClear = () => {
    onLabelChange("");
    setCustomValue("");
    setModalVisible(false);
  };

  const renderOptionItem = ({ item }) => {
    const Icon =
      combinedOptions.find((section) => section.data.includes(item))?.icon ||
      null;

    return (
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleSelectLabel(item)}
      >
        <View style={{flexDirection: 'row'}}>


        {Icon && (
          <View style={styles.iconContainer}>
            <Icon width={iconSize} height={iconSize} color={primaryColor} />
          </View>
        )}
        <View style={styles.textContainer}>
          {objects ? (
            <>
              <Text style={[styles.optionTitleText, { color: primaryColor }]}>
                {item.title}
              </Text>
              <Text style={[styles.optionText, { color: primaryColor }]}>
                {item.address}
              </Text>
            </>
          ) : (
            <Text style={styles.optionText}>{item}</Text>
          )}
          </View>
        </View>
        <View style={[styles.divider, {backgroundColor: primaryColor}]}>

        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = ({ item }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: primaryColor }]}>
        {item.type}
      </Text>
      <FlatList
        data={item.data}
        keyExtractor={(item) => (objects ? item.id.toString() : item)}
        renderItem={renderOptionItem}
      />
    </View>
  );

  return (
    // <Modal
    <LocationItemsModal
      isVisible={modalVisible}
      primaryColor={primaryColor}
      questionText="Select location"
      backgroundColor={backgroundColor}
      headerIcon={
        <MaterialCommunityIcons
          name={"storefront-outline"}
          size={30}
          color={primaryColor}
        />
      }
      questionText={"Pick location"}
      // transparent={true}
      // animationType="slide"
      // visible={modalVisible}
      closeModal={() => setModalVisible(false)}
      children={
        <View style={[styles.modalContent]}>
          <AddCustomLocation primaryColor={primaryColor} primaryBackground={backgroundColor} onSubmit={handleCustomEntry} />
 
          {/* {allowCustomEntry && (
            <TouchableOpacity
              style={styles.customEntryButton}
              onPress={() => setCustomModalVisible(true)}
            >
              <Text style={styles.customEntryText}>Manual entry?</Text>
            </TouchableOpacity>
          )} */}

          <FlatList
            style={styles.scrollView}
            data={combinedOptions}
            keyExtractor={(item) => item.type}
            renderItem={renderSection}
          />

          {/* {allowCustomEntry && customValue && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Custom Entry</Text>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleSelectLabel(customValue)}
              >
                <Text style={styles.optionText}>{customValue}</Text>
              </TouchableOpacity>
            </View>
          )} */}

          {/* <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.closeButton, styles.footerButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.clearButton, styles.footerButton]}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      }
    ></LocationItemsModal>
  );
};

{
  // allowCustomEntry && (
  //   <AlertSingleInput
  //     isModalVisible={isCustomModalVisible}
  //     toggleModal={() => setCustomModalVisible(false)}
  //     headerContent={<Text>Add Custom Entry</Text>}
  //     questionText="Enter your custom value:"
  //     onConfirm={handleCustomEntry}
  //     onCancel={() => setCustomModalVisible(false)}
  //     confirmText="Add"
  //     cancelText="Cancel"
  //   />
  // );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    //flex: 1,
    borderRadius: 10,
    //margin: "4%",
    alignSelf: "center",
    //padding: 20,
    height: "auto",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  containerText: {
    fontSize: 17,
    height: "100%",
    fontFamily: "Poppins-Bold",
  },
  inlineText: {},
  button: {
    borderRadius: 30,
    alignSelf: "center",
    padding: 0,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    //height: '100%',
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  buttonInner: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 15,
    justifyContent: "flex-start",
    width: "100%",
    //fontFamily: "Poppins-Regular",
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "orange",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    minHeight: 400,
    // flex: 1,
    // maxHeight: "80%",
    borderRadius: 8,
    // padding: 20,
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
    // flex: 1,
    minWidth: 350,
    // flexDirection: 'row',
    //flexGrow: 1,
    // backgroundColor: 'pink',
  },
  section: {
    marginBottom: 20,
    width: "100%",
  },
  modalFooter: {
    flexDirection: "row",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
  },
  divider: {
    width: '100%',
    height: .4,
    opacity: .5,
   // borderBottomWidth: StyleSheet.hairlineWidth,

  },
  optionButton: {
    padding: 10,
 
    
    width: "100%",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  iconContainer: {
    marginRight: 10,
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  optionTitleText: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },
  optionText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 20,
  },
  clearButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 20,
  },
  footerButton: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  customEntryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "lightblue",
    borderRadius: 20,
  },
  customEntryText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
  },
});

export default PickerComplexList;
