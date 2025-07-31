import React from "react";
import { View, Text } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import PreAddedList from "@/app/components/moments/PreAddedList";

const ScreenPreAdded = () => {
  const { preAdded } = useCapsuleList();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();

  const { themeStyles, appFontStyles } = useGlobalStyle();

  return (
    <SafeViewAndGradientBackground
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useOverlay={true}
      style={{ flex: 1 }}
    >
      {selectedFriend && !loadingNewFriend && (
        <View style={{ flex: 1, padding: 10 }}>
          <Text
            style={[
              themeStyles.primaryText,
              appFontStyles.welcomeText,
              { fontSize: 22 },
            ]}
          >
            Undo add
          </Text>
          {preAdded && <PreAddedList />}
        </View>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenPreAdded;
