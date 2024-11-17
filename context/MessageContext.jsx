import React, { createContext, useState, useContext, useEffect } from 'react';
import { useCapsuleList } from './CapsuleListContext';
import { useImageList } from './ImageListContext';
import { useLocationList } from './LocationListContext';


const MessageContext = createContext();
 


export const useMessage = () => {
    const context = useContext(MessageContext);

    if (!context) {
        throw new Error('Error, no context in useMessage');
    }

    return context;
};

export const MessageContextProvider = ({ children }) => {
  
    const { createMomentMutation, updateCapsuleMutation, deleteMomentMutation } = useCapsuleList();
    const { createImageMutation, deleteImageMutation } = useImageList();
    const { createLocationMutation,  deleteLocationMutation } = useLocationList();

    const [messageData, setMessageData] = useState({
    result: false,
    resultData: null,
    resultsMessage: '',
  });



  const showMessage = (result, resultData, resultsMessage = 'Action successful') => {
    setMessageData({ result, resultData, resultsMessage });
 
};

  const hideMessage = () => {
    setMessageData({ result: null, resultData: null, resultsMessage: '' });
  
};

useEffect(() => {
    if (createMomentMutation.isSuccess) {
        showMessage(true, null, 'Moment saved!');
    }
}, [createMomentMutation]);

useEffect(() => {
    if (deleteMomentMutation.isSuccess) {
        showMessage(true, null, "Moment deleted!");
    }

}, [deleteMomentMutation]);

useEffect(() => {
    if (updateCapsuleMutation.isSuccess) {
        showMessage(true, null, 'Moment sent to hello!');
    }
}, [updateCapsuleMutation]);


useEffect(() => {
    if (createImageMutation.isSuccess) {
        showMessage(true, null, 'Image uploaded!');
    }
}, [createImageMutation]);


useEffect(() => {
    if (deleteImageMutation.isSuccess) {
        showMessage(true, null, 'Image deleted!');
    }
}, [deleteImageMutation]);


useEffect(() => {
    if (createLocationMutation.isSuccess) {
        showMessage(true, null, 'Location added!');
    }
}, [createLocationMutation]);


useEffect(() => {
    if (deleteLocationMutation.isSuccess) {
        showMessage(true, null, 'Location deleted!');
    }
}, [deleteLocationMutation]);



  return (
    <MessageContext.Provider value={{ messageData, showMessage, hideMessage }}>
      {children}
    </MessageContext.Provider>
  );
}; 
 