import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ItemViewFooter from './ItemViewFooter';
import NavigationArrows from '../components/NavigationArrows';
import TrashOutlineSvg from '../assets/svgs/trash-outline.svg';
import EditOutlineSvg from '../assets/svgs/edit-outline.svg';

const ItemViewMoment = ({ archived = false, moment, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);

  const { selectedFriend } = useSelectedFriend();

  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
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
    <View>
      <AlertImage
        isModalVisible={isModalVisible}
        toggleModal={closeModal}
        modalContent={
          <View style={styles.momentContainer}>
            <Text style={styles.momentText}>
              {archived ? moment.capsule : moment.capsule}
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

            {!archived && moment.typedCategory && (
              <NavigationArrows
                currentIndex={0}
                imageListLength={1} // Placeholder; since `archived` is true, this is not used
                onPrevPress={() => {}}
                onNextPress={() => {}}
              />
            )}

            <View style={styles.buttonContainer}>
              <View style={styles.footerContainer}>
                <ItemViewFooter
                  buttons={[
                    { label: 'Edit', icon: <EditOutlineSvg width={34} height={34} color='black' />, onPress: handleEdit },
                    { label: 'Delete', icon: <TrashOutlineSvg width={34} height={34} color='black' />, onPress: handleDelete },
                    { label: 'Share', icon: <TrashOutlineSvg width={24} height={24} color="black" />, onPress: handleEdit },
                  ]}
                  maxButtons={3}
                  showLabels={false}
                />
              </View>
            </View>
          </View>
        }
        modalTitle={moment.typedCategory || moment.typed_category}
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
    borderWidth: 0.8,
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

export default ItemViewMoment;
