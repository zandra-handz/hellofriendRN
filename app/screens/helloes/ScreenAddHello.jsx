import React from "react";
import ContentAddHello from "@/app/components/helloes/ContentAddHello";

import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";  
import useHelloes from "@/src/hooks/useHelloes";
 import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 
const ScreenAddHello = () => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme(); 
  const { selectedFriend } = useSelectedFriend(); 


  const QueryClient = useQueryClient();


  




  return (
    <SafeViewFriendStatic
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      useOverlay={true}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      style={[
        {
          flex: 1,
          padding: 10,
        },
      ]}
    >
      <ContentAddHello
        userId={user?.id}
        primaryColor={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.overlayBackground}
     
      />
    </SafeViewFriendStatic>
  );
};

export default ScreenAddHello;
