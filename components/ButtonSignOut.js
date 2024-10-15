import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import LogoutOutlineSvg from '../assets/svgs/logout-outline.svg';
import ByeSvg from '../assets/svgs/bye.svg';
import AlertConfirm from '../components/AlertConfirm';

const ButtonSignOut = ({ 
  label=null, 
  confirmationAlert = true 
}) => {
  const { onSignOut } = useAuthUser();
  const { themeStyles } = useGlobalStyle();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSignOutPress = () => {
    if (confirmationAlert) {
      setModalVisible(true);
    } else {
      onSignOut();
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const confirmSignOut = () => {
    setModalVisible(false);
    onSignOut();
  };

  return (
    <>
      <TouchableOpacity onPress={handleSignOutPress}>
        <LogoutOutlineSvg width={25} height={25} style={themeStyles.footerIcon}  />
      </TouchableOpacity>

      {confirmationAlert && (
        <AlertConfirm
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          headerContent={<ByeSvg width={36} height={36} />}
          questionText="Are you sure you want to sign out?"
          onConfirm={confirmSignOut}
          onCancel={toggleModal}
          confirmText="Yes"
          cancelText="No"
        />
      )}
    </>
  );
};
 

export default ButtonSignOut;
