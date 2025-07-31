import React from "react";
import { View, Text } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ReloadList from "@/app/components/helloes/ReloadList";
import { useRoute } from "@react-navigation/native";

const ScreenReload = () => {
  const route = useRoute();
  const helloId = route.params?.helloId ?? false;
  const savedMoments = route.params?.items ?? [];

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
            Reload ideas
          </Text>

          {savedMoments && (
            <ReloadList helloId={helloId} items={savedMoments} />
          )}
        </View>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenReload;
