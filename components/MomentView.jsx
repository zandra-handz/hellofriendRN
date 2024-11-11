import React, { useState } from 'react';
import { StyleSheet, View, Modal, Dimensions } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import HeaderBaseItemView from '../components/HeaderBaseItemView';
import TrashOutlineSvg from '../assets/svgs/trash-outline.svg';
import LoadingPage from '../components/LoadingPage';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useFriendList } from '../context/FriendListContext';
import { LinearGradient } from 'expo-linear-gradient';
import SlideToAction from '../components/SlideToAction';

const { height: screenHeight } = Dimensions.get('window'); // Get screen height

const MomentView = ({ onSliderPull, isModalVisible, toggleModal, modalContent, modalTitle }) => {
  
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const { deleteMomentMutation, resultMessage } = useCapsuleList();
  const [ isMenuVisible, setMenuVisible ] = useState(false);


  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };
  
  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        

        {!deleteMomentMutation.isIdle && ( 
        <LinearGradient
          colors={[
              themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.loadingWrapper}
      >

        <LoadingPage
            loading={deleteMomentMutation.isPending}
            resultsMessage={resultMessage}
            spinnerType='flow'
            color={'transparent'}
            labelColor={themeAheadOfLoading.fontColorSecondary}
            includeLabel={false} 
            />

        </LinearGradient>
        )} 
        {deleteMomentMutation.isIdle && (
        <>
      <HeaderBaseItemView onBackPress={toggleModal} onSliderPull={onSliderPull} headerTitle={modalTitle} />

      <View style={styles.modalContainer}>
        




     
        <View 
          style={[
            styles.modalContent, 
            themeStyles.genericTextBackground, 
            { maxHeight: screenHeight * 0.9, paddingBottom: 30 } // Modal content takes up 80% of screen height
          ]}
        >
          {modalContent}
        </View>
    
      </View>
      </>
        )}
     
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1,
    width: '100%', 
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    zIndex: 1,
  },
  loadingWrapper: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  modalContent: {
    width: '100%', 
    padding: 4, 
    borderRadius: 0,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center',  
  },
  closeButton: {
    paddingRight: 30,  
    paddingLeft: 7,
    paddingTop: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'left',
    flex: 1, 
  }, 
});

export default MomentView;
