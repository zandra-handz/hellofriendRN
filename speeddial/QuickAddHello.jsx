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
  const [textInput, setTextInput] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [typeChoices, setTypeChoices] = useState([]);
  const [locationLabelValue, setLocationLabelValue] = useState(null);
  const [locationInput, setLocationInput] = useState(null);
  const [locationNameInput, setLocationNameInput] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLocationName, setSelectedLocationName] = useState(null);
  const [capsuleLabelValue, setCapsuleLabelValue] = useState(null);
  const [selectedTypeCapsule, setSelectedTypeCapsule] = useState(null);
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [selectedCapsules, setSelectedCapsules] = useState([]); 
  const [deleteChoice, setDeleteChoice] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const [ideaLimit, setIdeaLimit] = useState(null);
  const [capsuleData, setCapsuleData] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [shouldClose, setShouldClose] = useState(false);
  const { selectedFriend } = useSelectedFriend();
  const { locationList } = useLocationList();
  const { capsuleList, removeCapsules } = useCapsuleList();
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
    setSelectedLocation(null);
  };

  const handleLocationNameInputChange = (text) => {
    setLocationNameInput(text);
    setTextboxPlaceholder('Location name');
    setSelectedLocation(null);
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    setLocationLabelValue(value || null);
    setTextboxPlaceholder(`add to ${value || locationInput || locationNameInput}`);
    setLocationNameInput(null);
    setLocationInput(null);
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
    setCapsuleLabelValue(capsuleInfo.id ? `${capsuleInfo.id}` : null);
  };
  
  const handleCapsuleChange = (value) => {
    setSelectedCapsule(value);
    setCapsuleLabelValue(value ? `${value}` : null);
    setTextboxPlaceholder(`add to ${value}`);
    setLocationInput(null);
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

  const convertEmptyStringsToNull = (obj) => {
    const convertedObj = {};
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            convertedObj[key] = convertEmptyStringsToNull(obj[key]); // Recursively convert nested objects
        } else {
            convertedObj[key] = obj[key] === '' ? null : obj[key]; // Convert empty strings to null
        }
    }
    return convertedObj;
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

      // Reset form fields and state after successful save
      setIdeaLimit('limit feature disabled');
      setTextInput(null);
      setLocationInput(null);
      setLocationNameInput(null);
      setCapsuleLabelValue(null);
      setSelectedCapsule(null);
      setLocationLabelValue(null);
      setSelectedLocation(null);
      setSuccessMessage('Hello saved successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 4000);
 
      setSelectedCapsules([]);
      
      // Clear selected capsules based on deleteChoice
      if (deleteChoice) {
        setSelectedCapsules([]);
        removeCapsules(capsuleList.map(capsule => capsule.id));
      } else {
        const capsuleIdsToRemove = selectedCapsules.map(capsule => capsule.id);
        removeCapsules(capsuleIdsToRemove);
      }

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
                <Picker.Item key={location.id} label={location.id} value={location.id} />
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
