import React from "react";
import { View } from "react-native";
 
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

//import { useFriendDash } from "@/src/context/FriendDashContext";
import useFriendDash from "@/src/hooks/useFriendDash";
import PreAddedList from "@/app/components/moments/PreAddedList";

import { useCapsuleList } from "@/src/context/CapsuleListContext";
// import { useUser } from "@/src/context/UserContext";
import useUser from "@/src/hooks/useUser";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import { useLDTheme } from "@/src/context/LDThemeContext";
import manualGradientColors from "@/app/styles/StaticColors";
const ScreenPreAdded = () => {
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();

  const { lightDarkTheme } = useLDTheme();
  const { loadingDash } = useFriendDash({userId: user?.id, friendId: selectedFriend?.id});
  const { preAdded, allCapsulesList } = useCapsuleList();

  const { handlePreAddMoment } = usePreAddMoment({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

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
      {selectedFriend && !loadingDash && (
        <View style={{ flex: 1}}>
          {preAdded && (
            <PreAddedList
              manualGradientColors={manualGradientColors}
              primaryColor={lightDarkTheme.primaryText}
              primaryBackground={lightDarkTheme.primaryBackground}
              updateCapsule={handlePreAddMoment}
              preAdded={preAdded}
              allCapsulesList={allCapsulesList}
              friendId={selectedFriend?.id}
            />
          )}
        </View>
      )}
    </SafeViewFriendStatic>
  );
};

export default ScreenPreAdded;
