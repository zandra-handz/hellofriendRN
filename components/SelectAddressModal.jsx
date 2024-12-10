import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import AlertList from './AlertList';
import PickerSimpleAddressBase from './PickerSimpleAddressBase';
import SearchGoogleAddressFloating from '../components/SearchGoogleAddressFloating';


const SelectAddressModal = ({ 
  isEditingAddress, 
  setIsEditingAddress, 
  localAddressOptions, 
  selectedAddress, 
  onAddressSelect, 
  content,
  setShowAddressOptions 
}) => {
  return (
    <AlertList
      fixedHeight={true}
      height={700}
      isModalVisible={isEditingAddress} 
      useSpinner={false}
      toggleModal={() => setIsEditingAddress(false)}
      headerContent={<Text style={styles.headerText}>Select address</Text>}
      content={
        <>
        {content}
        </>
      }
      onCancel={() => setShowAddressOptions(false)}
      confirmText="Reset All"
      cancelText="Back"
    />
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
});

export default SelectAddressModal;
