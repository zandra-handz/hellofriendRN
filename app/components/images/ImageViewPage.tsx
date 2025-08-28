import { View, Text, DimensionValue, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image"; 


import Animated, {
  SharedValue,
  useAnimatedStyle,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";

interface ImageViewPageProps {
  item: object;
  index: number;
  width: DimensionValue;
  height: DimensionValue;
  currentIndexValue: SharedValue;
  cardScaleValue: SharedValue;
  openModal: () => void;
  closeModal: () => void;
}

const ImageViewPage: React.FC<ImageViewPageProps> = ({
  item,
  index,
  width,
  height,
  currentIndexValue,
  cardScaleValue,
}) => {
  const { themeStyles, appFontStyles } = useGlobalStyle(); 
  const navigation = useNavigation();

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const handleEditMoment = () => {
    navigation.navigate("MomentFocus", {
      momentText: item?.capsule || null,
      updateExistingMoment: true,
      existingMomentObject: item || null,
    });
  };


  // don't think i need this... this is just for viewed items whose index changes due to edits
    const [currentIndex, setCurrentIndex] = useState();
  
    useAnimatedReaction(
      () => currentIndexValue.value,
      (newIndex, prevIndex) => {
        if (newIndex !== prevIndex) {
          runOnJS(setCurrentIndex)(newIndex);
        }
      },
      []
    );
  

      const cardScaleAnimation = useAnimatedStyle(() => ({
        transform: [{ scale: cardScaleValue.value }],
      }));
    

  return (
    <Animated.View
      style={[
        cardScaleAnimation,
        {
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          padding: 4,
          borderWidth: 0, 
          width: width,
        },
      ]}
    >
      <View
        style={{
         // backgroundColor: themeStyles.primaryBackground.backgroundColor,
          backgroundColor: 'transparent',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: 0,
          borderRadius: 10,
          width: "100%",
          height: "100%",
          zIndex: 1,
          overflow: "hidden",
        
        }}
      > 

        <View style={[  ]}>
                <View style={{ width: '100%', position: 'absolute'}}>
        <Text style={[themeStyles.primaryText, appFontStyles.welcomeText]}> {item.title}</Text>
        <Text style={themeStyles.primaryText}> {item.category}</Text>
        
        
      </View>
          <Image
            placeholder={{ blurhash }}
            source={{ uri: item.image }}
            style={styles.modalImage}
            contentFit="contain" //switch to cover to see full image
            cachePolicy={"memory-disk"}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
 
  imageContainer: {
    paddingTop: 0,
    width: "100%", 
    flex: 1,
    overflow: "hidden",
    flexDirection: "column",
    borderRadius: 30,
    overflow: 'hidden',
  },    
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginBottom: 0,
    borderRadius: 30,
    overflow: 'hidden',
  }, 
});

export default ImageViewPage;


// OLD CODE TO RE-ADD SHARE FILE FUNCTION INTO ABOVE CODE:

 

// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
 

 

//   useEffect(() => {
//     if (image) {
//       setTitle(image.title);
//       const index = imageList.findIndex(img => img.id === image.id);
//       setCurrentIndex(index);
//     }
//   }, [image]);

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const closeModal = () => {
//     setIsModalVisible(false);
//     setIsEditing(false);
//     onClose();
//   };

//   const handleUpdate = async () => {
//     try {
//       await updateFriendImage(image.friendId, image.id, { title });
//       setIsEditing(false); 
//       onClose();
//     } catch (error) {
//       console.error('Error updating image:', error);
//     }
//   };

//   const toggleModal = () => {
//     setConfirmDeleteModalVisible(!isConfirmDeleteModalVisible);
//   };


//   const handleShare = async () => {
//     if (!imageList[currentIndex].image) {
//       console.error('Error: Image URL is null or undefined');
//       return;
//     }

//     const fileUri = FileSystem.documentDirectory + (imageList[currentIndex].title  || 'shared_image') + '.jpg';
//     const message = "Check out this image!"; 

//     try {
//       const { uri } = await FileSystem.downloadAsync(imageList[currentIndex].image, fileUri);
//       await Sharing.shareAsync(uri);
  
//       setTimeout(async () => {
//         try { 
//           setConfirmDeleteModalVisible(true); 
//         } catch (error) {
//           console.error('Error deleting shared image:', error);
//         }
//       }, 500);  

//     } catch (error) {
//       console.error('Error sharing image:', error);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       setIsDeleting(true);
//       const imageToDelete = imageList[currentIndex];  // Get the correct image to delete based on currentIndex
//       await deleteFriendImage(selectedFriend.id, imageList[currentIndex].id);

//       setSuccessModalVisible(true);  
//     } catch (error) {
//       setFailModalVisible(true);
//       console.error('Error deleting image:', error);
//     } finally {
//       setConfirmDeleteModalVisible(false);
//       setIsDeleting(false);
//     }
//   };

//   const successOk = () => {
//     deleteImage(imageList[currentIndex].image);
//     setUpdateImagesTrigger(prev => !prev);
//     setSuccessModalVisible(false);
//     closeModal();
//   };

  
//   return (
//     <>
//       <AlertImage
//         isModalVisible={isModalVisible}
//         toggleModal={closeModal}
//         modalContent={
//           imageList[currentIndex] ? (
//             <View style={styles.modalContainer}>
//               <View style={styles.container}>
//                 <View style={styles.headerContainer}>
//                   <View style={styles.infoContainer}>
//                     <View style={styles.detailsColumn}>
//                       <Text style={styles.name}>{imageList[currentIndex].title}</Text>
//                       <View style={styles.modalImageContainer}>
//                         <Image
//                           source={{ uri: imageList[currentIndex].image }}
//                           style={styles.modalImage}
//                         />
//                       </View>
//                     </View>
//                   </View>
//                 </View>
//                 <NavigationArrows 
//                   currentIndex={currentIndex}
//                   imageListLength={imageList.length}
//                   onPrevPress={goToPreviousImage}
//                   onNextPress={goToNextImage}
//                 />
//                 <View style={styles.buttonContainer}>
//                   <ItemViewFooter
//                     buttons={[
//                       { label: 'Edit', icon: <EditOutlineSvg width={34} height={34} color='black' />, onPress: handleEdit },
//                       { label: 'Delete', icon: <TrashOutlineSvg width={34} height={34} color='black' />, onPress: toggleModal },
//                     ]}
//                     maxButtons={2} 
//                     showLabels={false}
//                   />
//                 </View>
//               </View>
//               <FooterActionButtons
//                     height='5%'
//                     bottom={30}
//                     backgroundColor='white'
//                     buttons={[
//                       <ButtonSendImageToFriend onPress={handleShare} friendName={selectedFriend.name} />
//                     ]}
//                   />
//             </View>
//           ) : null
//         }
//         modalTitle="View Image"
//       />

//       <AlertConfirm
//         fixedHeight={true}
//         height={330}
//         isModalVisible={isConfirmDeleteModalVisible}
//         questionText="Delete image?"
//         isFetching={isDeleting}
//         useSpinner={true}
//         toggleModal={toggleModal}
//         headerContent={<Text style={{fontFamily: 'Poppins-Bold', fontSize: 18}}>{imageList[currentIndex].title}</Text>}
//         onConfirm={() => handleDelete()} 
//         onCancel={toggleModal}
//         confirmText="Delete"
//         cancelText="Cancel"
//       />

//       <AlertSuccessFail
//         isVisible={isSuccessModalVisible}
//         message='Image has been deleted.'
//         onClose={successOk}
//         type='success'
//       />

//       <AlertSuccessFail
//         isVisible={isFailModalVisible}
//         message='Error deleting image.'
//         onClose={failOk}
//         tryAgain={false} 
//         isFetching={isDeleting}
//         type='failure'
//       />