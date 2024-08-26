import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import ItemViewFooter from './ItemViewFooter';
import NavigationArrows from '../components/NavigationArrows';
import TrashOutlineSvg from '../assets/svgs/trash-outline.svg';
import EditOutlineSvg from '../assets/svgs/edit-outline.svg';

const ItemViewMoment = ({ archived = false, moment, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const { capsuleList, setCapsuleList } = useCapsuleList();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [title, setTitle] = useState(null); 

  const { selectedFriend } = useSelectedFriend();


  useEffect(() => {
    if (moment) {
    setTitle(moment.typedCategory);
    const index = capsuleList.findIndex(mom => mom.id === moment.id);
    setCurrentIndex(index);
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
      // Perform delete action
      onClose();
    } catch (error) {
      console.error('Error deleting moment:', error);
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
                <Text style={styles.modalText}></Text>
              </>
            )}
            
           
          </View>
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
                    { label: 'Edit', icon: <EditOutlineSvg width={34} height={34} color='black' />, onPress: handleEdit },
                    { label: 'Delete', icon: <TrashOutlineSvg width={34} height={34} color='black' />, onPress: handleDelete },
                    { label: 'Share', icon: <TrashOutlineSvg width={24} height={24} color="black" />, onPress: handleEdit },
                  ]}
                  maxButtons={2}
                  showLabels={false}
                />
              </View>
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
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tagLabel: {
    fontSize: 16,
  },
  footerContainer: { 
    justifyContent: 'space-between', 
    width: '100%',
    padding: 10,  
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,  
   
    width: '100%', 
  },
});

export default ItemViewMoment;
