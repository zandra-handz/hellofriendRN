// src/handlers/AutoSelectFriendHandler.tsx
import { useEffect, useRef } from "react";
import useFriendListAndUpcoming from "../hooks/usefriendListAndUpcoming";
import useSelectFriend from "../hooks/useSelectFriend";

const AutoSelectFriendHandler = ({ userId, settings }) => {
  const { friendListAndUpcoming, friendListAndUpcomingIsSuccess } = useFriendListAndUpcoming({ userId });

  const friendList = friendListAndUpcoming?.friends;
  const hasRunOnMount = useRef(false);
  const lastTrigger = useRef(null);
  const prevUseAutoSelect = useRef(settings?.use_auto_select);

  const { handleSelectFriend } = useSelectFriend({
    userId,
    friendList,
  });

  useEffect(() => {
    if (!settings || !friendListAndUpcomingIsSuccess || !friendList?.length) return;
    if (!settings.use_auto_select) {
      prevUseAutoSelect.current = false;
      return;
    }

    const isFirstRun = !hasRunOnMount.current;
    const isNewTrigger = settings.auto_select_trigger && settings.auto_select_trigger !== lastTrigger.current;
    const wasJustToggledOn = !prevUseAutoSelect.current && settings.use_auto_select;

    prevUseAutoSelect.current = settings.use_auto_select;

    if (!isFirstRun && !isNewTrigger && !wasJustToggledOn) return;

    hasRunOnMount.current = true;
    lastTrigger.current = settings.auto_select_trigger;

    const pinnedFriend = settings.pinned_friend;
    const upcomingFriend = settings.upcoming_friend;

    if (pinnedFriend) {
      handleSelectFriend(pinnedFriend);
      return;
    }

    if (upcomingFriend) {
      handleSelectFriend(upcomingFriend);
      return;
    }
  }, [settings?.use_auto_select, settings?.pinned_friend, settings?.upcoming_friend, settings?.auto_select_trigger, friendList, friendListAndUpcomingIsSuccess]);

  return null;  
};

export default AutoSelectFriendHandler;