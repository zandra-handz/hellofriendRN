 
import { useEffect  } from "react"; 
import * as QuickActions from "expo-quick-actions";  
// import { useUser } from "../context/UserContext";
import { useUpcomingHelloes } from "../context/UpcomingHelloesContext"; 


// imports from Layout in App.tsx
export default function QuickActionsHandler({navigationRef}) {
 

  const { upcomingHelloes  } =  useUpcomingHelloes();

  const upcoming = upcomingHelloes?.[0]?.friend?.name ?? "None";

  useEffect(() => {
    QuickActions.setItems([
      {
        id: "moments",
        title: `Next up: ${upcoming}`,
        subtitle: `Next up: ${upcoming}`,
        //   ? `See ideas for ${selectedFriend.name}`
        //   : "Go to ideas for next up",
        icon: "heart",
        params: { screen: "Moments" },
      },
      {
        id: "momentFocus",
        title: "Add idea",
        subtitle: "Add a new idea",
        icon: "star",
        params: { screen: "MomentFocus" },
      },
    ]);

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
  }, [upcoming]); 

  return null;  
}
