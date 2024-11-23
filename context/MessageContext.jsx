import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext';
import { useCapsuleList } from './CapsuleListContext';
import { useUpcomingHelloes } from './UpcomingHelloesContext';


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
    const { upcomingHelloesIsFetching, upcomingHelloesIsSuccess, newSuccess } = useUpcomingHelloes();
    const { authUserState, signinMutation } = useAuthUser(); 

    const [messageData, setMessageData] = useState({
    result: false,
    resultData: null,
    resultsMessage: '',
  });

  const [isFetchingData, setFetchingData ] = useState({fetching: false});


  const passToSpinner = (fetching) => {
    setFetchingData({fetching: fetching});
    console.log(fetching);
  };

  const killSpinner = () => {
    setFetchingData({fetching: false});
  };

  const showMessage = (result, resultData, resultsMessage = 'Action successful') => {
    setMessageData({ result, resultData, resultsMessage });
 
};

  const hideMessage = () => {
    setMessageData({ result: null, resultData: null, resultsMessage: '' });
  
};

useEffect(() => {
  if (upcomingHelloesIsFetching) {
    passToSpinner(upcomingHelloesIsFetching);
  } else {
    killSpinner();
  }
}, [upcomingHelloesIsFetching]);

useEffect(() => {
  if (upcomingHelloesIsSuccess) {
      showMessage(true, null, `Next helloes are up to date!`);
  }
}, [upcomingHelloesIsSuccess]);


useEffect(() => {
  if (signinMutation.isFetching) {
    passToSpinner(signinMutation.isFetching);
  } else {
    killSpinner();
  }
}, [signinMutation]);

useEffect(() => {
  if (signinMutation.isSuccess && authUserState?.authenticated && authUserState?.user) {
      showMessage(true, null, `Signed in as ${authUserState.user.username}!`);
  } 
}, [signinMutation]);

useEffect(() => {
  if (signinMutation.isError) {
      showMessage(true, null, 'Oops! Could not sign in.');
  }
}, [signinMutation]);


useEffect(() => {
  if (createMomentMutation.isFetching) {
    passToSpinner(createMomentMutation.isFetching);
  } else {
    killSpinner();
  }
}, [createMomentMutation]);

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
    <MessageContext.Provider value={{ messageData, showMessage, hideMessage, passToSpinner, killSpinner, isFetchingData }}>
      {children}
    </MessageContext.Provider>
  );
}; 
 