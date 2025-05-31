import React, {  useEffect  } from "react"; 
import useImageUploadFunctions from '@/src/hooks/useImageUploadFunctions'; 
import SpeedDial from "../buttons/speeddial/SpeedDial";
import ImageGalleryOutlineSvg from "@/app/assets/svgs/image-gallery-outline.svg";
import CameraMinimalisticSvg from "@/app/assets/svgs/camera-minimalistic.svg"; 
import UploadMinimalisticSvg from '@/app/assets/svgs/upload-minimalistic.svg';
import { useNavigation } from "@react-navigation/native";

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
    <SpeedDial
    rootIcon={ImageGalleryOutlineSvg}
    topIcon={CameraMinimalisticSvg}
    topOnPress={() => handleCaptureImage()}
    midIcon={UploadMinimalisticSvg}
    midOnPress={() =>  handleSelectImage()}
    // topMidIconSize={32}
    // topMidDiameter={58}
      />
  );
};
 

export default ImageMenuButton;
