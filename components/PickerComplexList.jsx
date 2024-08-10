import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, ScrollView } from 'react-native';

const PickerComplexList = ({
  label = 'Select Label',
  onLabelChange,
  modalHeader,
  primaryOptions = [], // First set of options
  primaryOptionsHeader,
  secondaryOptions = [], // Second set of options
  secondaryOptionsHeader,
  objects = false, // Prop to determine if options are objects
  containerText = 'Select an option',
  containerStyle,
  buttonStyle,
  buttonTextStyle,
  includeContainer = false,
  modalVisible = false,
  setModalVisible,
  inline = false,
}) => {
  // Combine both lists into one for rendering
  const combinedOptions = [
    { type: `${primaryOptionsHeader}`, data: primaryOptions },
    { type: `${secondaryOptionsHeader}`, data: secondaryOptions },
  ];

  // Handler for selecting a label
  const handleSelectLabel = (selectedItem) => {
    onLabelChange(selectedItem);
    setModalVisible(false);
  };

  // Render option item based on whether options are objects
  const renderOptionItem = ({ item }) => {
    if (objects) {
      // If options are objects, use item.label for display
      return (
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleSelectLabel(item)}
        >
        <Text style={styles.optionTitleText}>{item.title
            }</Text>
          <Text style={styles.optionText}>{item.address
            }</Text>
        </TouchableOpacity>
      );
    } else {
      // If options are strings, use item for display
      return (
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleSelectLabel(item)}
        >
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View
      style={[
        includeContainer ? [styles.container, containerStyle] : undefined,
        inline && styles.inlineContainer,
      ]}
    >
      <View style={[styles.content, inline && styles.inlineContent]}>
        {inline && (
          <Text style={[styles.containerText, inline && styles.inlineText]}>
            {containerText}
          </Text>
        )}
        <TouchableOpacity
          style={[styles.button, buttonStyle, inline && styles.inlineButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.buttonText, buttonTextStyle]}>
            {label}
          </Text>
        </TouchableOpacity>
      </View>

      {modalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{modalHeader}</Text>
              <ScrollView style={styles.scrollView}>
                {combinedOptions.map((section) => (
                  <View key={section.type} style={styles.section}>
                    <Text style={styles.sectionTitle}>{section.type}</Text>
                    <FlatList
                      data={section.data}
                      keyExtractor={(item) => (objects ? item.id.toString() : item)}
                      renderItem={renderOptionItem}
                    />
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  inlineContent: {
    flex: 1,
  },
  containerText: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    marginRight: 10,
  },
  inlineText: {},
  button: {
    borderRadius: 20,
    backgroundColor: 'gray',
    padding: 10,
    alignItems: 'center',
    flex: 1,
  },
  inlineButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%', // Prevent modal content from exceeding the screen height
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
  },
  section: {
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    alignItems: 'flex-start',
  },
  optionTitleText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  optionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
});

export default PickerComplexList;
