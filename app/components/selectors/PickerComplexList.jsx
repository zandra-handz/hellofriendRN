import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";

import AlertSingleInput from "../alerts/AlertSingleInput"; 

const PickerComplexList = ({
  primaryColor,
  label = "Select Label",
  title = "title here",
  onLabelChange,
  modalHeader,
  primaryOptions = [],
  primaryOptionsHeader,
  secondaryOptions = [],
  secondaryOptionsHeader,
  objects = false,
  containerText = "Select an option",
  buttonRadius = 20,
  modalVisible = false,
  setModalVisible,
  inline = false,
  noBackground = false,
  primaryIcon: PrimaryIcon,
  secondaryIcon: SecondaryIcon,
  iconSize = 34,
  allowCustomEntry = false,
  buttonHeight = "auto",
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
    setCustomModalVisible(false);
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
    const iconColor =
      combinedOptions.find((section) => section.data.includes(item))?.color ||
      "black";

    return (
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleSelectLabel(item)}
      >
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon
              width={iconSize}
              height={iconSize}
              color={primaryColor}
            />
          </View>
        )}
        <View style={styles.textContainer}>
          {objects ? (
            <>
              <Text style={[styles.optionTitleText, {color: primaryColor}]}>
                {item.title}
              </Text>
              <Text style={[styles.optionText, {color: primaryColor}]}>
                {item.address}
              </Text>
            </>
          ) : (
            <Text style={styles.optionText}>{item}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = ({ item }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {color: primaryColor}]}>
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
    <View style={[styles.container ]}>
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "auto",
        }}
      >
        <Text style={[styles.title, themeStyles.genericText]}>{title}</Text>
      </View> */}
      <TouchableOpacity
        style={[styles.button ]}
        onPress={() => setModalVisible(true)}
      >
        <>
          <View style={{ alignContent: "center", paddingRight: 10 }}>
            {containerText}
          </View>
          <Text
            style={[styles.buttonText, {color: primaryColor}]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {label}
          </Text>
        </>
      </TouchableOpacity>

      {modalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={[styles.modalContainer]}>
            <View
              style={[
                styles.modalContent,
            
              ]}
            >
              <Text style={[styles.modalTitle, {color: primaryColor}]}>
                {modalHeader}
              </Text>
              {allowCustomEntry && (
                <TouchableOpacity
                  style={styles.customEntryButton}
                  onPress={() => setCustomModalVisible(true)}
                >
                  <Text style={styles.customEntryText}>Manual entry?</Text>
                </TouchableOpacity>
              )}

              <FlatList
                style={styles.scrollView}
                data={combinedOptions}
                keyExtractor={(item) => item.type}
                renderItem={renderSection}
              />

              {allowCustomEntry && customValue && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Custom Entry</Text>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => handleSelectLabel(customValue)}
                  >
                    <Text style={styles.optionText}>{customValue}</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.modalFooter}>
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
              </View>
            </View>
          </View>
        </Modal>
      )}

      {allowCustomEntry && (
        <AlertSingleInput
          isModalVisible={isCustomModalVisible}
          toggleModal={() => setCustomModalVisible(false)}
          headerContent={<Text>Add Custom Entry</Text>}
          questionText="Enter your custom value:"
          onConfirm={handleCustomEntry}
          onCancel={() => setCustomModalVisible(false)}
          confirmText="Add"
          cancelText="Cancel"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    //flex: 1,
    borderRadius: 10,
    //margin: "4%",
    alignSelf: "center",
    //padding: 20,
    height: 'auto',
  },
  inlineContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  inlineContent: {
    flex: 1,
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
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
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    alignItems: "flex-start",
    flexDirection: "row",
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
