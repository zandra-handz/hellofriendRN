import React, { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import FinalizeList from "@/app/components/moments/FinalizeList";
import { useFocusEffect } from "@react-navigation/native";
import { Moment } from "@/src/types/MomentContextTypes";
import useTalkingPCategorySorting from "@/src/hooks/useTalkingPCategorySorting";
import { SafeAreaView } from "react-native-safe-area-context";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";

const ScreenFinalize = () => {
  const { allCapsulesList, capsuleList, preAdded } = useCapsuleList();
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { lightDarkTheme } = useLDTheme();
  const { categoryNames } = useTalkingPCategorySorting({
    listData: capsuleList,
  });
  const { handlePreAddMoment } = usePreAddMoment({
    userId: user.id,
    friendId: selectedFriend.id,
  });

  const backgroundColor = lightDarkTheme.primaryBackground;
  const textColor = lightDarkTheme.primaryText;

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const headerLabel = "Add/Remove";

  const { navigateToAddHello } = useAppNavigations();

  const [categoryNamesOnly, setCategoryNamesOnly] = useState(
    categoryNames.map((c) => c.category),
  );

  const [changedMoments, setChangedMoments] = useState<Moment[]>([]);

  const handleUpdateMoments = () => {
    if (!selectedFriend.id) {
      return;
    }

    changedMoments.forEach((moment) => {
      handlePreAddMoment({
        friendId: selectedFriend.id,
        capsuleId: moment.id,
        isPreAdded: !moment.preAdded,
      });
    });
    navigateToAddHello();
  };

  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      const categories: string[] = [
        ...new Set(
          allCapsulesList.map((moment: Moment) => moment.typedCategory),
        ),
      ];
      setUniqueCategories(categories);
      return () => {
        setUniqueCategories([]);
        setChangedMoments([]);
      };
    }, [allCapsulesList]),
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        paddingHorizontal: 0,
      }}
    >
      <TextHeader
        label={headerLabel}
        color={textColor}
        fontStyle={welcomeTextStyle}
        showNext={true}
        nextEnabled={true}
        onNext={handleUpdateMoments}
        nextColor={manualGradientColors.homeDarkColor}
        nextBackgroundColor={manualGradientColors.lightColor}
        nextDisabledColor={backgroundColor}
        nextDisabledBackgroundColor={"transparent"}
      />

      <FinalizeList
        manualGradientColors={manualGradientColors}
        subWelcomeTextStyle={subWelcomeTextStyle}
        primaryColor={textColor}
        primaryBackground={backgroundColor}
        userId={user?.id}
        friendId={selectedFriend?.id}
        data={allCapsulesList}
        preSelected={preAdded}
        changedMoments={changedMoments}
        setChangedMoments={setChangedMoments}
      />
    </SafeAreaView>
  );
};

export default ScreenFinalize;