import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import ItemViewFooter from '../components/ItemViewFooter';
import ItemArchivedMomentMulti from '../components/ItemArchivedMomentMulti'; // Import ItemArchivedMomentMulti component

const ItemViewHello = ({ hello, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const { selectedFriend } = useSelectedFriend();
  const { capsuleList, setCapsuleList } = useCapsuleList();

  useEffect(() => {
    if (hello) {
      console.log('Hello data:', hello);
    }
  }, [hello]);

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
        hello ? (
          <View style={styles.container}>
            <Text>{hello.locationName}</Text>
            <View style={styles.archivedMomentsContainer}>
              <ItemArchivedMomentMulti archivedMomentData={hello.pastCapsules} horizontal={false} singleLineScroll={false} />
              {isEditing ? (
                <>
                  <Button title="Update" onPress={handleUpdate} />
                  <Button title="Cancel" onPress={() => setIsEditing(false)} />
                </>
              ) : (
                <ItemViewFooter
                  buttons={[
                    { label: 'Edit', icon: 'edit', color: 'blue', onPress: handleEdit },
                    { label: 'Delete', icon: 'trash-alt', color: 'red', onPress: handleDelete },
                    { label: 'Share', icon: 'share', color: 'green', onPress: handleDelete }, // Adjust onPress actions as needed
                  ]}
                />
              )}
            </View>
          </View>
        ) : null
      }
      modalTitle={hello.type}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  archivedMomentsContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    alignContent: 'center',
    borderRadius: 0,
    padding: 4,
    paddingTop: 50,
    height: '100%',
    maxHeight: '100%',
  },
});

export default ItemViewHello;
