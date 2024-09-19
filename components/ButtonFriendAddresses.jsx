// Opens a modal
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import GearsTwoBiggerCircleSvg from '../assets/svgs/gears-two-bigger-circle.svg';
 
import PaintRollerSvg from '../assets/svgs/paint-roller.svg'; // Import the SVG icon
 
import ModalFriendAddresses from '../components/ModalFriendAddresses';

import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';


const ButtonFriendAddresses = () => {
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const [showProfile, setShowProfile] = useState(false); 
 
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
      <TouchableOpacity style={styles.section} onPress={toggleModal}>
        <GearsTwoBiggerCircleSvg width={32} height={32} style={themeStyles.footerIcon} />
        {label && ( 
        <Text style={themeStyles.footerText}>Settings</Text>
        )}
      </TouchableOpacity>
      <ModalFriendAddresses
        visible={showProfile}
        profileData={selectedFriend}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1,  
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16, 
    fontFamily: 'Poppins-Bold',
    textAlign: 'center', 
    marginTop: 4,  
  },
});

export default ButtonFriendAddresses;
