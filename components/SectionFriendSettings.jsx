import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useAuthUser } from '../context/AuthUserContext';
import { updateUserAccessibilitySettings} from '../api';
import ButtonResetHelloes from '../components/ButtonResetHelloes';
import ButtonManageFriends from '../components/ButtonManageFriends';
import AlertMicro from '../components/AlertMicro'; // Assuming AlertMicro component is located here

import PersonalConnectionsSvg from '../assets/svgs/personal-connections.svg';

const SectionFriendSettings = () => {
  const { authUserState, userAppSettings, updateUserSettings } = useAuthUser();
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [simplifyAppForFocus, setSimplifyAppForFocus] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false); // Local state for screen reader
  const [manualTheme, setManualTheme] = useState(false);
  const [manualDarkMode, setManualDarkMode ] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [isAllFriendsModalVisible, setIsAllFriendsModalVisible ] = useState(false);

  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <FontAwesome5 name="users" size={20} color="black" style={styles.icon} />
        <Text style={styles.label}>Manage friends</Text> 
        <ButtonManageFriends />
      </View>  
      <View style={styles.row}> 
        <FontAwesome5 name="recycle" size={22} color="black" style={styles.icon} />
        <Text style={styles.label}>Reset All</Text> 
        <ButtonResetHelloes />
      </View> 
      
      
      <AlertMicro
        isModalVisible={showAlert}
        toggleModal={() => setShowAlert(false)}
        modalContent={
          <Text>
            Please enable the screen reader in your device settings to use this feature.
          </Text>
        }
        modalTitle="Screen Reader Required"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-evenly',
    width: '100%',
    height: 40,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    width: '60%',
  },
});

export default SectionFriendSettings;
