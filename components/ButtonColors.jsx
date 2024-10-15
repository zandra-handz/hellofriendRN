import React, { useState } from 'react';
import { TouchableOpacity, AccessibilityInfo } from 'react-native';

import PaintRollerSvg from '../assets/svgs/paint-roller.svg'; // Import the SVG icon
 
import ModalColorTheme from '../components/ModalColorTheme';

import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';


const ButtonColors = () => {
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
        <PaintRollerSvg width={25} height={25} style={themeStyles.footerIcon} />

      </TouchableOpacity>
      <ModalColorTheme
        visible={showProfile}
        profileData={selectedFriend}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
};

export default ButtonColors;
