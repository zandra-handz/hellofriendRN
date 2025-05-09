import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useAuthUser } from "@/src/context/AuthUserContext";

import { deleteUserAddress, updateUserProfile } from "@/src/calls/api";

import SpecialFormattingBirthday from "../SpecialFormattingBirthday";
import FormUserAddressCreate from "@/src/forms/FormUserAddressCreate";
import ButtonAddress from "../buttons/locations/ButtonAddress";

const AlertProfileBottomUser = ({ visible, profileData, onClose }) => {
  const { authUserState } = useAuthUser();
  const [editMode, setEditMode] = useState(false);
  const [differentEditScreen, setDifferentEditScreen] = useState(false);
  const [firstName, setFirstName] = useState(
    authUserState.user.profile.first_name
  );
  const [lastName, setLastName] = useState(
    authUserState.user.profile.last_name
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    authUserState.user.profile.date_of_birth
  );
  const [gender, setGender] = useState(authUserState.user.profile.gender);
  const [userAddresses, setUserAddresses] = useState(
    authUserState.user.addresses
  );

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const toggleDifferentEditScreen = () => {
    setDifferentEditScreen(!differentEditScreen);
  };

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile(
        authUserState.user.id,
        firstName,
        lastName,
        dateOfBirth,
        gender
      );
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleDeleteAddress = async (title) => {
    try {
      await deleteUserAddress(authUserState.user.id, { title });
      setUserAddresses(
        userAddresses.filter((address) => address.title !== title)
      );
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome5 name="times" size={20} color="black" solid={false} />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View>
              <View style={styles.row}>
                <FontAwesome5
                  name="user"
                  size={20}
                  color="black"
                  style={styles.icon}
                />
                <Text style={styles.modalTitle}>
                  {authUserState.user.username}
                </Text>
              </View>
              <View style={styles.row}>
                <SpecialFormattingBirthday birthDate={dateOfBirth} />
              </View>
              <View style={styles.row}>
                <FontAwesome5
                  name="envelope"
                  size={20}
                  color="black"
                  style={styles.icon}
                />
                <Text>{authUserState.user.email}</Text>
              </View>
              <View style={styles.addressRow}>
                <FontAwesome5
                  name="map-marker-alt"
                  size={20}
                  color="black"
                  style={[styles.icon, styles.mapIcon]}
                />
                <Text style={styles.sectionTitle}></Text>
                {userAddresses.map((addressData, index) => (
                  <View key={index} style={styles.addressSection}>
                    <ButtonAddress
                      address={addressData}
                      onDelete={handleDeleteAddress}
                    />
                  </View>
                ))}
                <TouchableOpacity
                  onPress={toggleDifferentEditScreen}
                  style={styles.editButton}
                >
                  <FontAwesome5 name="plus" size={12} color="white" />
                </TouchableOpacity>
              </View>
              {differentEditScreen && (
                <View style={styles.formContainer}>
                  <FormUserAddressCreate userId={authUserState.user.id} />
                </View>
              )}
              <View style={styles.row}>
                <Text>Phone Number: {authUserState.user.phone_number}</Text>
              </View>
              <View style={styles.row}>
                <Text>
                  High Contrast Mode:{" "}
                  {authUserState.user.settings.high_contrast_mode
                    ? "Enabled"
                    : "Disabled"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text>
                  Large Text:{" "}
                  {authUserState.user.settings.large_text
                    ? "Enabled"
                    : "Disabled"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text>
                  Receive Notifications:{" "}
                  {authUserState.user.settings.receive_notifications
                    ? "Enabled"
                    : "Disabled"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text>
                  Screen Reader:{" "}
                  {authUserState.user.settings.screen_reader
                    ? "Enabled"
                    : "Disabled"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={toggleEditMode}
                style={styles.editButtonRight}
              >
                <FontAwesome5 name="edit" size={16} color="blue" />
              </TouchableOpacity>
            </View>
            {editMode && (
              <View>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First Name"
                />
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last Name"
                />
                <TextInput
                  style={styles.input}
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder="Date of Birth"
                />
                <TextInput
                  style={styles.input}
                  value={gender}
                  onChangeText={setGender}
                  placeholder="Gender"
                />
                <TouchableOpacity
                  onPress={handleUpdateProfile}
                  style={styles.updateButton}
                >
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={toggleEditMode}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "60%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  addressSection: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  editButton: {
    marginLeft: 3,
    borderRadius: 15,
    backgroundColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonRight: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  mapIcon: {
    marginLeft: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  updateButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  updateButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 10,
    backgroundColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});

export default AlertProfileBottomUser;
