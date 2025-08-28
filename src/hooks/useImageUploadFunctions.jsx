import React, {  useState } from 'react';
 
 
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
 

import * as ImageManipulator from 'expo-image-manipulator';
 

// HAS ALL UPLOAD FORMATTING CODING
const useImageUploadFunctions = () => {


  const navigation = useNavigation();

    const [imageUri, setImageUri] = useState(null);

      const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      };


      const handleCaptureImage = async () => {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.cancelled) {
          // setImageUri(result.assets[0].uri);
          navigation.navigate('AddImage', {imageUri: result.assets[0].uri });
        }
      };


        const handleSelectImage = async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          });
      
          if (!result.cancelled) {
           // setImageUri(result.assets[0].uri);
            navigation.navigate('AddImage', {imageUri: result.assets[0].uri });
          }
        };


        const resizeImage = async (imageUri) => { 
          const imageInfo = await FileSystem.getInfoAsync(imageUri);
          const { width: originalWidth, height: originalHeight } = await ImageManipulator.manipulateAsync(
            imageUri,
            []
          ).then(result => result);
        
          const targetWidth = 800; 
          const aspectRatio = originalHeight / originalWidth;  
          const targetHeight = Math.round(targetWidth * aspectRatio); 
        
          const manipResult = await ImageManipulator.manipulateAsync(
            imageUri,
            [{ resize: { width: targetWidth, height: targetHeight } }],  
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }  
          );
        
          return manipResult;
        };
      
    



    return({

        requestPermission,
        imageUri,
        handleCaptureImage,
        handleSelectImage,
        resizeImage,

})

};

export default useImageUploadFunctions;