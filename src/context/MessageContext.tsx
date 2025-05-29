import React, {
  createContext,
  useContext, 
  useLayoutEffect,
  ReactNode,
} from "react";
import { useUser } from "./UserContext";  
import { useSharedValue, SharedValue, runOnUI } from "react-native-reanimated";

interface MessageData {
  result: boolean | null;
  resultData: any;
  resultsMessage: string;
}

interface MessageContextType {
  messageQueue: SharedValue<MessageData[]>;


  // all messages are called locally in screen/subscreens inside of useEffects; 
  // will NOT work properly in a context component, including this one
  showMessage: (
    result: boolean,
    resultData: any,
    resultsMessage?: string
  ) => void;
  hideMessage: () => void;
  removeMessage: () => void; // Removes message from the queue
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error(
      "useAppMessage must be used within an AppMessageContextProvider"
    );
  }
  return context;
};

interface MessageContextProviderProps {
  children: ReactNode;
}
export const MessageContextProvider: React.FC<MessageContextProviderProps> = ({
  children,
}) => {
  // const [messageQueue, setMessageQueue] = useState<MessageData[]>([]);
  const messageQueue = useSharedValue<MessageData[]>([]);

    
  const { signinMutation } = useUser();

const showMessage = (
  result: boolean,
  resultData: any,
  resultsMessage = "Action successful",
  // buttonPress: (() => void) | null = null,
  // buttonLabel = "",
  duration = 2000,
  delay = 4000 //400
) => {
  const newMessage = {
    result,
    resultData,
    resultsMessage,
    // buttonPress,
    // buttonLabel,
  };

  runOnUI(() => {
  messageQueue.value = [...messageQueue.value, newMessage];
})();
  // messageQueue.value = [...messageQueue.value, newMessage];

  // Automatically remove after duration + delay
  setTimeout(() => {
    removeMessage();
  }, duration + delay);
};

 
  const hideMessage = () => {
    messageQueue.value = ([]);
  };

const removeMessage = () => {
  runOnUI(() => {
     messageQueue.value = messageQueue.value.slice(1); // moved back here from ResultMessage
  })();
};
 
  useLayoutEffect(() => {
    if (signinMutation.isError) {
      showMessage(true, null, "Oops! Could not sign in.");
    }
  }, [signinMutation]);


  return (
    <MessageContext.Provider
      value={{ messageQueue, showMessage, hideMessage, removeMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
};
