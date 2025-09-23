 
import { useEffect, useMemo  } from "react"; 
import * as QuickActions from "expo-quick-actions";  
// import { useUser } from "../context/UserContext";
import { useUpcomingHelloes } from "../context/UpcomingHelloesContext"; 
import { useUserSettings } from "../context/UserSettingsContext";
import { useFriendList } from "../context/FriendListContext";


// imports from Layout in App.tsx
export default function QuickActionsHandler({navigationRef}) {
 

  const { upcomingHelloes  } =  useUpcomingHelloes();
  const { settings } = useUserSettings();
  const { friendList} = useFriendList();

    const lockIns = useMemo(() => ({
    next: settings?.lock_in_next ?? false,
    customString: settings?.lock_in_custom_string ?? null, 
  }), [settings]);


  const upcoming = upcomingHelloes?.[0]?.friend?.name ?? "None";

  const getName = (id) => {
    if (!friendList || friendList?.length < 1) {
      return;
    }

    let friend = friendList.find((friend) => friend.id === id);
    return friend?.name;
  }
  
  const lockInNext = settings?.lock_in_next ?? null;
  const lockInCustomString = settings?.lock_in_custom_string ?? null;
  const pinned = settings?.lock_in_custom_string ? getName(settings?.lock_in_custom_string ) : null;
  const upNext = !!(lockIns.next);

useEffect(() => {
  const items = [
    // Pinned takes priority
    ...(settings?.lock_in_custom_string
      ? [
          {
            id: "Pinned",
            title: `Pinned: ${pinned}`,
            subtitle: `Pinned: ${pinned}`,
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
}, [pinned, upNext, upcoming]);

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
