import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FormFriendAddressCreate from '../forms/FormFriendAddressCreate'; // Import the form component
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { fetchFriendAddresses, deleteFriendAddress } from '../api';
import ButtonAddress from './ButtonAddress';
import ArrowAnimation from '../components/ArrowAnimation'; // Adjust the import path


const AlertPanelBottom = ({ visible, profileData, onClose }) => {
  const { authUserState } = useAuthUser();
  const [editMode, setEditMode] = useState(false);
  const [differentEditScreen, setDifferentEditScreen] = useState(false);
  const { selectedFriend } = useSelectedFriend();
  const [friendAddresses, setFriendAddresses] = useState(null);

  useEffect(() => {
    if (visible) {
      const fetchAddresses = async () => {
        try {
          const data = await fetchFriendAddresses(selectedFriend.id);
          setFriendAddresses(data);
        } catch (error) {
          console.error('Error fetching friend addresses:', error);
        }
      };
      fetchAddresses();
    }
  }, [visible, selectedFriend]);

  const toggleDifferentEditScreen = () => {
    setDifferentEditScreen(!differentEditScreen);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteFriendAddress(selectedFriend.id, addressId);
      fetchAddresses(); // Refresh addresses after deletion
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const data = await fetchFriendAddresses(selectedFriend.id);
      setFriendAddresses(data);
    } catch (error) {
      console.error('Error fetching friend addresses:', error);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide" presentationStyle="overFullScreen">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome5 name="times" size={20} color="black" solid={false} />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View>
              <View style={styles.row}>
                <FontAwesome5 name="user" size={20} color="black" style={styles.icon} />
                <Text style={styles.modalTitle}>{selectedFriend.name}</Text>
              </View>
              <View style={styles.addressRow}>
                <FontAwesome5 name="map-marker-alt" size={20} color="black" style={[styles.icon, styles.mapIcon]} />
                <Text style={styles.sectionTitle}></Text>
                {friendAddresses &&
                  friendAddresses.map((friendAddress, index) => (
                    <View key={index} style={styles.addressSection}>
                      <ButtonAddress address={friendAddress} onDelete={() => handleDeleteAddress(friendAddress.id)} />
                    </View>
                  ))}
                <TouchableOpacity onPress={toggleDifferentEditScreen} style={styles.editButton}>
                  <FontAwesome5 name="plus" size={12} color="white" />
                </TouchableOpacity>
              </View>
              <ArrowAnimation/>

              {!differentEditScreen ? (
                <>
                  <Text>Email: {profileData.email}</Text>
                </>
              ) : (
                <FormFriendAddressCreate friendId={selectedFriend.id} onCancel={toggleEditMode} />
              )}
              {editMode && (
                <TouchableOpacity onPress={toggleEditMode} style={styles.backButton}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '60%',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  addressSection: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  editButton: {
    marginLeft: 3,
    borderRadius: 15,
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonRight: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  mapIcon: {
    marginLeft: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  updateButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 10,
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});

export default AlertPanelBottom;
