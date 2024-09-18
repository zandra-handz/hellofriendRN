import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FormFriendColorThemeUpdate from '../forms/FormFriendColorThemeUpdate';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import {
  updateFriendFavesColorThemeSetting,
  updateFriendFavesColorThemeGradientDirection,
} from '../api'; 
import ArtistColorPaletteSvg from '../assets/svgs/artist-color-palette.svg';
import AlertFormSubmit from '../components/AlertFormSubmit';
import LoadingPage from '../components/LoadingPage';
import BaseModalFooter from '../components/BaseModalFooter';
import BaseRowModalFooter from '../components/BaseRowModalFooter';

const ModalColorTheme = ({ visible, onClose }) => {
  const { authUserState } = useAuthUser();
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend, friendColorTheme, setFriendColorTheme } = useSelectedFriend();
  const [isColorThemeModalVisible, setIsColorThemeModalVisible] = useState(false);
  const [isMakingCall, setIsMakingCall] = useState(false);
  const formRef = useRef(null);
  const [useFriendColorTheme, setUseFriendColorTheme] = useState(false);
  const [isColorThemeOn, setIsColorThemeOn] = useState(false);
  const [invertGradientDirection, setInvertGradientDirection] = useState(false);

  useEffect(() => {
    if (friendColorTheme) {
      setUseFriendColorTheme(friendColorTheme.useFriendColorTheme || false);
      setIsColorThemeOn(friendColorTheme.useFriendColorTheme || false);
      setInvertGradientDirection(friendColorTheme.invertGradient || false);
    }
  }, [friendColorTheme]);

  const toggleUseFriendColorTheme = async () => {
    const newValue = !useFriendColorTheme;
    setUseFriendColorTheme(newValue);
    await updateColorThemeSetting(newValue);
  };

  const toggleColorThemeGradientDirection = async () => {
    const newValue = !invertGradientDirection;
    setInvertGradientDirection(newValue);
    await updateGradientDirectionSetting(newValue);
  };

  const updateColorThemeSetting = async (setting) => {
    setIsMakingCall(true);
    try {
      await updateFriendFavesColorThemeSetting(authUserState.user.id, selectedFriend.id, setting);
      setFriendColorTheme((prev) => ({ ...prev, useFriendColorTheme: setting }));
    } finally {
      setIsMakingCall(false);
    }
  };

  const updateGradientDirectionSetting = async (setting) => {
    setIsMakingCall(true);
    try {
      await updateFriendFavesColorThemeGradientDirection(authUserState.user.id, selectedFriend.id, setting);
      setFriendColorTheme((prev) => ({ ...prev, invertGradient: setting }));
    } finally {
      setIsMakingCall(false);
    }
  };

  const closeColorThemeModal = () => setIsColorThemeModalVisible(false);

  const toggleColorThemeModal = () => setIsColorThemeModalVisible(true);

  return (
    <BaseModalFooter
      visible={visible}
      onClose={onClose}
      isMakingCall={isMakingCall}
      LoadingComponent={LoadingPage}
      themeStyles={themeStyles}
    >
      <View style={styles.headerRow}>
        <FontAwesome5 name="user" size={20} style={[styles.headerIcon, themeStyles.modalIconColor]} />
        {selectedFriend?.name && (
          <Text style={[styles.modalTitle, themeStyles.modalText]}>
            Custom Colors for {selectedFriend.name}
          </Text>
        )}
      </View>

      {isColorThemeOn && (
        <>

          <BaseRowModalFooter 
            iconName='palette' 
            iconSize={20}
            label='Color Theme' 
            useToggle={false}
            useCustom={true}
            customLabel={'Change'}
            onCustomPress={toggleColorThemeModal} 
          />  

          <BaseRowModalFooter 
            iconName='palette' 
            iconSize={20}
            label='Invert gradient' 
            useToggle={true}
            value={invertGradientDirection}
            onTogglePress={toggleColorThemeGradientDirection}
          /> 
        </>
      )}
          <BaseRowModalFooter 
            iconName='palette' 
            iconSize={20}
            label={isColorThemeOn ? 'Turn off' : 'Turn on'}
            useToggle={true}
            value={useFriendColorTheme}
            onTogglePress={toggleUseFriendColorTheme} 
          /> 


      <AlertFormSubmit
        isModalVisible={isColorThemeModalVisible}
        toggleModal={closeColorThemeModal}
        headerContent={<ArtistColorPaletteSvg width={38} height={38} color='black' />}
        questionText="Update color theme for friend dashboard?"
        formBody={<FormFriendColorThemeUpdate ref={formRef} />}
        onConfirm={() => {
          if (formRef.current) {
            formRef.current.submit();
          }
          closeColorThemeModal();
        }}
        onCancel={closeColorThemeModal}
        confirmText="Update"
        cancelText="Nevermind"
      />
    </BaseModalFooter>
  );
};

const styles = StyleSheet.create({
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 30 },
    
  headerIcon: { 
    marginRight: 10 
  },
  modalTitle: { 
    fontSize: 17, 
    fontFamily: 'Poppins-Bold' 
  },
 

});

export default ModalColorTheme;
