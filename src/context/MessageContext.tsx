import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useCapsuleList } from './CapsuleListContext'; 
import { useUpcomingHelloes } from './UpcomingHelloesContext';

interface MessageData {
  result: boolean | null;
  resultData: any;
  resultsMessage: string;
}


interface MessageContextType {
  messageQueue: MessageData[]; // Now it's a queue (array)
  showAppMessage: (result: boolean, resultData: any, resultsMessage?: string) => void;
  hideAppMessage: () => void;
  removeMessage: () => void; // Removes message from the queue
} 

const MessageContext = createContext<MessageContextType | undefined>(undefined);


export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useAppMessage must be used within an AppMessageContextProvider');
  }
  return context;
};
 


interface MessageContextProviderProps {
  children: ReactNode;
}
export const MessageContextProvider: React.FC<MessageContextProviderProps> = ({ children }) => {
  const [messageQueue, setMessageQueue] = useState<MessageData[]>([]);

    const { createMomentMutation, updateCapsuleMutation, deleteMomentMutation } = useCapsuleList();
    const { upcomingHelloesIsSuccess } = useUpcomingHelloes();
    const {  signinMutation } = useUser(); 


    const showMessage = (
      result: boolean,
      resultData: any,
      resultsMessage = 'Action successful',
      buttonPress: (() => void) | null = null,
      buttonLabel = ''
    ) => {
  
      setMessageQueue(prevQueue => [...prevQueue, { result, resultData, resultsMessage, buttonPress, buttonLabel }]);
    };
  
    const hideMessage = () => {
      setMessageQueue([]);
    };
  
    const removeMessage = () => {
      setMessageQueue(prevQueue => prevQueue.slice(1));  
    };
  
  

useEffect(() => {
  if (upcomingHelloesIsSuccess) {
      showMessage(true, null, `Next helloes are up to date!`);
  }
}, [upcomingHelloesIsSuccess]); 

useEffect(() => {
  if (signinMutation.isError) {
      showMessage(true, null, 'Oops! Could not sign in.');
  }
}, [signinMutation]);
 

useEffect(() => {
    if (createMomentMutation.isSuccess) {
        showMessage(true, null, 'Moment saved!');
    }
}, [createMomentMutation]);


useEffect(() => {
  if (createMomentMutation.isError) {
      showMessage(true, null, '!! Moment could not be saved. Please try again.');
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
  if (updateCapsuleMutation.isError) {
      showMessage(true, null, '!! Moment could not be sent.');
  }
}, [updateCapsuleMutation]);



  return (
    <MessageContext.Provider value={{ messageQueue, showMessage, hideMessage, removeMessage }}>
      {children}
    </MessageContext.Provider>
  );
}; 
 