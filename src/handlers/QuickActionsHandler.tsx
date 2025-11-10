import { useEffect  } from "react";
import * as QuickActions from "expo-quick-actions"; 
// import { useUserSettings } from "../context/UserSettingsContext";
 
import { useUser } from "../context/UserContext";
 import useUserSettings from "../hooks/useUserSettings";
// import { useFriendListAndUpcoming } from "../context/FriendListAndUpcomingContext";
 
import useFriendListAndUpcoming from "../hooks/usefriendListAndUpcoming";

// imports from Layout in App.tsx
export default function QuickActionsHandler({ navigationRef }) {
 const { user} = useUser();
  const { settings } = useUserSettings();

  const { friendListAndUpcoming } = useFriendListAndUpcoming({userId: user?.id});
  const friendList = friendListAndUpcoming?.friends;
  const upcomingHelloes = friendListAndUpcoming?.upcoming;

  const upcoming = upcomingHelloes?.[0]?.friend?.name ?? "None";
  const pinned = friendList?.find(
    (friend) => friend.id === Number(settings?.lock_in_custom_string)
  );

  useEffect(() => {
    const items = [
      // Pinned takes priority
      ...(settings?.lock_in_custom_string
        ? [
            {
              id: "Pinned",
              title: `Pinned: ${pinned?.name ?? "Unknown"}`,
              subtitle: `Pinned: ${pinned?.name ?? "Unknown"}`,
              icon: "heart",
              params: { screen: "Moments" },
            },
          ]
        : []),
      // Render upcoming only if no pinned AND upNext is true
      ...(!settings?.lock_in_custom_string && settings?.lock_in_next
        ? [
            {
              id: "moments",
              title: `Next up: ${upcoming}`,
              subtitle: `Next up: ${upcoming}`,
              icon: "heart",
              params: { screen: "Moments" },
            },
          ]
        : []),
      {
        id: "momentFocus",
        title: "Add idea",
        subtitle: "Add a new idea",
        icon: "star",
        params: { screen: "MomentFocus" },
      },
    ];

    QuickActions.setItems(items);

    const subscription = QuickActions.addListener((action) => {
      if (!action) return;

      switch (action.id) {
        case "moments":
          navigationRef.current?.navigate("Moments");
          break;
        case "momentFocus":
          navigationRef.current?.navigate("MomentFocus");
          break;
      }
    });

    return () => subscription.remove();
  }, [settings, friendList, pinned, upcoming]);

  //   const subscription = QuickActions.addListener((action) => {
  //     if (!action) return;

  //     switch (action.id) {
  //       case "moments":
  //         navigationRef.current?.navigate("Moments");
  //         break;
  //       case "momentFocus":
  //         navigationRef.current?.navigate("MomentFocus");
  //         break;
  //     }
  //   });

  //   return () => subscription.remove();
  // }, [upcoming]);

  return null;
}
