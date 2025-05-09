// Opens a modal
import React, { useState } from 'react';
import { TouchableOpacity, AccessibilityInfo } from 'react-native';
import GearsTwoBiggerCircleSvg from '@/app/assets/svgs/gears-two-bigger-circle.svg';
 

import ModalFriendAddresses from '@/app/components/friends/ModalFriendAddresses';

import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';


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
      <TouchableOpacity onPress={handlePress}>
        <GearsTwoBiggerCircleSvg width={32} height={32} style={themeStyles.footerIcon} />
      </TouchableOpacity>
      <ModalFriendAddresses
        visible={showProfile}
        profileData={selectedFriend}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
};
 

export default ButtonFriendAddresses;
