import React, { createContext, useState, useContext, useEffect } from 'react';
import { useCapsuleList } from './CapsuleListContext';


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



  return (
    <MessageContext.Provider value={{ messageData, showMessage, hideMessage }}>
      {children}
    </MessageContext.Provider>
  );
}; 
 