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

  //i added id to category names at a later date to get category colors for charts, simplest way to update this component is to remove extra data here
  const [categoryNamesOnly, setCategoryNamesOnly] = useState(
    categoryNames.map(c => c.category)
  );

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
    <SafeViewAndGradientBackground backgroundOverlayHeight="" includeBackgroundOverlay={true} useOverlay={true} style={{ flex: 1 }}>
      {selectedFriend && (
        <View
          style={[
          //  appContainerStyles.talkingPointCard,
            {
              flex: 1,
              // marginBottom: 10,
              padding: 10,
             // backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
              //  paddingTop: 90,
            },
          ]}
        >
          <Text
            style={[themeStyles.primaryText, appFontStyles.welcomeText, {fontSize: 22}]}
          >
            Finalize ideas shared
          </Text>
          {preAdded && uniqueCategories?.length > 0 && categoryNamesOnly && (categoryNamesOnly !== undefined) && (
            <FinalizeList
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
