import React from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
 
import AddCustomLocation from "./AddCustomLocation";
import LocationItemsModal from "./LocationItemsModal";
import SvgIcon from "@/app/styles/SvgIcons";

const PickerComplexList = ({
  primaryColor,
  backgroundColor = "red",
  onLabelChange,

  primaryOptions = [],
  primaryOptionsHeader,
  secondaryOptions = [],
  secondaryOptionsHeader,
  objects = false,
  modalVisible = false,
  setModalVisible,
  primaryIcon: PrimaryIcon,
  secondaryIcon: SecondaryIcon,
}) => { 

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
 
    onLabelChange(value); 
    setModalVisible(false);
  };

  const handleClear = () => {
    onLabelChange(""); 
    setModalVisible(false);
  };

  const renderOptionItem = ({ item }) => {
    const Icon =
      combinedOptions.find((section) => section.data.includes(item))?.icon ||
      null;

    return (
      <Pressable
        style={styles.optionButton}
        onPress={() => handleSelectLabel(item)}
      >
        <View style={{ flexDirection: "row", width: '100%' }}>
          {Icon && <View style={styles.iconContainer}>{Icon}</View>}
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
        <View
          style={[styles.divider, { marginTop: 10, backgroundColor: primaryColor }]}
        ></View>
      </Pressable>
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
    <LocationItemsModal
      isVisible={modalVisible}
      primaryColor={primaryColor}
      questionText="Select location"
      backgroundColor={backgroundColor}
      headerIcon={
        <SvgIcon
          name={"map_marker"}
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
          <AddCustomLocation
            primaryColor={primaryColor}
            primaryBackground={backgroundColor}
            onSubmit={handleCustomEntry}
          /> 

          <FlatList
            style={styles.scrollView}
            data={combinedOptions}
            keyExtractor={(item) => item.type}
            renderItem={renderSection}
          />

 
        </View>
      }
    ></LocationItemsModal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    //flex: 1,
    borderRadius: 10, 
    alignSelf: "center",
    //padding: 20,
    height: "auto",
  },   
  modalContent: {
    width: "100%",
    height: "100%",
    minHeight: 400, 
    borderRadius: 8, 
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
 
    minWidth: 350, 
  },
  section: {
    marginTop: 20,
    width: "100%",
  }, 
  sectionTitle: {
    fontSize: 14, 
    fontWeight: 'bold',
    marginBottom: 0,
  },
 
  divider: {
    width: "100%",
    height: 0.4,
    opacity: 0.5, 
  },
  optionButton: {
    paddingVertical: 0,
    marginVertical: 2,
    paddingVertical: 6,  
    width: "100%",
    alignItems: "flex-start",
    flexDirection: "column",
 
  
  },
  iconContainer: {
    marginRight: 10,
    paddingTop: 4,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  
  },
  textContainer: {
    flex: 1,
    textAlignVertical: 'top',
 
  },
  optionTitleText: {
    fontSize: 15, 
    lineHeight: 22,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 14,
    lineHeight: 20, 
    opacity: .7,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 20,
  },   
});

export default PickerComplexList;
