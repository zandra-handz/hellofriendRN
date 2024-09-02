import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import AlertList from './AlertList';
import PickerSimpleAddressBase from './PickerSimpleAddressBase';
import SearchGoogleAddressFloating from '../components/SearchGoogleAddressFloating';


const SelectAddressModalVersion = ({ 
  isEditingAddress, 
  setIsEditingAddress, 
  localAddressOptions, 
  selectedAddress, 
  onAddressSelect, 
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
        <PickerSimpleAddressBase 
          selectedOption={selectedAddress ? selectedAddress.label : null}
          options={localAddressOptions.map(option => ({
            label: option.value.address,
            value: option.key
          }))}
          onValueChange={(itemValue) => {
            const newAddress = localAddressOptions.find(option => option.key === itemValue)?.value;
            onAddressSelect(newAddress);
            setIsEditingAddress(false);
          }}
        /> 
      <View style={{ flex: 1, width: '100%', backgroundColor: 'transparent' }}>
        <SearchGoogleAddressFloating 
          onAddressSelect={(address) => {
            onAddressSelect(address);
            setIsEditingAddress(false);
          }} 
        />
        </View>
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

export default SelectAddressModalVersion;
