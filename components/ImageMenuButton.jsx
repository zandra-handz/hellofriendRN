import React, { useState, useEffect, useRef } from "react"; 

import useImageUploadFunctions from '../hooks/useImageUploadFunctions'; 

import AnimatedSpeedDialTemplate from '../components/AnimatedSpeedDialTemplate';

import ImageGallerySingleOutlineSvg from "../assets/svgs/image-gallery-single-outline.svg";
import ImageGalleryOutlineSvg from "../assets/svgs/image-gallery-outline.svg";
import CameraMinimalisticSvg from "../assets/svgs/camera-minimalistic.svg";
import UploadCloudArrowOutlineSvg from '../assets/svgs/upload-cloud-arrow-outline.svg'; //if root button changed to plain plus sign or something then this might work
import UploadMinimalisticSvg from '../assets/svgs/upload-minimalistic.svg';

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
