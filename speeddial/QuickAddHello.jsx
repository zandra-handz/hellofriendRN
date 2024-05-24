import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements'; 
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import { useLocationList } from '../context/LocationListContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { fetchTypeChoices, saveHello } from '../api';
import CapsuleItem from '../components/CapsuleItem';

const QuickAddHello = ({ onClose }) => {
  const [textInput, setTextInput] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [typeChoices, setTypeChoices] = useState([]);
  const [locationLabelValue, setLocationLabelValue] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [locationNameInput, setLocationNameInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLocationName, setSelectedLocationName] = useState('');
  const [capsuleLabelValue, setCapsuleLabelValue] = useState('');
  const [selectedTypeCapsule, setSelectedTypeCapsule] = useState('');
  const [selectedCapsule, setSelectedCapsule] = useState('');
  const [selectedCapsules, setSelectedCapsules] = useState([]); 
  const [deleteChoice, setDeleteChoice] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [locationData, setLocationData] = useState([]);
  const [ideaLimit, setIdeaLimit] = useState('');
  const [capsuleData, setCapsuleData] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [shouldClose, setShouldClose] = useState(false);
  const { selectedFriend } = useSelectedFriend();
  const { locationList } = useLocationList();
  const { capsuleList } = useCapsuleList();
  const { authUserState } = useAuthUser();
  const { updateTrigger, setUpdateTrigger } = useUpcomingHelloes();
  const textareaRef = useRef();
  const [textboxPlaceholder, setTextboxPlaceholder] = useState('Start typing your thought here');
  
  
  const filteredLocationList = locationList.filter((location) => location.validatedAddress);

  const handleInputChange = (text) => {
    setTextInput(text);
  };

  const handleLocationInputChange = (text) => {
    setLocationInput(text);
    setTextboxPlaceholder('Location address');
    setSelectedLocation('');
  };

  const handleLocationNameInputChange = (text) => {
    setLocationNameInput(text);
    setTextboxPlaceholder('Location name');
    setSelectedLocation('');
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    setLocationLabelValue(value || '');
    setTextboxPlaceholder(`add to ${value || locationInput || locationNameInput}`);
    setLocationNameInput('');
    setLocationInput('');
  };

  const handleCheckboxCapsuleChange = (capsuleInfo) => {
    setSelectedCapsules((prevSelectedCapsules) => {
      console.log("locationlist inside quick modal: ", locationList);
      const isCapsuleSelected = prevSelectedCapsules.some((item) => item.id === capsuleInfo.id);
      if (isCapsuleSelected) {
        return prevSelectedCapsules.filter((item) => item.id !== capsuleInfo.id);
      } else {
        return [...prevSelectedCapsules, { ...capsuleInfo, typedCategory: capsuleInfo.typedCategory }];
      }
    });
    setTextboxPlaceholder(`add to ${capsuleInfo.capsule}`);
    setCapsuleLabelValue(capsuleInfo.id ? `${capsuleInfo.id}` : '');
  };
  
  const handleCapsuleChange = (value) => {
    setSelectedCapsule(value);
    setCapsuleLabelValue(value ? `${value}` : '');
    setTextboxPlaceholder(`add to ${value}`);
    setLocationInput('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setSelectedDate(currentDate);
    setShowDatePicker(false);  // Close the date picker after selecting a date
  };

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };


  const handleSave = async () => {
    try {
      if (selectedFriend) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const capsulesDictionary = {};
        selectedCapsules.forEach((capsule) => {
          capsulesDictionary[capsule.id] = {
            typed_category: capsule.typedCategory,
            capsule: capsule.capsule,
          };
        });

        const requestData = {
          user: authUserState.user.id,
          friend: selectedFriend.id,
          type: selectedType,
          typed_location: locationInput,
          location_name: selectedLocationName || locationNameInput,
          location: selectedLocation,
          date: formattedDate,
          thought_capsules_shared: capsulesDictionary,
          delete_all_unshared_capsules: deleteChoice,
        };
        console.log("saving hello with data: ", requestData);

        const response = await saveHello(requestData);

        handleSetFriend(selectedFriend);
        setIdeaLimit('limit feature disabled');
        setTextInput('');
        setLocationInput('');
        setLocationNameInput('');
        setCapsuleLabelValue('');
        setSelectedCapsule('');
        setLocationLabelValue('');
        setSelectedLocation('');
        setSuccessMessage('Hello saved successfully!');
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 4000);
        setUpdateTrigger((prev) => !prev);
      }
    } catch (error) {
      console.error('Error creating hello:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const typeChoices = await fetchTypeChoices();
        console.log("typeChoices: ", typeChoices);
        setTypeChoices(typeChoices);
      } catch (error) {
        console.error('Error fetching type choices:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchLimit = async () => {
      try {
        if (selectedFriend) {
          setIdeaLimit('none');
        }
      } catch (error) {
        console.error('Error fetching limit:', error);
      }
    };
    fetchLimit();
  }, [selectedFriend]);

  return (
    <ScrollView contentContainerStyle={styles.modalWrapper}> 
      <View style={styles.modalContentContainer}> 
        <View style={styles.dateContainer}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity onPress={handleShowDatePicker} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>Select Date</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              onChange={handleDateChange}
              style={styles.datePicker}
            />
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Type</Text>
          <Picker
            selectedValue={selectedType}
            onValueChange={(itemValue) => setSelectedType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a type" value="" />
            {typeChoices.map((choice, index) => (
              <Picker.Item key={index} label={choice} value={choice} />
            ))}
          </Picker>

        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={locationInput}
            placeholder="Type to enter location"
            onChangeText={handleLocationInputChange}
          />
          <TextInput
            style={styles.input}
            value={locationNameInput}
            placeholder="Type location name"
            onChangeText={handleLocationNameInputChange}
          />
          <Picker
            selectedValue={selectedLocation}
            onValueChange={handleLocationChange}
            style={styles.picker}
          >
            <Picker.Item label="Select from previously saved locations" value="" />
              {filteredLocationList.map((location) => (
                <Picker.Item key={location.id} label={location.address} value={location.address} />
              ))}
          </Picker>
        </View>
        {capsuleList.length > 0 && (
        <View>
          <Text style={styles.label}>Thought capsule</Text>
          {/* Iterate over unique categories and render capsules for each category */}
          {Array.from(new Set(capsuleList.map(capsule => capsule.typedCategory))).map((category, index) => (
            <View key={index}>
              <Text style={styles.categoryLabel}>{category}</Text>
              <View style={styles.capsuleContainer}>
                {capsuleList
                  .filter(capsule => capsule.typedCategory === category)
                  .map((capsule, idx) => (
                    <CapsuleItem
                      key={idx}
                      capsule={capsule.capsule}
                      selected={selectedCapsules.some(item => item.id === capsule.id)}
                      onPress={() => handleCheckboxCapsuleChange(capsule)}
                    />
                  ))}
              </View>
            </View>
          ))}
        </View>
        )}
        <View style={styles.inputContainer}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={deleteChoice}
              onPress={() => setDeleteChoice(!deleteChoice)}
              containerStyle={{ margin: 0, padding: 0 }}
            />
            <Text>Delete all unshared capsules</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      {successMessage ? (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessage}>{successMessage}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    flexGrow: 1, // Make ScrollView take up full height
  },
  modalContentContainer: {
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginVertical: 2,
    marginHorizontal: 0,
    width: '100%',
  },
  dataContainer: {
    flex: 1,
    width: '100%',

  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginTop: 5,
    width: '100%',
  },
  dateButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 5,
    width: '100%',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  datePicker: {
    width: '100%',
    marginTop: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 5,
  },
  capsuleItemContainer: { 
    flex: 1,
    width: '100%',
    marginBottom: 20, // Add margin bottom to separate items
  }, 
  
  checkboxContainer: {
    flex: 1, 
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    color: 'green',
    fontSize: 18,
  },
  darkMode: {
    backgroundColor: '#333',
    color: '#fff',
  },
  lightMode: {
    backgroundColor: '#fff',
    color: '#000',
  },
});

export default QuickAddHello;
