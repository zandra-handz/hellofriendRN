import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ButtonResetHelloes from '../components/ButtonResetHelloes';
 
import BaseModalFooterSection from '../components/BaseModalFooterSection';
import LoadingPage from '../components/LoadingPage';


import { useGlobalStyle } from '../context/GlobalStyleContext';

const SectionAccountSettings = () => {

  const { themeStyles } = useGlobalStyle();  
  const [ isMakingCall, setIsMakingCall ] = useState(false);

 

  return (
    <BaseModalFooterSection isMakingCall={isMakingCall} LoadingComponent={LoadingPage} themeStyles={themeStyles}>

 
 
      <View style={styles.accountSettingsRow}> 
        <View style={{ flexDirection: 'row' }}>
         <FontAwesome5 name="trash" size={22} style={[styles.icon, themeStyles.modalIconColor]}  />
          <Text style={[styles.sectionTitle, themeStyles.modalText]}>Delete Account</Text> 
        </View>
        <ButtonResetHelloes />
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
