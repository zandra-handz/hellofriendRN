import RootSiblings from "react-native-root-siblings";
import React from "react"; 
import HelperMessage from "@/app/components/alerts/HelperMessage";

let currentSibling: RootSiblings | null = null;

export const showHelperMessage = (message: string, error: boolean, duration = 2000) => {
  const triggerKey = Date.now();

  if (currentSibling) {
    console.log('current sibling detected!');
    // Instead of destroying and recreating, just update the existing sibling
    currentSibling.update(
      <HelperMessage
   
        message={message}
        error={error}
        duration={duration}
        onClose={() => {
          if (currentSibling) {
            currentSibling.destroy();
            currentSibling = null;
          }
        }}
      />
    );
  } else {
    currentSibling = new RootSiblings(
      <HelperMessage
      
        message={message}
        error={error}
        duration={duration}
        onClose={() => {
          if (currentSibling) {
            currentSibling.destroy();
            currentSibling = null;
          }
        }}
      />
    );
  }
};
