import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native'; 
import ImageView from '../components/ImageView';
import useImageFunctions from '../hooks/useImageFunctions';

import useHelloesData from '../hooks/useHelloesData';

import { useMessage } from '../context/MessageContext';

import HelloView from '../components/HelloView';

import NavigationArrows from '../components/NavigationArrows'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';

const HelloesNavigator = ({ archived = false, hello, onClose }) => {

  const [isModalVisible, setIsModalVisible] = useState(true);

  
  const { helloesList, inPersonHelloes, flattenHelloes } = useHelloesData();
  
 
  const { imageList, updateImage, deleteImage, deleteImageMutation } = useImageFunctions(); 
  const { showMessage } = useMessage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { themeStyles } = useGlobalStyle();  
  const [ helloInView, setHelloInView ] = useState(hello || null);
 
  useEffect(() => {
    if (hello) { 
      const index = helloesList.findIndex(helloListItem => helloListItem.id === hello.id);
      setCurrentIndex(index); 
      console.log('hello index: ', index)
      setHelloInView(hello);
    }
  }, [hello]);


  //manually closing this for right now because I give up
 useEffect(() => { 
    if (deleteImageMutation.isSuccess) {
        //the length of the list is the old length before the deleted one is removed
        //i don't like this
        console.log('image count: ', imageList.length);
        if (imageList.length > 1) {
            if (currentIndex > 0) {
                goToPreviousHello();
            } else {
                goToNextHello();
            }
        } else {
            onClose();     
        }
     }
  
   }, [deleteImageMutation.isSuccess]);



 
   

  const goToPreviousHello = () => {
     if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1); 
      setHelloInView(helloesList[currentIndex - 1]);

    }
  };

  const goToNextHello = () => {
    if (currentIndex < helloesList.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1); 
      setHelloInView(helloesList[currentIndex + 1]);
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
  
      <HelloView
        onSliderPull={handleDelete} 
        isModalVisible={isModalVisible} 
        toggleModal={onClose}
        helloData={helloInView || null}
        navigationArrows={
          helloesList[currentIndex] ? ( 
            <>
            {helloInView && (
              <>
                {helloesList && helloInView && (
                  <NavigationArrows 
                    currentIndex={currentIndex}
                    imageListLength={helloesList.length}
                    onPrevPress={goToPreviousHello}
                    onNextPress={goToNextHello}
                  />
                )} 
              </>
              )}
              
            </>
          ) : null
        }
        modalTitle='View Hello'
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

export default HelloesNavigator;
