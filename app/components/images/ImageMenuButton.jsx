import React, {  useEffect  } from "react"; 

import useImageUploadFunctions from '@/src/hooks/useImageUploadFunctions'; 

import AnimatedSpeedDialTemplate from '../foranimations/AnimatedSpeedDialTemplate';
 
import ImageGalleryOutlineSvg from "@/app/assets/svgs/image-gallery-outline.svg";
import CameraMinimalisticSvg from "@/app/assets/svgs/camera-minimalistic.svg"; 
import UploadMinimalisticSvg from '@/app/assets/svgs/upload-minimalistic.svg';

import { useNavigation

 } from "@react-navigation/native";
const ImageMenuButton = () => { 
  
  const navigation = useNavigation();
  const { requestPermission, imageUri, resizeImage, handleCaptureImage, handleSelectImage} = useImageUploadFunctions();
  
  const navigateToAddImageScreen = () => {
    navigation.navigate('AddImage', {imageUri: imageUri});

  };

   useEffect(() => {
     requestPermission();
   }, []);

   useEffect(() => {
     if (imageUri) {
       navigateToAddImageScreen();
     }
   
   }, [imageUri]);
   

  return (
    <AnimatedSpeedDialTemplate
    rootButtonIcon={ImageGalleryOutlineSvg}
    topOptionIcon={CameraMinimalisticSvg}
    topOptionOnPress={() => handleCaptureImage()}
    secondTopOptionIcon={UploadMinimalisticSvg}
    secondTopOptionOnPress={() =>  handleSelectImage()}
    optionButtonIconSize={32}
    optionButtonDiameter={58}
    animatedHeightTopOption={-60}
    animatedHeightSecondTopOption={-38} />
  );
};
 

export default ImageMenuButton;
