import React, { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import FinalizeList from "@/app/components/moments/FinalizeList";
import { useFocusEffect } from "@react-navigation/native";
import { Moment } from "@/src/types/MomentContextTypes";
import { useCategories } from "@/src/context/CategoriesContext";

const ScreenFinalize = () => {
  const { allCapsulesList, preAdded, categoryNames } = useCapsuleList();

  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const { userCategories } = useCategories();

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
