import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MomentView from '../components/MomentView';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useCapsuleList } from '../context/CapsuleListContext';  
import ButtonBaseSpecialSave from '../components/ButtonBaseSpecialSave';

import NavigationArrows from '../components/NavigationArrows'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';

const MomentsNavigator = ({ archived = false, moment, onClose }) => {

  const [isModalVisible, setIsModalVisible] = useState(true);
  const { capsuleList, deleteMomentRQuery, deleteMomentMutation } = useCapsuleList();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [title, setTitle] = useState(null); 
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend(); 
 
  useEffect(() => {
    if (moment) {
      setTitle(moment.typedCategory);
      const index = capsuleList.findIndex(mom => mom.id === moment.id);
      setCurrentIndex(index); 
    }
  }, [moment]);


  //manually closing this for right now because I give up
  useEffect(() => { 
    if (deleteMomentMutation.isSuccess) {
      closeModal();
    }
  
  }, [deleteMomentMutation.isSuccess]);

  const closeModal = () => { 
    onClose();
  };
  
   

  const goToPreviousMoment = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const goToNextMoment = () => {
    if (currentIndex < capsuleList.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };
 

  const handleDelete = async () => {
    console.log('handle delete moment triggered');
    try { 

      const momentData = {
        friend: selectedFriend.id,
        id: moment.id,
      };
 

      await deleteMomentRQuery(momentData);  
    } catch (error) { 
      console.error('Error deleting moment:', error);
    }  
  };

  useEffect(() => {
    setTitle(capsuleList[currentIndex]?.typedCategory || '');
  }, [currentIndex]);

  return (
    <View>
  
      <MomentView
      onSliderPull={handleDelete}
        isModalVisible={isModalVisible} 
        toggleModal={onClose}
        momentCategory={capsuleList[currentIndex] ? capsuleList[currentIndex].typedCategory : 'No category'}
        momentText={capsuleList[currentIndex] ? capsuleList[currentIndex].capsule: 'No moment'}
        momentData={capsuleList[currentIndex] ? capsuleList[currentIndex] : null}
        navigationArrows={
          capsuleList[currentIndex] ? ( 

              
            <>
                {!archived && moment.typedCategory && (
                  <NavigationArrows 
                    currentIndex={currentIndex}
                    imageListLength={capsuleList.length}
                    onPrevPress={goToPreviousMoment}
                    onNextPress={goToNextMoment}
                  />
                )} 
            </>
          ) : null
        }
        modalTitle='View moment'
      /> 
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    zIndex: 0,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',  // Ensure it overlays the full screen
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  
  modalContent: {
    width: '100%', 
    padding: 20, 
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 20,
    paddingVertical: 20,
    fontFamily: 'Poppins-Bold', 
  },
  momentText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    padding: 20,
    borderRadius: 30, 
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  confirmationText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 0,
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
  }, 
  momentContainer: {
    flex: 1,
    width: '100%', 
    padding: 10,
    borderRadius: 20, 
    justifyContent: 'flex-start',
  }, 
  footerContainer: { 
    justifyContent: 'space-between', 
    width: '100%',
    padding: 10,  
  },
  buttonContainer: { 
    width: '104%', 
    height: 'auto',
    position: 'absolute',
    bottom: -10,
    flex: 1,
    right: -2,
    left: -2,
  }, 
});

export default MomentsNavigator;