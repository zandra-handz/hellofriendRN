import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MomentView from '../components/MomentView';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useCapsuleList } from '../context/CapsuleListContext'; 
import  { useFriendList } from '../context/FriendListContext';
import ButtonBaseSpecialSave from '../components/ButtonBaseSpecialSave';

import NavigationArrows from '../components/NavigationArrows'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ItemViewMoment = ({ archived = false, moment, onClose }) => {

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
      console.log('moment:  ', moment.id);
    }
  }, [moment]);


  //manually closing this for right now because I give up
  useEffect(() => {
    let timeout;
    if (deleteMomentMutation.isSuccess) {
      timeout = setTimeout(() => {
        closeModal();
      }, 1000);
    }
  
    // Cleanup function to clear the timeout when the effect is cleaned up
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [deleteMomentMutation.isSuccess]);

  const closeModal = () => {


    setIsModalVisible(false); 
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
      //removeCapsules([moment.id]);
      //closeModal();  
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
        toggleModal={closeModal}
        modalContent={
          capsuleList[currentIndex] ? (
            <View style={{flex: 1}}>

              <View style={styles.momentContainer}>
                <Text style={styles.categoryTitle}>
                  {capsuleList[currentIndex].typedCategory}
                </Text> 
                <Text style={styles.momentText}>
                  {capsuleList[currentIndex].capsule}
                </Text>

             
                <View style={styles.buttonContainer}>            
           <ButtonBaseSpecialSave
              label="SEND "
              maxHeight={80}
              onPress={[() => {}]} 
              isDisabled={false}
              fontFamily={'Poppins-Bold'}
              image={require("../assets/shapes/redheadcoffee.png")}
            
            />
            </View>
            
                {!archived && moment.typedCategory && (
                  <NavigationArrows 
                    currentIndex={currentIndex}
                    imageListLength={capsuleList.length}
                    onPrevPress={goToPreviousMoment}
                    onNextPress={goToNextMoment}
                  />
                )}
 
              </View>
            </View>
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
    padding: 20,
    zIndex: 0,
  },
  loadingWrapper: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
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
    backgroundColor: 'lightgray',
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
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
  }, 
  momentContainer: {
    flex: 1,
    width: '100%', 
    padding: 10,
    borderRadius: 20,
    borderWidth: 0.8,
    borderColor: 'gray',
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

export default ItemViewMoment;
