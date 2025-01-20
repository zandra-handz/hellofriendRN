import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ButtonResetHelloes from '../components/ButtonResetHelloes';
import { useNavigation } from '@react-navigation/native';
 
import BaseModalFooterSection from '../components/BaseModalFooterSection';
import LoadingPage from '../components/LoadingPage';


import { useGlobalStyle } from '../context/GlobalStyleContext';

const SectionAccountSettings = () => {

  const { themeStyles } = useGlobalStyle();  
  const [ isMakingCall, setIsMakingCall ] = useState(false);
    const navigation = useNavigation();

  const navigateToUserDetails = () => {
    if (selectedFriend) {
      navigation.navigate('UserDetails');
    }
  };


 

  return (
    <BaseModalFooterSection isMakingCall={isMakingCall} LoadingComponent={LoadingPage} themeStyles={themeStyles}>

 
 
      <TouchableOpacity onPress={() => navigation.navigate('UserDetails')} style={styles.accountSettingsRow}> 
        <View style={{ flexDirection: 'row' }}>
         <FontAwesome5 name="user" size={22} style={[styles.icon, themeStyles.modalIconColor]}  />
          <Text style={[styles.sectionTitle, themeStyles.modalText]}>Edit Profile</Text> 
        </View> 
      </TouchableOpacity> 
      <View style={styles.accountSettingsRow}> 
        <View style={{ flexDirection: 'row' }}>
         <FontAwesome5 name="wrench" size={22} style={[styles.icon, themeStyles.modalIconColor]}  />
          <Text style={[styles.sectionTitle, themeStyles.modalText]}>Change Password</Text> 
        </View> 
      </View> 
      <View style={styles.accountSettingsRow}> 
        <View style={{ flexDirection: 'row' }}>
         <FontAwesome5 name="trash" size={22} style={[styles.icon, themeStyles.modalIconColor]}  />
          <Text style={[styles.sectionTitle, themeStyles.modalText]}>Delete Account</Text> 
        </View> 
      </View> 

      </BaseModalFooterSection>
  );
};

const styles = StyleSheet.create({
  container: { 
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 0, // changed this from ModalColorTheme
    width: '100%',
    alignSelf: 'flex-start', 
  },
  accountSettingsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
    marginBottom: 8,
  },  
  icon: {
    marginRight: 10,
    marginLeft: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginLeft: 5,
    marginRight: 10,
  },  
});

export default SectionAccountSettings;
