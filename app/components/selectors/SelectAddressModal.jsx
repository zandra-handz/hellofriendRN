import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AlertList from '../alerts/AlertList'; 
import LocationOutlineSvg from '@/app/assets/svgs/location-outline.svg';


const SelectAddressModal = ({ 
  isEditingAddress, 
  setIsEditingAddress, 
  currentlySelected, 
  content,
  setShowAddressOptions 
}) => {
  return (
    <AlertList
      fixedHeight={true}
      height={700}
      isModalVisible={isEditingAddress} 
      useSpinner={false}
      questionText={'Select starting address'}
      includeSearch={false}
      includeBottomButtons={false}
      headerContent={<LocationOutlineSvg height={42} width={42} color={'white'}/>}
      toggleModal={() => setIsEditingAddress(false)}
     content={
        <View style={{flexDirection: 'column', position: 'absolute',width: '100%', backgroundColor: 'red', height: '100%', justifyContent: 'flex-start'}}>
        {content}
        </View>
      }
      onCancel={() => setIsEditingAddress(false)}
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
