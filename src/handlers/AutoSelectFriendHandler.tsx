 
import { useEffect, useRef } from "react";
import useFriendListAndUpcoming from "../hooks/usefriendListAndUpcoming";
import useSelectFriend from "../hooks/useSelectFriend";
import { useSelectedFriend } from "../context/SelectedFriendContext";

const AutoSelectFriendHandler = ({ userId, settings }) => {
  const { friendListAndUpcoming, friendListAndUpcomingIsSuccess } = useFriendListAndUpcoming({ userId });

  const friendList = friendListAndUpcoming?.friends;
  const hasRunOnMount = useRef(false);
  const lastTrigger = useRef(null);
  const prevUseAutoSelect = useRef(settings?.use_auto_select);

  const { handleSelectFriend } = useSelectFriend({ userId, friendList });
  const { deselectFriend } = useSelectedFriend();

  useEffect(() => {
  console.log('AUTO SELECT:', { 
    friendListAndUpcomingIsSuccess, 
    settingsLoaded: !!settings,
    friendCount: friendList?.length 
  });
}, [friendListAndUpcomingIsSuccess, settings, friendList]);
  useEffect(() => {
      console.log('AUTO SELECT EFFECT RUNNING', {
    hasSettings: !!settings,
    isSuccess: friendListAndUpcomingIsSuccess,
    useAutoSelect: settings?.use_auto_select,
    hasRunOnMount: hasRunOnMount.current,
  });
    if (!settings || !friendListAndUpcomingIsSuccess) return;

    const isFirstRun = !hasRunOnMount.current;
    const wasJustToggledOn = !prevUseAutoSelect.current && settings.use_auto_select;
    const wasJustToggledOff = prevUseAutoSelect.current && !settings.use_auto_select;

    // If auto-select is off, make sure we land on home (isReady: true, no friend)
    if (!settings.use_auto_select) {
      prevUseAutoSelect.current = false;
      if (isFirstRun || wasJustToggledOff) {
            console.log('CALLING DESELECT FRIEND');
        hasRunOnMount.current = true;
        deselectFriend();
      }
      return;
    }

    const isNewTrigger = settings.auto_select_trigger && settings.auto_select_trigger !== lastTrigger.current;

    prevUseAutoSelect.current = settings.use_auto_select;

    if (!isFirstRun && !isNewTrigger && !wasJustToggledOn) return;

    // Need a friend list to auto-select
    if (!friendList?.length) {
      hasRunOnMount.current = true;
      deselectFriend();
      return;
    }

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

    // auto-select is on but no pinned/upcoming — still go home
    deselectFriend();
  }, [
    settings?.use_auto_select,
    settings?.pinned_friend,
    settings?.upcoming_friend,
    settings?.auto_select_trigger,
    friendList,
    friendListAndUpcomingIsSuccess,
  ]);

  return null;
};

export default AutoSelectFriendHandler;