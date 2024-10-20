import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, Button,Platform } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import ItemViewFooter from './ItemViewFooter';
import NavigationArrows from '../components/NavigationArrows';
import TrashOutlineSvg from '../assets/svgs/trash-outline.svg';
import EditOutlineSvg from '../assets/svgs/edit-outline.svg';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { deleteThoughtCapsule } from '../api';

const ItemViewMoment = ({ archived = false, moment, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const { capsuleList, setCapsuleList, removeCapsules } = useCapsuleList();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [title, setTitle] = useState(null); 
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend(); 
  const [isConfirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isFailModalVisible, setFailModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (moment) {
      setTitle(moment.typedCategory);
      const index = capsuleList.findIndex(mom => mom.id === moment.id);
      setCurrentIndex(index);
      console.log('moment:  ', moment.id);
    }
  }, [moment]);

  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
 
  const toggleConfirmDeleteModal = () => {
    console.log('Toggle delete modal:', !isConfirmDeleteModalVisible);
    setTimeout(() => {
      setConfirmDeleteModalVisible(!isConfirmDeleteModalVisible);
    }, Platform.OS === "ios" ? 200 : 0);
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

  const handleUpdate = async () => {
    try {
      // Perform update action
      onClose();
    } catch (error) {
      console.error('Error updating moment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const momentToDelete = capsuleList[currentIndex];
      console.log(currentIndex);  // Get the correct moment to delete based on currentIndex
 
      await deleteThoughtCapsule(selectedFriend.id, moment.id);
      removeCapsules([moment.id]);
      closeModal();  
    } catch (error) {
      setFailModalVisible(true);
      console.error('Error deleting moment:', error);
    } finally {
      setConfirmDeleteModalVisible(false);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    setTitle(capsuleList[currentIndex]?.typedCategory || '');
  }, [currentIndex]);

  return (
    <View>
      <AlertImage
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

                {isEditing ? (
                  <>
                    <Button title="Update" onPress={handleUpdate} />
                    <Button title="Cancel" onPress={() => setIsEditing(false)} />
                  </>
                ) : (
                  <Text style={styles.modalText}></Text>
                )}

                {!archived && moment.typedCategory && (
                  <NavigationArrows 
                    currentIndex={currentIndex}
                    imageListLength={capsuleList.length}
                    onPrevPress={goToPreviousMoment}
                    onNextPress={goToNextMoment}
                  />
                )}

                <View style={{width: '100%'}}>
                  <View style={styles.footerContainer}>
                    <ItemViewFooter
                      buttons={[
                        { label: 'Edit', buttonIconSize: 34, buttonPurpose: 'edit', icon: <EditOutlineSvg width={34} height={34} color={themeStyles.genericText.color} />, onPress: handleEdit },
                        { label: 'Delete', buttonIconSize: 34, buttonPurpose: 'delete', icon: <TrashOutlineSvg width={34} height={34} color={themeStyles.genericText.color} />, onPress: toggleConfirmDeleteModal },
                      ]}
                      maxButtons={4} 
                      showLabels={false}
                      alignment='right'
                      padding={40}
                    /> 
                  </View>
                </View>
              </View>
            </View>
          ) : null
        }
        modalTitle='View moment'
      />
 
      <Modal
        transparent={true}
        visible={isConfirmDeleteModalVisible}
        animationType={Platform.OS === 'ios' ? "slide" : "fade"}  // Try using different animation types

      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.confirmationText}>Delete moment?</Text>
            <Text style={styles.confirmationText}>{capsuleList[currentIndex]?.title}</Text>
            <Button title="Delete" onPress={handleDelete} disabled={isDeleting} />
            <Button title="Cancel" onPress={toggleConfirmDeleteModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});

export default ItemViewMoment;
