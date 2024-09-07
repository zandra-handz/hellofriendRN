import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
      <TouchableOpacity onPress={handleSignOutPress} style={styles.buttonContainer}>
        <LogoutOutlineSvg width={26} height={26} style={themeStyles.footerIcon}  />
        {label && (
        <Text style={[styles.label, themeStyles.footerText]}>Sign out</Text>
        )}
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

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1, // Divide space equally
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,  
  },
  label: { 
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: 'black',
  },
});

export default ButtonSignOut;
