import { View, Text } from "react-native";
import React from "react"; 

type Props = {
 
  resetTheme: () => void; 
  selectFriend: () => void; 
};

// only currenly used in three places
const useDeselectFriend = ({
  resetTheme,
  selectFriend,
  updateSettings,
  
  lockIns, // .next and .customString, if .next is false and customString is empty, don't make the api call


}: Props) => {
const handleDeselectFriend = async (deselectIsAutoSelect = false) => {
  console.log(deselectIsAutoSelect);

  if (updateSettings) {
    if (lockIns?.customString && !deselectIsAutoSelect) {
      console.log('resetting lockin');
      await updateSettings({ lock_in_custom_string: null });
    }  
    
    if (deselectIsAutoSelect) {
      await updateSettings({ lock_in_next: false });
    }
      // Only after updates complete

      console.log('deselectng friend');
  selectFriend(null);
  resetTheme();
  }


};

  return { handleDeselectFriend };
};

export default useDeselectFriend;
