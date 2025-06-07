import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
import LeafSingleOutlineThickerSvg from "@/app/assets/svgs/leaf-single-outline-thicker.svg";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import FinalizeList from "@/app/components/moments/FinalizeList";
import { useFocusEffect } from "@react-navigation/native";
import { Moment } from "@/src/types/MomentContextTypes";

const ScreenFinalize = () => {
  const { allCapsulesList, preAdded } = useCapsuleList();

  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
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

  const renderHeader = useCallback(
    () => (
      <GlobalAppHeader
        //title={"MOMENTS: "}
        title={"Add to hello for "}
        navigateTo={"Helloes"}
        icon={LeavesTwoFallingOutlineThickerSvg}
        altView={false}
        altViewIcon={LeafSingleOutlineThickerSvg}
      />
    ),
    [selectedFriend, loadingNewFriend]
  );

  return (
    <SafeViewAndGradientBackground
      header={renderHeader}
    //  includeBackgroundOverlay={true}
      style={{ flex: 1 }}
    >
      {loadingNewFriend && (
        <View style={{ flex: 1, width: "100%" }}>
          <LoadingPage
            loading={true}
            spinnerSize={30}
            spinnerType={"flow"}
            color={themeStyles.primaryBackground.backgroundColor}
          />
        </View>
      )}
      {selectedFriend && !loadingNewFriend && (
        <View style={{ flex: 1 }}>
          {preAdded && uniqueCategories?.length > 0 && (
            <FinalizeList
              data={allCapsulesList}
              preSelected={preAdded}
              categories={uniqueCategories}
            />
          )}
        </View>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenFinalize;
