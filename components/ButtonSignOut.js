import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthUser } from '../context/AuthUserContext';
import AlertConfirm from '../components/AlertConfirm';
import ByeSvg from '../assets/svgs/bye.svg';

const ButtonSignOut = ({ 
  icon = 'sign-out', 
  iconOnly = false, 
  label = 'Sign Out', 
  confirmationAlert = true, 
  fAIcon = false // Boolean prop to determine icon type
}) => {
  const { onSignOut } = useAuthUser();
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

  const renderIcon = () => {
    if (fAIcon) {
      return (
        <FontAwesome 
          name={icon} 
          size={28} 
          color="black" 
          style={styles.icon} 
        />
      );
    } else {
      return (
        <Icon 
          name={icon} 
          size={28} 
          color="black" 
          style={styles.icon} 
        />
      );
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handleSignOutPress} style={styles.buttonContainer}>
        {renderIcon()}
        {!iconOnly && <Text style={styles.label}>{label}</Text>}
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
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ButtonSignOut;
