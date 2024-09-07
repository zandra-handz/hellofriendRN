import React, { useRef, useState, useEffect } from 'react';
import { View,  Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; 
import FormFriendColorThemeUpdate from '../forms/FormFriendColorThemeUpdate'; 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { updateFriendFavesColorThemeSetting, updateFriendFavesColorThemeGradientDirection} from '../api';
import ToggleButton from '../components/ToggleButton';   
import ArtistColorPaletteSvg from '../assets/svgs/artist-color-palette.svg';
import AlertFormSubmit from '../components/AlertFormSubmit';
import LoadingPage from '../components/LoadingPage';

const ModalColorTheme = ({ visible, onClose }) => {
  const { authUserState } = useAuthUser(); 
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend, friendColorTheme, setFriendColorTheme } = useSelectedFriend();
  const [isColorThemeModalVisible, setIsColorThemeModalVisible] = useState(false);
  const [ isMakingCall, setIsMakingCall ] = useState(false);

  const formRef = useRef(null); 

  const [useFriendColorTheme, setUseFriendColorTheme] = useState(false);
  const [isColorThemeOn, setIsColorThemeOn ] = useState(false)
  const [invertGradientDirection, setInvertGradientDirection] = useState(false);

  useEffect(() => {
    if (friendColorTheme) {
        if (friendColorTheme.useFriendColorTheme === false) {
            setUseFriendColorTheme(false);
            setIsColorThemeOn(false);
          } else {
            setUseFriendColorTheme(friendColorTheme.useFriendColorTheme === true);
            setIsColorThemeOn(true);
          }
          
      setInvertGradientDirection(friendColorTheme.invertGradient === true);
      
      console.log('friendColorTheme useEffect inside panelbottom: ', friendColorTheme);
    }
  }, [friendColorTheme]);

  const toggleUseFriendColorTheme = () => {
    const newValue = !useFriendColorTheme;
    console.log('newValue: ', newValue, useFriendColorTheme);
    setUseFriendColorTheme(newValue);
    updateColorThemeSetting(newValue);
    console.log('newValue: ', newValue, useFriendColorTheme);
  };

  const toggleColorThemeGradientDirection = () => {
    const newValue = !invertGradientDirection;
    console.log('newValue: ', newValue, invertGradientDirection);
    setInvertGradientDirection(newValue);
    updateGradientDirectionSetting(newValue);
    console.log('newValue for gradient direction: ', newValue, invertGradientDirection);
  };

  const updateColorThemeSetting = async (setting) => {
    setIsMakingCall(true);
    try {
      const newSettings = { ...friendColorTheme, ...setting};
      await updateFriendFavesColorThemeSetting(authUserState.user.id, selectedFriend.id, setting);
      setFriendColorTheme(prev => ({
        ...prev,
        useFriendColorTheme: setting
      }));
      console.log('Color theme setting updated successfully ', setting);
    } catch (error) {
      console.error('Error updating color theme setting:', error);
    } finally {
        setIsMakingCall(false);
    }
  };

  const updateGradientDirectionSetting = async (setting) => {
    setIsMakingCall(true);
    try {
      const newSettings = { ...friendColorTheme, ...setting};
      await updateFriendFavesColorThemeGradientDirection(authUserState.user.id, selectedFriend.id, setting);
      setFriendColorTheme(prev => ({
        ...prev,
        invertGradient: setting
      }));
      console.log('Color theme gradient direction updated successfully ', setting);
    } catch (error) {
      console.error('Error updating color theme gradient direction:', error);
    } finally {
        setIsMakingCall(false);
    }
  };
 
  const closeColorThemeModal = () => {
    setIsColorThemeModalVisible(false);
  };


  
  const toggleColorThemeModal = () => {
    setIsColorThemeModalVisible(true);
  };
 

  return (
    <Modal transparent={true} visible={visible} animationType="slide" presentationStyle="overFullScreen">
      <View style={styles.overlay}>
        <View style={[styles.container, themeStyles.modalContainer]}>
  
   
          {isMakingCall && (
            <View style={[themeStyles.modalContainer, {
              position: 'absolute',
              top: 50,
              left: 0,
              right: 0,
              bottom: 0, 
              borderTopLeftRadius: 20,  
              borderTopRightRadius: 20, 
              zIndex: 1,
            }]} />
          )}
   
          {isMakingCall && (
            <View style={{
              position: 'absolute',
              top: 50,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',  
              alignItems: 'center',  
              zIndex: 2 // Ensure spinner is on top of everything
            }}>
              <LoadingPage
                loading={true}
                spinnerSize={60}
                spinnerType='circle'
              />
            </View>
          )}
   
          <View style={{ zIndex: 0 }}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={20} solid={false}style={[styles.icon, themeStyles.modalIconColor]}/>
            </TouchableOpacity> 
  
            <View style={styles.row}>
              <FontAwesome5 name="user" size={20} style={[styles.icon, themeStyles.modalIconColor]} />
              {selectedFriend && selectedFriend.name && ( 
              <Text style={[styles.modalTitle, themeStyles.modalText]}>Custom Colors for {selectedFriend.name}</Text>
                )}
            </View> 
  
            <>
              {isColorThemeOn && (
                <>
                  <View style={styles.colorThemeRow}>
                    <View style={{ flexDirection: 'row' }}> 
                      <FontAwesome5 name="palette" size={20} style={[styles.icon, styles.mapIcon, themeStyles.modalIconColor]} />
                      <Text style={[styles.sectionTitle, themeStyles.modalText]}>Color Theme</Text>
                      <TouchableOpacity onPress={toggleColorThemeModal} style={styles.colorThemeButton}>
                        <Text>Change</Text>
                      </TouchableOpacity>
                    </View>
                  </View> 
  
                  <View style={styles.colorThemeRow}>
                    <View style={{ flexDirection: 'row' }}> 
                        <FontAwesome5 name="palette" size={20} color="black" style={[styles.icon, styles.mapIcon, themeStyles.modalIconColor]} />
                        <Text style={[styles.sectionTitle, themeStyles.modalText]}>Invert gradient </Text> 
                        
                    </View>
                    <ToggleButton value={invertGradientDirection} onToggle={toggleColorThemeGradientDirection} />   
                  </View>
                </>
              )}
  
              <View style={styles.colorThemeRow}>
                <View style={{ flexDirection: 'row' }}>
                  <FontAwesome5 name="palette" size={20} style={[styles.icon, styles.mapIcon, themeStyles.modalIconColor]} />
                  <Text style={[styles.sectionTitle, themeStyles.modalText]}>{isColorThemeOn ? 'Turn off' : 'Turn on'}</Text> 
                </View>
                <ToggleButton value={useFriendColorTheme} onToggle={toggleUseFriendColorTheme} />   
              </View>
            </>
          </View>
        </View>
  
        <AlertFormSubmit
          isModalVisible={isColorThemeModalVisible}
          toggleModal={closeColorThemeModal}
          headerContent={<ArtistColorPaletteSvg width={38} height={38} color='black' />}
          questionText={`Update color theme for friend dashboard?`}
          formBody={<FormFriendColorThemeUpdate ref={formRef} />}
          onConfirm={() => {
            if (formRef.current) {
              formRef.current.submit(); // Call submit method on the form
            }
            closeColorThemeModal(); // Close the modal after submission
          }}
          onCancel={closeColorThemeModal}
          confirmText="Update"
          cancelText="Nevermind"
        />
      </View>
    </Modal>
  );
  
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  containerCover: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: { 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    alignSelf: 'flex-start', 
  },
  closeButton: {
    position: 'absolute',
    top: -6,
    right: 0,
    padding: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold', 
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center', 
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    marginRight: 10,
  },
  colorThemeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
    marginBottom: 8,
  }, 
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginLeft: 5,
    marginRight: 10,
  },
  colorThemeButton: {
    marginLeft: 6,
    borderRadius: 15,
    backgroundColor: '#ccc',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapIcon: {
    marginLeft: 2,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});

export default ModalColorTheme;
