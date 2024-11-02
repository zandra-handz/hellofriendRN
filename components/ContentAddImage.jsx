import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';


import ButtonBaseSpecialSave from '../components/ButtonBaseSpecialSave';

import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import PickerBinary from '../components/PickerBinary';
import InputSingleValue from '../components/InputSingleValue';
import FriendSelectModalVersionButtonOnly from '../components/FriendSelectModalVersionButtonOnly';
 
import CameraCuteSvg from '../assets/svgs/camera-cute.svg';
import UploadCurlySvg from '../assets/svgs/upload-curly.svg'; 
import LoadingPage from '../components/LoadingPage';

import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useImageList } from '../context/ImageListContext';
import { useFriendList } from '../context/FriendListContext';  
import { LinearGradient } from 'expo-linear-gradient';


import * as ImageManipulator from 'expo-image-manipulator';


const ContentAddImage = () => {
  const { themeStyles } = useGlobalStyle();
  const { authUserState } = useAuthUser(); 
  const { selectedFriend, friendColorTheme, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();
  const [canContinue, setCanContinue] = useState('');
  const { themeAheadOfLoading } = useFriendList();
  const [imageUri, setImageUri] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [imageCategory, setImageCategory] = useState('Misc');
  const [firstSectionTitle, setFirstSectionTitle] = useState('For: ');
 

  const delayForResultsMessage = 2000;
  
  const imageTitleRef = useRef(null); 
  const imageCategoryRef = useRef(null); 
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [ resultMessage, setResultMessage ] = useState(null);
  const [ gettingResultMessage, setGettingResultMessage ] = useState(null);


  const { createImage } = useImageList();

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

 
const resizeImage = async (imageUri) => {
  // Get the original dimensions of the image
  const imageInfo = await FileSystem.getInfoAsync(imageUri);
  const { width: originalWidth, height: originalHeight } = await ImageManipulator.manipulateAsync(
    imageUri,
    []
  ).then(result => result);

  const targetWidth = 800; // Desired width
  const aspectRatio = originalHeight / originalWidth; // Calculate aspect ratio
  const targetHeight = Math.round(targetWidth * aspectRatio); // Adjust height based on aspect ratio

  const manipResult = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: targetWidth, height: targetHeight } }], // Apply proportional resize
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG } // Set quality and format
  );

  return manipResult;
};

const handleSave = async () => {
  setSaveInProgress(true);
  setGettingResultMessage(true);

  if (imageUri && imageTitle.trim() && selectedFriend && authUserState.user) {
    try { 
      // Resize the image before saving
      const manipResult = await resizeImage(imageUri); // Use resizeImage function here

      const formData = new FormData();
      const fileType = manipResult.uri.split('.').pop(); // Extract file type from URI

      formData.append('image', {
        uri: manipResult.uri,
        name: `image.${fileType}`,
        type: `image/${fileType}`,
      });
      formData.append('title', imageTitle.trim());
      formData.append('image_category', imageCategory.trim());
      formData.append('image_notes', '');
      formData.append('friend', selectedFriend.id);
      formData.append('user', authUserState.user.id);
      formData.append('thought_capsules', '');

      await createImage(formData);

      setResultMessage('Image saved!');

      let timeout;
      timeout = setTimeout(() => {
        setGettingResultMessage(false);
        handleModalClose();
      }, delayForResultsMessage);
      return () => clearTimeout(timeout);

    } catch (error) {
      console.error('Error saving image:', error);
      setResultMessage('Error! Could not save image');
      setGettingResultMessage(true);
      let timeout = setTimeout(() => {
        setGettingResultMessage(false);
      }, delayForResultsMessage);
      return () => clearTimeout(timeout);
    } finally {
      setSaveInProgress(false);
    }
  }

  setSaveInProgress(false);
};
  

  const handleModalClose = () => { 
    try {
      setImageUri(null);
      setImageTitle('');
      setImageCategory('Misc'); 
    } catch (e) {
      console.log('Error closing image modal: ', e);
    }
    
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust if needed
    >
      <LinearGradient
          colors={[friendColorTheme?.useFriendColorTheme ? themeAheadOfLoading.darkColor : '#4caf50', friendColorTheme?.useFriendColorTheme  ? themeAheadOfLoading.lightColor : 'rgb(160, 241, 67)']}  
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}  
          style={{flex: 1}} 
        > 
      {gettingResultMessage && (
        <View style={styles.loadingWrapper}>
          <LoadingPage
            loading={saveInProgress}
            resultsMessage={resultMessage}
            spinnnerType='wander'
            includeLabel={true}
            label="Saving image..."
          />
        </View>
      )}
  
      {!gettingResultMessage && (  
        <>

<       View style={{width: '100%', flex: 1, flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '28%'}}> 
 
        <View style={[styles.selectFriendContainer, {marginBottom: '2%'}]}> 
          <FriendSelectModalVersionButtonOnly includeLabel={true} width='100%' />
        </View>
    
  
      <View style={[styles.backColorContainer, themeStyles.genericTextBackground, {borderColor: themeAheadOfLoading.lightColor}]}>
            
      {imageUri && (
        <>
          <View style={styles.previewContainer}>
            <View style={[styles.previewImageContainer, themeStyles.genericTextBackgroundShadeTwo]}>
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            </View>
          </View>
  
          <View style={styles.inputContainer}>
            <View style={{paddingBottom: 6}}> 
            <InputSingleValue
              valueRef={imageTitleRef}
              handleValueChange={handleImageTitleChange}
              label=''
              placeholder='Title'
            />
            </View>
            <View> 
            <InputSingleValue
              valueRef={imageCategoryRef}
              handleValueChange={handleImageCategoryChange}
              label=''
              placeholder='Category'
            />
            </View>
          </View>
        </>
      )}
  
      {!imageUri && (
        <View style={styles.pickerContainer}>
          <PickerBinary
            onPressRight={handleSelectImage}
            onPressLeft={handleCaptureImage}
            LeftSvg={CameraCuteSvg}
            RightSvg={UploadCurlySvg}
            leftLabel='Camera'
            rightLabel='Upload'
            leftLabelPosition='above'
            rightLabelPosition='above'
            containerText=""
          />
        </View>
      )}
      </View>
  

      
      </View>
      </>
    )}
          <View style={styles.buttonContainer}>
        {selectedFriend && canContinue && imageUri ? (  
          <ButtonBaseSpecialSave
            label='SAVE IMAGE  '
            maxHeight={80}
            onPress={handleSave} 
            isDisabled={false}
            image={require("../assets/shapes/redheadcoffee.png")}
            
          />
        ) : (
          <ButtonBaseSpecialSave
            onPress={() => {}}
            label='ADD IMAGE  '
            isDisabled={true}  
            
          />
        )}
      </View>
    </LinearGradient>
    </KeyboardAvoidingView>
  );
  

};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    width: '100%',
    justifyContent: 'space-between',
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {   
    width: '100%',    
  }, 
  backColorContainer: {  
    minHeight: '98%',
    alignContent: 'center',
    paddingHorizontal: '4%',
    paddingTop: '8%',
    paddingBottom: '32%', 
    width: '101%',
    alignSelf: 'center',
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  selectFriendContainer: {   
    width: '100%',   
    justifyContent: 'center',
    minHeight: 30, 
    maxHeight: 30,
    height: 30,
  },
  buttonContainer: { 
    width: '104%', 
    height: 'auto',
    position: 'absolute',
    bottom: -10,
    flex: 1,
    right: -2,
    left: -2,
  }, 
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4,
  },

  previewImageContainer: { 
    borderRadius: 10,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewImage: {
    width: '100%', 
    minHeight: 170,
    height: 'auto',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  inputContainer: { 
    width: '100%', 
    height: 'auto',
    flex: 1,  
    alignContent: 'center',
    paddingBottom: 10, 
  },
});


export default ContentAddImage;
