
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
 
import FriendSelectModalVersion from '../components/FriendSelectModalVersion';
import * as ImagePicker from 'expo-image-picker';
import { createFriendImage } from '../api'; // Import your API function
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useImageList } from '../context/ImageListContext';

import PickerBinary from '../components/PickerBinary';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import CameraCuteSvg from '../assets/svgs/camera-cute.svg';
import UploadCurlySvg from '../assets/svgs/upload-curly.svg';


import CardCategoriesAsButtons from '../components/CardCategoriesAsButtons';

const ContentAddImage = () => {
  const { authUserState } = useAuthUser(); 
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();

  const { setUpdateImagesTrigger } = useImageList();
  const [imageUri, setImageUri] = useState(null);
  const [title, setTitle] = useState('');
  const [imageCategory, setImageCategory] = useState('Misc');
  const [firstSectionTitle, setFirstSectionTitle] = useState('Friend: ');

  const navigation = useNavigation();

  useEffect(() => {
    if (selectedFriend && !loadingNewFriend) {
      setFirstSectionTitle('Friend: ');
    }
  }, [selectedFriend, loadingNewFriend]);


  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);


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


  const handleSave = async () => {
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
        setUpdateImagesTrigger(prev => !prev); 
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
      <View style={styles.mainContainer}>
        <Text style={styles.locationTitle}> </Text>

        <View style={styles.selectFriendContainer}>
        <Text style={styles.locationTitle}>{firstSectionTitle}</Text>

          <FriendSelectModalVersion width='82%' />
        </View>

        <View style={styles.locationContainer}>
          <PickerBinary
          LeftSvg={CameraCuteSvg}
          RightSvg={UploadCurlySvg}
          containerText="Image" />
        </View> 
        { selectedFriend && ( 
          <View style={styles.categoryContainer}>
            <>
            <Text style={styles.locationTitle}>Add image</Text>
            
            </> 
        </View>
        )}
        {selectedFriend && imageUri && ( 
                <View style={styles.bottomButtonContainer}>  
                    <ButtonLottieAnimationSvg
                        onPress={handleSave}
                        preLabel=''
                        label={`Add moment`}
                        height={54}
                        radius={16}
                        fontMargin={3}
                        animationSource={require("../assets/anims/heartinglobe.json")}
                        rightSideAnimation={false}
                        labelFontSize={22}
                        labelColor="white"
                        animationWidth={234}
                        animationHeight={234}
                        labelContainerMarginHorizontal={4}
                        animationMargin={-64}
                        showGradient={true}
                        showShape={true}
                        shapePosition="right"
                        shapeSource={CompassCuteSvg}
                        shapeWidth={100}
                        shapeHeight={100}
                        shapePositionValue={-14}
                        shapePositionValueVertical={-10}
                        showIcon={false}
                    />
            </View> 
            )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    justifyContent: 'space-between',
  },
  mainContainer: {
    flex: 1,
    padding: 0,
    justifyContent: 'space-between',
    paddingBottom: 68,
  },
  locationContainer: { 
    borderRadius: 8,
    top: 70,
    position: 'absolute',
    width: '100%',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.0,
    shadowRadius: 0,
    elevation: 0,
    marginVertical: 10, 
    height: 360,
  },
  categoryContainer: { 
    backgroundColor: '#fff',
    width: '100%', 
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectFriendContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 0, 
    borderRadius: 8,
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginVertical: 8,
    height:' auto',
    zIndex: 1, 
  },
  locationTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
  },
  locationAddress: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  cardContainer: {
    marginVertical: 10,
  },
  previewContainer: {
    marginVertical: 10,
  },
  previewTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    marginBottom: 5,
  },
  inputContainer: {
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  textInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 18,
    padding: 10,
    borderRadius: 20,
    fontFamily: 'Poppins-Regular',
  },
  dateText: { 
    fontSize: 16,
    marginVertical: 14,
    fontFamily: 'Poppins-Bold',
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 20,
  },
  bottomButtonContainer: {
    height: '12%', 
    padding: 0,
    paddingTop: 40,
    top: 660,
    paddingHorizontal: 10,  
    position: 'absolute', 
    zIndex: 1,
    bottom: 0, 
    right: 0,
    left: 0,
  },
});

export default ContentAddImage;
