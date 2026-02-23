// src/handlers/AutoSelectHandler.tsx
import { useEffect } from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";

const AutoSelectFriendHandler = ({ children }) => {
  const { autoSelectFriend } = useAutoSelector();
  const { selectedFriend, setToAutoFriend } = useSelectedFriend();

  useEffect(() => {

 
    if (autoSelectFriend?.customFriend !== "pending" && !selectedFriend?.id) {
      if (
        autoSelectFriend.customFriend?.id &&
        autoSelectFriend.customFriend?.id !== -1
      ) {
        setToAutoFriend({
          friend: autoSelectFriend.customFriend,
          preConditionsMet: autoSelectFriend.customFriend !== "pending",
        });
      } else if (
        autoSelectFriend.nextFriend?.id &&
        autoSelectFriend.nextFriend?.id !== -1
      ) {
        setToAutoFriend({
          friend: autoSelectFriend.nextFriend?.id,
          preConditionsMet: autoSelectFriend.nextFriend !== "pending",
        });
      } else {
        setToAutoFriend({ friend: { id: null }, preConditionsMet: true });
      }
    }
  }, [autoSelectFriend]);

  return children;
};

export default AutoSelectFriendHandler;