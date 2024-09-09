import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import { createFriendImage } from '../api';  

import * as ImagePicker from 'expo-image-picker';
import PickerBinary from '../components/PickerBinary';
import InputSingleValue from '../components/InputSingleValue';
import FriendSelectModalVersion from '../components/FriendSelectModalVersion';
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import CameraCuteSvg from '../assets/svgs/camera-cute.svg';
import UploadCurlySvg from '../assets/svgs/upload-curly.svg';
import PhotosTwoSvg from '../assets/svgs/photos-two.svg';
import AlertSuccessFail from '../components/AlertSuccessFail';

import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useImageList } from '../context/ImageListContext';

const ContentAddImage = () => {
  const { authUserState } = useAuthUser(); 
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const [canContinue, setCanContinue] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [imageCategory, setImageCategory] = useState('Misc');
  const [firstSectionTitle, setFirstSectionTitle] = useState('For: ');

  const imageTitleRef = useRef(null); 
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [modalState, setModalState] = useState({ type: '', isVisible: false });

  const { setUpdateImagesTrigger } = useImageList();

  useEffect(() => {
    if (selectedFriend && !loadingNewFriend) {
      setFirstSectionTitle('For: ');
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

  const handleCaptureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleImageTitleChange = (value) => {
    setImageTitle(value);
    setCanContinue(value.length > 0);
  };

  const handleImageCategoryChange = (value) => {
    setImageCategory(value);
    setCanContinue(value.length > 0);
  };

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaveInProgress(true);
    setModalState({ type: 'saving', isVisible: true });

    if (imageUri && imageTitle.trim() && selectedFriend && authUserState.user) {
      try { 
        const formData = new FormData(); 
        const imageUriParts = imageUri.split('.');
        const fileType = imageUriParts[imageUriParts.length - 1];
        formData.append('image', {
          uri: imageUri,
          name: `image.${fileType}`,
          type: `image/${fileType}`,
        });
        formData.append('title', imageTitle.trim());
        formData.append('image_category', imageCategory.trim());
        formData.append('image_notes', '');  
        formData.append('friend', selectedFriend.id);
        formData.append('user', authUserState.user.id);
        formData.append('thought_capsules', '');  

        await createFriendImage(selectedFriend.id, formData);
        setModalState({ type: 'success', isVisible: true });
      } catch (error) {
        console.error('Error creating image:', error); 
        setModalState({ type: 'failure', isVisible: true });
      }
    } 

    setSaveInProgress(false);
  };

  const handleModalClose = () => {
    setModalState({ type: '', isVisible: false });
    if (modalState.type === 'success') {
      setImageUri(null);
      setImageTitle('');
      setImageCategory('Misc');
      setUpdateImagesTrigger(prev => !prev);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.locationTitle}> </Text>

        <View style={styles.selectFriendContainer}>
          <Text style={styles.locationTitle}>{firstSectionTitle}</Text>
          <FriendSelectModalVersion width='88%' />
        </View>

        {imageUri && (
          <View style={styles.previewContainer}> 
            <View style={styles.previewTitleContainer}>
              <Text style={styles.previewTitle}>Image:</Text>
            </View>
            <View style={styles.previewImageContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
              />
            </View>
            <InputSingleValue
              valueRef={imageTitleRef}
              handleValueChange={handleImageTitleChange}
              label='Title'
              placeholder='Enter here'
            />
            <InputSingleValue
              valueRef={imageTitleRef}
              handleValueChange={handleImageCategoryChange}
              label='Category'
              placeholder='Enter here'
            />
          </View>
        )}

        <View style={styles.locationContainer}>
          <PickerBinary
            onPressRight={handleSelectImage}
            onPressLeft={handleCaptureImage}
            LeftSvg={CameraCuteSvg}
            RightSvg={UploadCurlySvg}
            leftLabel='Camera'  
            rightLabel='Upload' 
            leftLabelPosition='above'  
            rightLabelPosition='above'
            containerText="Image: " 
          />
        </View>

        {selectedFriend && canContinue && imageUri && ( 
          <View style={styles.bottomButtonContainer}>  
            <ButtonBottomActionBase
              onPress={handleSave}
              preLabel=''
              label={`Upload image`}
              height={54}
              radius={16}
              fontMargin={3} 
              labelFontSize={22}
              labelColor="white" 
              labelContainerMarginHorizontal={4} 
              showGradient={true}
              showShape={true}
              shapePosition="right"
              shapeSource={PhotosTwoSvg}
              shapeWidth={90}
              shapeHeight={90}
              shapePositionValue={-14}
              shapePositionValueVertical={-10} 
            />
          </View> 
        )}
      </View>

      <AlertSuccessFail
        isVisible={modalState.isVisible}
        type={modalState.type}
        message={modalState.type === 'success' ? 'Image uploaded!' : 'Could not upload image.'}
        onClose={handleModalClose}
        autoclose={modalState.type === 'saving'}
        saveStatus={saveInProgress}
        tryAgain={modalState.type === 'failure'}
        onRetry={handleSave}
      />
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
    top: 50,
    position: 'absolute',
    width: '100%',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.0,
    shadowRadius: 0,
    elevation: 0,
    marginVertical: 10, 
    height: 200,
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
  previewContainer: {
    borderRadius: 8,
    top: 60,
    position: 'absolute',
    width: '100%',
    flexDirection: 'column',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.0,
    shadowRadius: 0,
    elevation: 0,
    marginVertical: 0, 
    justifyContent: 'space-between',
    height:300,
    alignItems: 'center',
    width: '100%',
    zIndex: 2,
    backgroundColor: 'white',
  },
  previewImageContainer: { 
    paddingVertical: 10,

  },
  previewTitleContainer: {
    width: '100%',
    textAlign: 'left',

  },
  previewTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold', 

  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
});

export default ContentAddImage;
