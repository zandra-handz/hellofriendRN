import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Button } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useCapsuleList } from '../context/CapsuleListContext'; 
import ItemMomentMultiPlain from '../components/ItemMomentMultiPlain'; // Import ItemMomentMultiPlain component
 
import FooterActionButtons from '../components/FooterActionButtons';
import ButtonReuseMoments from '../components/ButtonReuseMoments';

const ItemViewHello = ({ hello, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isReselectMomentsModalVisible, setReselectMomentsModalVisible] = useState(false);
  const { selectedFriend } = useSelectedFriend();
  const { capsuleList, setCapsuleList } = useCapsuleList();

  useEffect(() => {
    if (hello) {
      console.log('Hello data:', hello);
    }
  }, [hello]);

  const toggleReselectModal = () => {
    setReselectMomentsModalVisible(!isReselectMomentsModalVisible);
  };

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
      onClose();
    } catch (error) {
      console.error('Error updating moment:', error);
    }
  };

  const handleDelete = async () => {
    try { 
      onClose();
    } catch (error) {
      console.error('Error deleting moment:', error);
    }
  };

  return (
    <AlertImage
      isModalVisible={isModalVisible}
      toggleModal={closeModal}
      modalContent={
        hello ? (
          <View style={styles.container}>
            <Text>{hello.locationName}</Text>
            <View style={styles.archivedMomentsContainer}>
              <ScrollView>


             
              <ItemMomentMultiPlain passInData={true} data={hello.pastCapsules} singleLineScroll={false} />
              </ScrollView> 
            </View> 
            <FooterActionButtons
              height='6%'
              bottom={16} 
              backgroundColor='white'
              buttons={[
                <ButtonReuseMoments onPress={toggleReselectModal} />, 
              ]}
            />
          </View>
        ) : null
      }
      modalTitle={`View hello with ${selectedFriend.name}!`}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  archivedMomentsContainer: { 
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',  
    borderRadius: 0, 
  },
  buttonContainer: { 
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default ItemViewHello;
