import React, { useState, useEffect } from 'react';
import { View,  StyleSheet, Text,   Button } from 'react-native';
import AlertImage from '../components/AlertImage'; 
import { useCapsuleList } from '@/src/context/CapsuleListContext';
import ItemViewFooter from './ItemViewFooter';

import NavigationArrows from '../components/NavigationArrows';


import TrashOutlineSvg from '@/app/assets/svgs/trash-outline.svg';
import EditOutlineSvg from '@/app/assets/svgs/edit-outline.svg';


const ItemViewMomentArchived = ({ moment, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true); 
 
  const { capsuleList } = useCapsuleList();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [title, setTitle] = useState(null); 

  useEffect(() => {
    if (moment) {
    setTitle(moment.typedCategory);
    const index = capsuleList.findIndex(mom => mom.id === moment.id);
    setCurrentIndex(index);
  }
  }, [moment]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    onClose();
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
      // Perform delete action
      onClose();
    } catch (error) {
      console.error('Error deleting moment:', error);
    }
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
        <View style={styles.momentContainer}> 
          <Text style={styles.momentText}>
            {
              capsuleList[currentIndex].capsule
            }
            </Text>
        
          {isEditing ? (
            <>
              <Button title="Update" onPress={handleUpdate} />
              <Button title="Cancel" onPress={() => setIsEditing(false)} />
            </>
          ) : (
            <>
              <Text style={styles.modalText}> </Text>

            </>
          )}

          
            <NavigationArrows 
              currentIndex={0}
              imageListLength={capsuleList.length}
              onPrevPress={() => {}}
              onNextPress={() => {}}
            />
            <View style={styles.buttonContainer}> 
              <View style={styles.footerContainer}>
              <ItemViewFooter
                  buttons={[
                    { label: 'Edit', icon: <EditOutlineSvg width={34} height={34} color='black'/>, onPress: handleEdit },
                    { label: 'Delete', icon: <TrashOutlineSvg width={34} height={34} color='black' />, onPress: handleDelete },
                    { label: 'Share', icon: <TrashOutlineSvg width={24} height={24} color="black" />, onPress: handleEdit },
                  ]}
                  maxButtons={3} 
                  showLabels={false}
                />
                </View> 
              </View>
        </View>
      ) : null
    }
    modalTitle={moment.typedCategory}
  />
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,  
  }, 
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  }, 
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
  },
  icon: {
    marginHorizontal: 10,
  },
  momentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 10,
    borderRadius: 20,
    borderWidth: .8,
    borderColor: 'gray',
  },
  momentText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,

  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tagLabel: {
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, // Add some padding if needed
    backgroundColor: 'transparent', // Temporary background for debugging
  },
  
  buttonContainer: { 
    position: 'absolute',
    bottom: 0, 
    flexDirection: 'column',
    justifyContent: 'space-between', 
  },
});

export default ItemViewMomentArchived;
