import { useEffect  } from "react";
import * as QuickActions from "expo-quick-actions";  
 
import useFriendListAndUpcoming from "../hooks/usefriendListAndUpcoming";
 
export default function QuickActionsHandler({ userId, settings, navigationRef }) {
 
  const { friendListAndUpcoming } = useFriendListAndUpcoming({userId: userId});
  const friendList = friendListAndUpcoming?.friends;
  const upcomingHelloes = friendListAndUpcoming?.upcoming;

  const upcoming = upcomingHelloes?.[0]?.friend?.name ?? "None";
  const pinned = friendList?.find(
    (friend) => friend.id === Number(settings?.pinned_friend)
  );

  useEffect(() => {
    const items = [
      // Pinned takes priority
      ...(settings?.pinned_friend
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
      ...(!settings?.pinned_friend && settings?.upcoming_friend
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
