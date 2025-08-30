import React, { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import FinalizeList from "@/app/components/moments/FinalizeList";
import { useFocusEffect } from "@react-navigation/native";
import { Moment } from "@/src/types/MomentContextTypes";
import useTalkingPCategorySorting from "@/src/hooks/useTalkingPCategorySorting";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useUser } from "@/src/context/UserContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
const ScreenFinalize = () => {
  const { allCapsulesList, capsuleList, preAdded } = useCapsuleList();
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();

  const { lightDarkTheme } = useLDTheme();
  const { categoryNames } = useTalkingPCategorySorting({
    listData: capsuleList,
  });

  //i added id to category names at a later date to get category colors for charts, simplest way to update this component is to remove extra data here
  const [categoryNamesOnly, setCategoryNamesOnly] = useState(
    categoryNames.map((c) => c.category)
  );
  const { themeAheadOfLoading } = useFriendStyle();

  const { appFontStyles, manualGradientColors } = useGlobalStyle();
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      const categories: string[] = [
        ...new Set(
          allCapsulesList.map((moment: Moment) => moment.typedCategory)
        ),
      ];
      setUniqueCategories(categories);
      return () => {
        setUniqueCategories([]);
      };
    }, [allCapsulesList])
  );

  return (
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useOverlay={true}
      style={{ flex: 1 }}
    >
      {selectedFriend && (
        <View
          style={[ 
            {
              flex: 1, 
              padding: 10, 
            },
          ]}
        >
          <Text
            style={[
              appFontStyles.welcomeText,
              { color: lightDarkTheme.primaryText, fontSize: 22 },
            ]}
          >
            Finalize ideas shared
          </Text>
          {preAdded &&
            uniqueCategories?.length > 0 &&
            categoryNamesOnly &&
            categoryNamesOnly !== undefined && (
              <FinalizeList
                manualGradientColors={manualGradientColors}
                subWelcomeTextStyle={appFontStyles.subWelcomeText}
                primaryColor={lightDarkTheme.primaryText}
                primaryBackground={lightDarkTheme.primaryBackground}
                userId={user?.id}
                friendId={selectedFriend?.id}
                data={allCapsulesList}
                preSelected={preAdded}
                categories={categoryNamesOnly}
              />
            )}
        </View>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenFinalize;
