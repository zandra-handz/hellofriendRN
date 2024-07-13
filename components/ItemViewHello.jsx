import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import ItemViewFooter from './ItemViewFooter';

const ItemViewHello = ({ moment, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [includeTag, setIncludeTag] = useState(false);

  const { selectedFriend } = useSelectedFriend();
  const { capsuleList, setCapsuleList } = useCapsuleList();
   
  const [title, setTitle] = useState(null); 

  useEffect(() => {
    if (moment) {

      console.log('Moment data:', moment);
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

  return (
    <AlertImage
      isModalVisible={isModalVisible}
      toggleModal={closeModal}
      modalContent={
       moment ? (
        <View> 
          <Text>{moment.capsule}</Text>
          {isEditing ? (
            <>
              <Button title="Update" onPress={handleUpdate} />
              <Button title="Cancel" onPress={() => setIsEditing(false)} />
            </>
          ) : (
            <>
              <Text style={styles.modalText}> </Text>
              <ItemViewFooter
                  buttons={[
                    { label: 'Edit', icon: 'edit', color: 'blue', onPress: handleEdit },
                    { label: 'Delete', icon: 'trash-alt', color: 'red', onPress: handleDelete },
                    { label: 'Share', icon: 'share', color: 'green', onPress: handleDelete },
                  ]}
              />
            </>
          )}
        </View>
      ) : null
    }
    modalTitle={moment.typedCategory}
  />
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Adjust padding as needed
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  imageContainer: {
    padding: 10,
    width: '100%',
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10,
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
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tagLabel: {
    fontSize: 16,
  },
});

export default ItemViewHello;
