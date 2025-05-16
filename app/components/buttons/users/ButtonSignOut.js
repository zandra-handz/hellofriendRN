import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUser } from '@/src/context/UserContext';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import LogoutOutlineSvg from '@/app/assets/svgs/logout-outline.svg';
 
import DoubleChecker from "@/app/components/alerts/DoubleChecker";

const ButtonSignOut = ({ 
  label=null, 
  confirmationAlert = true 
}) => {
  const { onSignOut } = useUser();
  const { themeStyles } = useGlobalStyle();
   const [isDoubleCheckerVisible, setIsDoubleCheckerVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const openDoubleChecker = () => {
    setIsDoubleCheckerVisible(true);
  };

  const toggleDoubleChecker = () => {
    setIsDoubleCheckerVisible((prev) => !prev);
  };

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
      <TouchableOpacity onPress={openDoubleChecker}>
        <LogoutOutlineSvg width={25} height={25} style={themeStyles.footerIcon}  />
      </TouchableOpacity>


      {isDoubleCheckerVisible && (
          <DoubleChecker
            isVisible={isDoubleCheckerVisible}
            toggleVisible={toggleDoubleChecker}
            singleQuestionText="Sign out?"
            onPress={() => confirmSignOut()}
          />
        )}

      {/* {confirmationAlert && (
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
      )} */}
    </>
  );
};
 

export default ButtonSignOut;
