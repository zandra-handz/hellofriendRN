import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createFriendImage } from '../api'; // Import your API function
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const QuickAddImage = () => {
  const { authUserState } = useAuthUser();
  const { selectedFriend } = useSelectedFriend();
  const [imageUri, setImageUri] = useState(null);
  const [title, setTitle] = useState('');
  const [imageCategory, setImageCategory] = useState('Misc');

  useEffect(() => {
    if (selectedFriend) {
      console.log("Selected friend:", selectedFriend);
    }
  }, [selectedFriend]);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const handleCaptureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCreateImage = async () => {
    if (imageUri && title.trim() && selectedFriend && authUserState.user) {
      try {
        // Create FormData object
        const formData = new FormData();
  
        // Append image data
        const imageUriParts = imageUri.split('.');
        const fileType = imageUriParts[imageUriParts.length - 1];
        formData.append('image', {
          uri: imageUri,
          name: `image.${fileType}`,
          type: `image/${fileType}`,
        });
  
        // Append other fields
        formData.append('title', title.trim());
        formData.append('image_category', imageCategory.trim());
        formData.append('image_notes', ''); // Adjust as needed
        formData.append('friend', selectedFriend.id);
        formData.append('user', authUserState.user.id);
        formData.append('thought_capsules', ''); // Adjust as needed
  
        console.log('FormData before sending:', formData);
  
        const response = await createFriendImage(selectedFriend.id, formData);
        console.log('Image created successfully:', response);
  
        // Optionally clear the image URI state or handle the response
        setImageUri(null);
        setTitle('');
        setImageCategory('Misc');
        // Handle success as needed
      } catch (error) {
        console.error('Error creating image:', error);
        Alert.alert('Error', 'Error creating image.');
      }
    } else {
      Alert.alert('Error', 'Image, title, friend, and user are required.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        {selectedFriend ? (
          <>
            <Text style={styles.title}>Upload Image for {selectedFriend.name}</Text>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            <TouchableOpacity style={styles.button} onPress={handleCaptureImage}>
              <Text style={styles.buttonText}>Capture Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
              <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Image Category"
              value={imageCategory}
              onChangeText={setImageCategory}
            />
            <TouchableOpacity style={styles.createButton} onPress={handleCreateImage}>
              <Text style={styles.buttonText}>Create Image</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.title}>Please select a friend first</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  createButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    marginBottom: 200,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
});

export default QuickAddImage;