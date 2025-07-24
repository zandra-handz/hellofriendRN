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

const ScreenFinalize = () => {
  const { allCapsulesList, capsuleList, preAdded } = useCapsuleList();
  const { categoryNames } = useTalkingPCategorySorting({
    listData: capsuleList,
  });

  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();
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
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
      {selectedFriend && (
        <View
          style={[
            appContainerStyles.talkingPointCard,
            {
              backgroundColor:
                themeStyles.overlayBackgroundColor.backgroundColor,
              //  paddingTop: 90,
            },
          ]}
        >
          <Text
            style={[themeStyles.primaryText, appFontStyles.welcomeText, {}]}
          >
            Finalize talking points shared
          </Text>
          {preAdded && uniqueCategories?.length > 0 && (
            <FinalizeList
              data={allCapsulesList}
              preSelected={preAdded}
              categories={categoryNames}
            />
          )}
        </View>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenFinalize;
