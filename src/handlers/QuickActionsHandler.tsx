import { useEffect  } from "react";
import * as QuickActions from "expo-quick-actions";  
  
 
export default function QuickActionsHandler({  settings, navigationRef }) {
 
  useEffect(() => {

  const upcoming_friend_name = settings?.upcoming_friend_name;
  const pinned_friend_name = settings?.pinned_friend_name;
    const items = [
      // Pinned takes priority
      ...(settings?.pinned_friend
        ? [
            {
              id: "Pinned",
              title: `Pinned: ${pinned_friend_name ?? "Unknown"}`,
              subtitle: `Pinned: ${pinned_friend_name ?? "Unknown"}`,
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
              title: `Next up: ${upcoming_friend_name}`,
              subtitle: `Next up: ${upcoming_friend_name}`,
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
  }, [settings ]);

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
