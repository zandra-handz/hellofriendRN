import { View, Text } from "react-native";
import React from "react";

type Props = {
  resetTheme: () => void;
  selectFriend: () => void;
};

// only currenly used in three places
const useUpdateLockins = ({ updateSettings }: Props) => {
  const updateCustomLockIn = async (friendId = null) => {
    if (updateSettings) {
      await updateSettings({
        lock_in_custom_string: friendId,
      });
    }
  };

  const updateNextUpLockIn = async (nextUpId = null) => {
    if (updateSettings) {
      await updateSettings({
        lock_in_next: !!nextUpId,
      });
    }
  };

  return { updateCustomLockIn, updateNextUpLockIn };
};

export default useUpdateLockins;
