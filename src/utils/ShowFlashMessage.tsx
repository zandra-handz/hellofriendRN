import RootSiblings from "react-native-root-siblings";
import React from "react";
import FlashMessage from "@/app/components/alerts/FlashMessage";

let currentSibling: RootSiblings | null = null;

export const showFlashMessage = (message: string, error: boolean, duration = 2000) => {
  const triggerKey = Date.now();

  if (currentSibling) {
    console.log('current sibling detected!');
    // Instead of destroying and recreating, just update the existing sibling
    currentSibling.update(
      <FlashMessage
   
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
      <FlashMessage
      
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
