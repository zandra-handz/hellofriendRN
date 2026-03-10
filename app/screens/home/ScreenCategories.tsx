import { View, StyleSheet } from "react-native";
import React, { useMemo } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useUser from "@/src/hooks/useUser";
import manualGradientColors from "@/app/styles/StaticColors"; 
import { AppFontStyles } from "@/app/styles/AppFonts";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useCategories from "@/src/hooks/useCategories";
import CategoriesListUI from "./CategoriesListUI";
const ScreenCategories = ({}) => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();

  const { navigateBack } = useAppNavigations();


  const { userCategories } = useCategories({ userId: user.id });

  const backgroundColor = lightDarkTheme.primaryBackground;
  const textColor = lightDarkTheme.primaryText;

  const welcomeTextStyle = AppFontStyles.welcomeText;

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
          nextEnabled={!!canAdd}
          onNext={navigateBack}
          nextIconName={`plus`}
          nextDisabledIconName={`plus`}
          nextColor={manualGradientColors.homeDarkColor}
          nextBackgroundColor={manualGradientColors.lightColor}
          nextDisabledColor={backgroundColor}
          nextDisabledBackgroundColor={"transparent"}
        />

   <View style={styles.friendsListWrapper}>
  <CategoriesListUI
  userId={user.id}
    userCategories={userCategories}
    selectedCategoryId={null}
    onPress={(id) => console.log('pressed', id)}
    onLongPress={(id) => console.log('long pressed', id)}
    itemColor={textColor}
    backgroundOverlayColor={lightDarkTheme.overlayBackground}
    selectedBorderColor={manualGradientColors.lightColor}
  />
</View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
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
  friendsListWrapper: {
    width: "100%",
    flex: 1,
  },
});

export default ScreenCategories;
