import { useEffect, useRef } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import useFriendListAndUpcoming from "../hooks/usefriendListAndUpcoming";
import useSelectFriend from "../hooks/useSelectFriend";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import useUserSettings from "../hooks/useUserSettings";

// TO TRIGGER A ONE TIME RUN FROM ANY COMPONENT, USE:
// queryClient.setQueryData(['autoSelectTrigger'], (old: number = 0) => old + 1);
const AutoSelectFriendHandler = ({ userId }) => {
  // console.log(`AutoSELECT USER SETTINGS: `, settings)

  const { friendListAndUpcoming, friendListAndUpcomingIsSuccess } =
    useFriendListAndUpcoming({ userId });
  const { settings } = useUserSettings();

  const friendList = friendListAndUpcoming?.friends;
  const hasRunOnMount = useRef(false);
  const lastTrigger = useRef(null);
  const prevUseAutoSelect = useRef(settings?.use_auto_select);
  const prevNewFriend = useRef(settings?.new_friend);

  const { handleSelectFriend, handleSelectFriendFirstTime } = useSelectFriend({
    userId,
    friendList,
  });
  const { deselectFriend } = useSelectedFriend();

  const { data: autoSelectTrigger } = useQuery({
    queryKey: ["autoSelectTrigger"],
    queryFn: () => 0,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // useEffect(() => {
  //   console.log("AUTO SELECT:", {
  //     friendListAndUpcomingIsSuccess,
  //     settingsLoaded: !!settings,
  //     friendCount: friendList?.length,
  //   });
  // }, [friendListAndUpcomingIsSuccess, settings, friendList]);
  
  
  useEffect(() => {
    // console.log("AUTO SELECT EFFECT RUNNING", {
    //   hasSettings: !!settings,
    //   isSuccess: friendListAndUpcomingIsSuccess,
    //   useAutoSelect: settings?.use_auto_select,
    //   hasRunOnMount: hasRunOnMount.current,
    // });
    if (!settings || !friendListAndUpcomingIsSuccess) return;

    const isFirstRun = !hasRunOnMount.current;
    const wasJustToggledOn =
      !prevUseAutoSelect.current && settings.use_auto_select;
    const wasJustToggledOff =
      prevUseAutoSelect.current && !settings.use_auto_select;

    const newFriendJustViewed = prevNewFriend.current && !settings.new_friend;

    const newFriend = settings.new_friend;
    prevNewFriend.current = newFriend;

    if (newFriendJustViewed) return;

    if (newFriend && !newFriendJustViewed) {
  
      deselectFriend();
      handleSelectFriendFirstTime(newFriend);
    
      return;
    }

    // If auto-select is off, make sure we land on home (isReady: true, no friend)
    if (!settings.use_auto_select) {
      prevUseAutoSelect.current = false;
      if (isFirstRun || wasJustToggledOff) {
        // console.log("CALLING DESELECT FRIEND");
        hasRunOnMount.current = true;
        deselectFriend();
      }
      return;
    }

    // const isNewTrigger = settings.auto_select_trigger && settings.auto_select_trigger !== lastTrigger.current;
    const isNewTrigger =
      autoSelectTrigger > 0 && autoSelectTrigger !== lastTrigger.current;

    prevUseAutoSelect.current = settings.use_auto_select;

    if (!isFirstRun && !isNewTrigger && !wasJustToggledOn) return;

    // Need a friend list to auto-select
    if (!friendList?.length) {
      hasRunOnMount.current = true;
      deselectFriend();
      return;
    }

    hasRunOnMount.current = true;
    lastTrigger.current = autoSelectTrigger;

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

    // console.log("auto select is selecting nothing");
    deselectFriend();
  }, [
    settings?.use_auto_select,
    settings?.pinned_friend,
    settings?.upcoming_friend,
    settings?.new_friend,
    settings?.auto_select_trigger,
    friendList,
    friendListAndUpcomingIsSuccess,
    autoSelectTrigger,
  ]);

  return null;
};

export default AutoSelectFriendHandler;

// import { useEffect, useRef } from "react";
// import { useQueryClient, useQuery } from "@tanstack/react-query";
// import useFriendListAndUpcoming from "../hooks/usefriendListAndUpcoming";
// import useSelectFriend from "../hooks/useSelectFriend";
// import { useSelectedFriend } from "../context/SelectedFriendContext";

// // TO TRIGGER A ONE TIME RUN FROM ANY COMPONENT, USE:
// // queryClient.setQueryData(['autoSelectTrigger'], (old: number = 0) => old + 1);

// const AutoSelectFriendHandler = ({ userId, settings }) => {
//   const queryClient = useQueryClient();
//   const { friendListAndUpcoming, friendListAndUpcomingIsSuccess } = useFriendListAndUpcoming({ userId });

//   const friendList = friendListAndUpcoming?.friends;
//   const hasRunOnMount = useRef(false);
//   const lastTrigger = useRef(null);
//   const prevUseAutoSelect = useRef(settings?.use_auto_select);

//   const { handleSelectFriend } = useSelectFriend({ userId, friendList });
//   const { deselectFriend } = useSelectedFriend();

//   const { data: autoSelectTrigger } = useQuery({
//     queryKey: ['autoSelectTrigger'],
//     queryFn: () => 0,
//     staleTime: Infinity,
//     gcTime: Infinity,
//   });

//   useEffect(() => {
//     console.log('AUTO SELECT EFFECT RUNNING', {
//       hasSettings: !!settings,
//       isSuccess: friendListAndUpcomingIsSuccess,
//       useAutoSelect: settings?.use_auto_select,
//       hasRunOnMount: hasRunOnMount.current,
//       autoSelectTrigger,
//     });

//     if (!settings || !friendListAndUpcomingIsSuccess) return;

//     const isFirstRun = !hasRunOnMount.current;
//     const wasJustToggledOn = !prevUseAutoSelect.current && settings.use_auto_select;
//     const wasJustToggledOff = prevUseAutoSelect.current && !settings.use_auto_select;
//     const isNewTrigger = autoSelectTrigger > 0 && autoSelectTrigger !== lastTrigger.current;

//     if (isNewTrigger) {
//       hasRunOnMount.current = false;
//     }

//     if (!settings.use_auto_select) {
//       prevUseAutoSelect.current = false;
//       if (isFirstRun || wasJustToggledOff || isNewTrigger) {
//         console.log('CALLING DESELECT FRIEND');
//         hasRunOnMount.current = true;
//         lastTrigger.current = autoSelectTrigger;
//         deselectFriend();
//       }
//       return;
//     }

//     const isNewAutoSelectTrigger = autoSelectTrigger > 0 && autoSelectTrigger !== lastTrigger.current;

//     prevUseAutoSelect.current = settings.use_auto_select;

//     if (!isFirstRun && !isNewAutoSelectTrigger && !wasJustToggledOn) return;

//     if (!friendList?.length) {
//       hasRunOnMount.current = true;
//       lastTrigger.current = autoSelectTrigger;
//       deselectFriend();
//       return;
//     }

//     hasRunOnMount.current = true;
//     lastTrigger.current = autoSelectTrigger;

//     const pinnedFriend = settings.pinned_friend;
//     const upcomingFriend = settings.upcoming_friend;

//     if (pinnedFriend) {
//       handleSelectFriend(pinnedFriend);
//       return;
//     }

//     if (upcomingFriend) {
//       handleSelectFriend(upcomingFriend);
//       return;
//     }

//     deselectFriend();
//   }, [
//     settings?.use_auto_select,
//     settings?.pinned_friend,
//     settings?.upcoming_friend,
//     autoSelectTrigger,
//     friendList,
//     friendListAndUpcomingIsSuccess,
//   ]);

//   return null;
// };

// export default AutoSelectFriendHandler;
