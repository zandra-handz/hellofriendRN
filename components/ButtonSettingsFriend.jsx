import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';

import PaintRollerSvg from '../assets/svgs/paint-roller.svg'; // Import the SVG icon

import AlertPanelBottom from './AlertPanelBottom';

import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';


const ButtonSettingsFriend = ({label=null}) => {
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend, friendDashboardData, friendColorTheme, calculatedThemeColors, loadingNewFriend, setFriend } = useSelectedFriend();
  const [showProfile, setShowProfile] = useState(false); 
  
  
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handlePress = () => {
    setShowProfile(!showProfile);
  };

  React.useEffect(() => {
    if (showProfile) {
      AccessibilityInfo.announceForAccessibility('Information opened');
    }
  }, [showProfile]);

  return (
    <>
      <TouchableOpacity style={styles.section} onPress={handlePress}>
        <PaintRollerSvg width={26} height={26} style={themeStyles.footerIcon} />
        {label && ( 
        <Text style={themeStyles.footerText}>Info</Text>
        )}
      </TouchableOpacity>
      <AlertPanelBottom
        visible={showProfile}
        profileData={selectedFriend}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1, // Divide space equally
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 4, // Add some margin to separate the icon from the text
  },
});

export default ButtonSettingsFriend;
