import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import image picker from Expo
import { createFriendImage } from '../api'; // Import your API function

const ImageUploadScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageCategory, setImageCategory] = useState('');
  const [title, setTitle] = useState('');
  const [imageNotes, setImageNotes] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result);
    }
  };

  const handleSave = async () => {
    if (selectedImage) {
      try {
        const imageData = {
          uri: selectedImage.uri,
          image_category: imageCategory.trim() || 'Misc', // Default to 'Misc' if empty
          title: title.trim(), // Ensure no leading/trailing whitespace
          image_notes: imageNotes.trim() || null, // Allow image_notes to be null
          friend: 'friend_id_here', // Replace with actual friend ID
          user: 'user_id_here', // Replace with actual user ID if needed
          // thought_capsule: 'ID_of_capsule_if_needed', // Uncomment if needed
        };

        await createFriendImage('friend_id_here', imageData); // Replace with actual friend ID

        // Handle success, navigate or update UI accordingly
        console.log('Image saved successfully!');
      } catch (error) {
        console.error('Error saving image:', error);
        // Handle error, show error message to user
      }
    }
  };

  return (
    <View style={styles.container}>
      {selectedImage && (
        <Image source={{ uri: selectedImage.uri }} style={styles.image} />
      )}
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <TextInput
        style={styles.input}
        placeholder="Image Category"
        value={imageCategory}
        onChangeText={text => setImageCategory(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={text => setTitle(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Image Notes"
        value={imageNotes}
        onChangeText={text => setImageNotes(text)}
      />
      {selectedImage && (
        <Button title="Save Image" onPress={handleSave} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
});

export default ImageUploadScreen;
