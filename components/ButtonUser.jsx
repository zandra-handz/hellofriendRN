import React, { useState } from 'react';
import { TouchableOpacity, AccessibilityInfo } from 'react-native';
import ActionPageInfo from './ActionPageInfo';  
import UserOutlineSvg from '../assets/svgs/user-outline.svg'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ButtonUser = () => {
  const { themeStyles } = useGlobalStyle();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  React.useEffect(() => {
    if (isModalVisible) {
      AccessibilityInfo.announceForAccessibility('Information opened');
    }
  }, [isModalVisible]);

  return (
    <>
      <TouchableOpacity onPress={toggleModal}>
        <UserOutlineSvg width={23} height={23} style={themeStyles.footerIcon} />
      </TouchableOpacity>

      <ActionPageInfo visible={isModalVisible} onClose={toggleModal} />
    </>
  );
};


export default ButtonUser;
