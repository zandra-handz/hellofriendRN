import { View, Text } from "react-native";
import React, { use } from "react";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import { useFriendStyle } from "../context/FriendStyleContext";
import { getTheme } from "@sentry/react-native/dist/js/feedback/FeedbackWidget.theme";

type Props = {
  resetTheme: () => void;
  selectFriend: () => void;
};

// only currenly used in three places
const useDeselectFriend = ({
  // resetTheme,
  // selectFriend,
  updateSettings,

  lockIns, // .next and .customString, if .next is false and customString is empty, don't make the api call
  upNextId,
  friendList,
  autoSelectId,
}: Props) => {
  const { selectedFriend, selectFriend } = useSelectedFriend();
  const { resetTheme, getThemeAheadOfLoading } = useFriendStyle();
  const handleDeselectFriend = async (deselectIsAutoSelect = false) => {
    console.log(deselectIsAutoSelect);
    console.error("handledeselect friend");

    if (updateSettings && selectedFriend?.id) {
      if (selectedFriend?.id === upNextId?.id) {
        console.log("resetting lockin", selectedFriend?.id, upNextId?.id);
        await updateSettings({
          lock_in_next: false,
          lock_in_custom_string: null,
        });
        selectFriend(null);
        resetTheme();
      } else {
        await updateSettings({ lock_in_custom_string: null });

         const selectedOption = friendList?.find((friend) => friend.id === upNextId?.id);
        console.log(`selectedOption`, selectedOption);
        selectFriend(selectedOption);
        if (selectedOption?.id) {
          getThemeAheadOfLoading(selectedOption);
        } else {
          resetTheme();
        }
      }

      // Only after updates complete

      resetTheme();
    } else {
      console.log("friend already deselected");
    }
  };

  return { handleDeselectFriend };
};

export default useDeselectFriend;
