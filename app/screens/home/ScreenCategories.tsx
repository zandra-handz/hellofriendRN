import { View, StyleSheet } from "react-native";
import React, { useMemo, useEffect, useState, useRef } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useUser from "@/src/hooks/useUser";
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useCategories from "@/src/hooks/useCategories";
import CategoriesListUI from "./CategoriesListUI";
import OptionInputAdd from "@/app/components/headers/OptionInputAdd";
import useCreateNewCategory from "@/src/hooks/CategoryCalls/useCreateNewCategory";
import { showModalMessage } from "@/src/utils/ShowModalMessage";
const ScreenCategories = ({}) => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { navigateBack } = useAppNavigations();
  const { userCategories } = useCategories({ userId: user.id });
  const { createNewCategory, createNewCategoryMutation } = useCreateNewCategory(
    { userId: user.id },
  );

  const [showAdd, setShowAdd] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const expandedIdRef = useRef<number | null>(null);

  const backgroundColor = lightDarkTheme.primaryBackground;
  const textColor = lightDarkTheme.primaryText;
  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const maxStatus = useMemo(() => {
    return `${userCategories.length} / ${userCategories[0].max_active}`;
  }, [userCategories]);

  const canAdd = useMemo(() => {
    if (userCategories && userCategories.length > 0) {
      return userCategories[0].max_active - userCategories.length;
    } else {
      return 1;
    }
  }, [userCategories]);

  const handleOpenAdd = () => {
    if (!canAdd) return;
    if (expandedIdRef.current !== null) return;
    setShowAdd((prev) => !prev);
  };

  const handleConfirmAdd = async (name: string) => {
    if (!name.trim()) return;
    try {
      await createNewCategory({ name });
      setShowAdd(false);
    } catch (error) {
      console.log("error saving new category: ", error);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      showModalMessage({
        title: "Manage your categories",
        body: "Your categories are yours to decide! They can be broad or narrow in scope, silly or serious, every-day or outlandish, niche or normal. All that matters is that they are important to you and you enjoy sharing them! You can rename, delete, and create new categories whenever you like. If you delete a category, all pending ideas in that category will get permanently moved to the Grab Bag. Items already hello'ed to deleted categories will be removed from your history charts",
      });
    }, 700);
  }, []);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
          paddingHorizontal: 10,
        }}
      >
        <TextHeader
          label={`Categories (${maxStatus})`}
          color={textColor}
          fontStyle={welcomeTextStyle}
          showNext={true}
          nextEnabled={!!canAdd && !expanded && !showAdd}
          onNext={handleOpenAdd}
          nextIconName="plus"
          nextDisabledIconName="plus"
          nextColor={manualGradientColors.homeDarkColor}
          nextBackgroundColor={manualGradientColors.lightColor}
          nextDisabledColor={backgroundColor}
          nextDisabledBackgroundColor="transparent"
        />

        {showAdd && (
          <View style={styles.addWrapper}>
            <OptionInputAdd
              primaryColor={textColor}
              backgroundColor={lightDarkTheme.overlayBackground}
              buttonColor={lightDarkTheme.overlayBackground}
              placeholder="New category name..."
              validate={(v) => (!v.trim() ? "Name required" : null)}
              onConfirm={handleConfirmAdd}
            />
          </View>
        )}

        <View style={styles.friendsListWrapper}>
          <CategoriesListUI
            userId={user.id}
            userCategories={userCategories}
            selectedCategoryId={null}
            onPress={(id) => console.log("pressed", id)}
            onLongPress={(id) => console.log("long pressed", id)}
            itemColor={textColor}
            backgroundColor={backgroundColor}
            backgroundOverlayColor={lightDarkTheme.overlayBackground}
            selectedBorderColor={manualGradientColors.lightColor}
            subWelcomeTextStyle={subWelcomeTextStyle}
            isAddingNew={showAdd}
            onExpandedChange={(id) => {
              expandedIdRef.current = id;
              setExpanded(id !== null);
            }}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  addWrapper: {
    width: "100%",
    marginBottom: 8,
  },
  friendsListWrapper: {
    width: "100%",
    flex: 1,
  },
  safeViewContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  animatedCircleContainer: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: 999,
    width: 0,
    height: 0,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    marginVertical: 10,
  },
  topBarButton: {
    position: "absolute",
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: 60,
  },
});

export default ScreenCategories;
