import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FormFriendAddressCreate from '../forms/FormFriendAddressCreate'; // Import the form component
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ArrowAnimation from '../components/ArrowAnimation'; // Adjust the import path




const AlertProfileBottomFriend = ({ visible, profileData, onClose }) => {
    const { authUserState } = useAuthUser();
    const { selectedFriend } = useSelectedFriend();
    const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide" presentationStyle="overFullScreen">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome5 name="times" size={20} color="black" solid={false} />
          </TouchableOpacity>
          {!editMode ? ( // Render profile view if not in edit mode
            <>
              <Text style={styles.modalTitle}>Name: {authUserState.user.name}</Text>
              <Text>Email: {profileData.email}</Text>
              <TouchableOpacity onPress={toggleEditMode} style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit Address</Text>
              </TouchableOpacity>
              
              
            </>
          ) : ( // Render form if in edit mode
            <FormFriendAddressCreate friendId={selectedFriend.id} onCancel={toggleEditMode} />
          )}
          {editMode && ( // Render back button if in edit mode
            <TouchableOpacity onPress={toggleEditMode} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // Align pop-up at the bottom
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '50%', // Set the minimum height
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  editButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    padding: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  editButtonText: {
    color: 'blue',
  },
  backButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    padding: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'blue',
  },
});

export default AlertProfileBottomFriend;
