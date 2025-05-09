import React, {   useState  } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; 
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';
 
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
  
import LoadingPage from '../appwide/spinner/LoadingPage';
import BaseModalFooter from '../scaffolding/BaseModalFooter';
import BaseRowModalFooter from '../scaffolding/BaseRowModalFooter'; 
import RowExpFriendAddAddresses from './RowExpFriendAddAddresses';

import ButtonAddFriendAddresses from '@/app/components/buttons/locations/ButtonAddFriendAddresses';
 
const ModalFriendAddresses = ({ visible, onClose }) => {
 
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend  } = useSelectedFriend();

  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  
  const [isMakingCall, setIsMakingCall] = useState(false);
 
  const secondRow = false;

  const toggleAddressModal = () => {
    setIsAddressModalVisible(true);
  };

 
 
  return (
    <BaseModalFooter
      visible={visible}
      onClose={onClose}
      isMakingCall={isMakingCall}
      LoadingComponent={LoadingPage}
      themeStyles={themeStyles}
    >
      <View style={styles.headerRow}>
        <FontAwesome5 name="wrench" size={20} style={[styles.headerIcon, themeStyles.modalIconColor]} />
        {selectedFriend?.name && (
          <Text style={[styles.modalTitle, themeStyles.modalText]}>
            Settings for {selectedFriend.name}
          </Text>
        )}
      </View> 
          <RowExpFriendAddAddresses /> 

          {secondRow && ( 
          <BaseRowModalFooter 
            iconName='palette' 
            iconSize={20}
            label='Addresses' 
            useToggle={false}
            useCustom={false}
            useAltButton={true}
            altIsSimpleText={false}
            altButtonComplete={<ButtonAddFriendAddresses/>}
            onAltButtonPress={toggleAddressModal} 
            //altButtonComplete={<ButtonResetHelloes />} 
          />  
        )}
 
    
 


    
    </BaseModalFooter>
    
  );
};

const styles = StyleSheet.create({
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 30 },
    
  headerIcon: { 
    marginRight: 10 
  },
  modalTitle: { 
    fontSize: 17, 
    fontFamily: 'Poppins-Bold' 
  },
  icon: {
    alignContent: 'center',
    paddingHorizontal: 4,
  },
 

});

export default ModalFriendAddresses;
