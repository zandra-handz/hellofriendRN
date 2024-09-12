import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, ScrollView } from 'react-native';
import AlertSingleInput from './AlertSingleInput'; // Import the AlertSingleInput component
import { useGlobalStyle } from '../context/GlobalStyleContext'; 


const PickerComplexList = ({
  label = 'Select Label',
  onLabelChange,
  modalHeader,
  primaryOptions = [],
  primaryOptionsHeader,
  secondaryOptions = [],
  secondaryOptionsHeader,
  objects = false,
  containerText = 'Select an option',
  containerStyle,
  buttonStyle,
  buttonTextStyle,
  includeContainer = false,
  modalVisible = false,
  setModalVisible,
  inline = false,
  primaryIcon: PrimaryIcon,
  secondaryIcon: SecondaryIcon, 
  iconSize = 34,
  allowCustomEntry = false,  
}) => {

  const { themeStyles } = useGlobalStyle();
  const [isCustomModalVisible, setCustomModalVisible] = useState(false);
  const [customValue, setCustomValue] = useState('');



  const combinedOptions = [
    { type: `${primaryOptionsHeader}`, data: primaryOptions, icon: PrimaryIcon },
    { type: `${secondaryOptionsHeader}`, data: secondaryOptions, icon: SecondaryIcon },
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
    onLabelChange('');  
    setCustomValue(''); 
    setModalVisible(false);  
  };

  const renderOptionItem = ({ item }) => {
    const Icon = combinedOptions.find(section => section.data.includes(item))?.icon || null;
    const iconColor = combinedOptions.find(section => section.data.includes(item))?.color || 'black';

    return (
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleSelectLabel(item)}
      >
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon width={iconSize} height={iconSize} color={iconColor} />
          </View>
        )}
        <View style={styles.textContainer}>
          {objects ? (
            <>
              <Text style={styles.optionTitleText}>{item.title}</Text>
              <Text style={styles.optionText}>{item.address}</Text>
            </>
          ) : (
            <Text style={styles.optionText}>{item}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
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
          <Text style={[styles.containerText, themeStyles.subHeaderText, inline && styles.inlineText]}>
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
              {allowCustomEntry && (
                <TouchableOpacity
                  style={styles.customEntryButton}
                  onPress={() => setCustomModalVisible(true)}
                >
                  <Text style={styles.customEntryText}>Manual entry?</Text>
                </TouchableOpacity>
              )}
              
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
              </ScrollView>
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
    padding: 8,
    alignItems: 'center',
    flex: 1,
  },
  inlineButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
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
    maxHeight: '80%',
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
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 10,
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
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
  clearButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 20,
  },
  footerButton: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  customEntryButton: {
    marginVertical: 10,
  },
  customEntryText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'blue',
  },
});

export default PickerComplexList;
