import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native'; 
import ImageView from '../components/ImageView';
import useImageFunctions from '../hooks/useImageFunctions';
import { useMessage } from '../context/MessageContext';

import NavigationArrows from '../components/NavigationArrows'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ImagesNavigator = ({ archived = false, image, onClose }) => {

  const [isModalVisible, setIsModalVisible] = useState(true);
  
 
  const { imageList, updateImage, deleteImage, deleteImageMutation } = useImageFunctions(); 
  const { showMessage } = useMessage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { themeStyles } = useGlobalStyle();  
  const [ imageInView, setImageInView ] = useState(image || null);
 
  useEffect(() => {
    if (image) { 
      const index = imageList.findIndex(im => im.id === image.id);
      setCurrentIndex(index); 
      console.log('image index: ', index)
      setImageInView(image);
    }
  }, [image]);


  //manually closing this for right now because I give up
 useEffect(() => { 
    if (deleteImageMutation.isSuccess) {
        //the length of the list is the old length before the deleted one is removed
        //i don't like this
        console.log('image count: ', imageList.length);
        if (imageList.length > 1) {
            if (currentIndex > 0) {
                goToPreviousImage();
            } else {
                goToNextImage();
            }
        } else {
            onClose();     
        }
     }
  
   }, [deleteImageMutation.isSuccess]);



 
   

  const goToPreviousImage = () => {
    //console.log('go to previous image: ', currentIndex - 1);
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      //console.log(imageList[currentIndex - 1]);
      setImageInView(imageList[currentIndex - 1]);

    }
  };

  const goToNextImage = () => {
    if (currentIndex < imageList.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      //console.log(imageList[currentIndex + 1]);
      setImageInView(imageList[currentIndex + 1]);
    }
  };
 

  const handleDelete = (item) => {
    try { 

    deleteImage(item.id); 
   } catch (error) {
    console.log('error, image not deleted: ', error, item);
   }

};
 
 

    //  deleteMomentRQuery(momentData);  
   // } catch (error) { 
   //   console.error('Error deleting moment:', error);
   // }  
 // }; 


  return (
    <View>
  
      <ImageView
        onSliderPull={handleDelete} 
        isModalVisible={isModalVisible} 
        toggleModal={onClose}
        imageData={imageInView || null}
        navigationArrows={
          imageList[currentIndex] ? ( 
            <>
            {imageInView && (
              <>
                {imageList && imageInView && (
                  <NavigationArrows 
                    currentIndex={currentIndex}
                    imageListLength={imageList.length}
                    onPrevPress={goToPreviousImage}
                    onNextPress={goToNextImage}
                  />
                )} 
              </>
              )}
              
            </>
          ) : null
        }
        modalTitle='View image'
      /> 
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    zIndex: 0,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',  
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  
  modalContent: {
    width: '100%', 
    padding: 20, 
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 20,
    paddingVertical: 20,
    fontFamily: 'Poppins-Bold', 
  },
  momentText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    padding: 20,
    borderRadius: 30, 
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  confirmationText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 0,
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
  }, 
  momentContainer: {
    flex: 1,
    width: '100%', 
    padding: 10,
    borderRadius: 20, 
    justifyContent: 'flex-start',
  }, 
  footerContainer: { 
    justifyContent: 'space-between', 
    width: '100%',
    padding: 10,  
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
});

export default ImagesNavigator;
