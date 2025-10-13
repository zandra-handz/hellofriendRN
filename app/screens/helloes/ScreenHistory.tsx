import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { AppFontStyles } from "@/app/styles/AppFonts";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import TreeModalBigButtonHistory from "@/app/components/alerts/TreeModalBigButtonHistory";
import FriendHistoryPieDataWrap from "@/app/components/home/FriendHistoryPieDataWrap";
import UserHistoryPieDataWrap from "@/app/components/home/UserHistoryPieDataWrap";
import useAppNavigations from "@/src/hooks/useAppNavigations";
type Props = {};

const ScreenHistory = (props: Props) => {
  const { lightDarkTheme } = useLDTheme();

  const { navigateBack} = useAppNavigations();

  const { themeAheadOfLoading } = useFriendStyle();

  const { selectedFriend } = useSelectedFriend();

  const SMALL_CHART_RADIUS = 30;
  const SMALL_CHART_BORDER = 3;

  return (
    <>
      <SafeViewAndGradientBackground
        friendColorLight={themeAheadOfLoading.lightColor}
        friendColorDark={themeAheadOfLoading.darkColor}
        backgroundOverlayColor={lightDarkTheme.primaryBackground}
        friendId={selectedFriend?.id}
        backgroundOverlayHeight={"120%"}
        addColorChangeDelay={true}
        forceFullOpacity={true}
        useSolidOverlay={false}
        useOverlayFade={false}
        includeBackgroundOverlay={true}
        backgroundTransparentOverlayColor={lightDarkTheme.primaryBackground}
        backgroundOverlayBottomRadius={0}
        style={{ flex: 1 }}
      >
        <View style={styles.innerContainer}>
          <Text
            numberOfLines={2}
            style={[
              AppFontStyles.welcomeText,
              { color: lightDarkTheme.primaryText, fontSize: 22 },
            ]}
          >
            Hello history for {selectedFriend?.name}
          </Text>
        </View>

        <View
          style={{
            width: "100%",
        height: 100,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <FriendHistoryPieDataWrap
            friendId={selectedFriend?.id}
            selectedFriendName={selectedFriend?.name}
            primaryColor={lightDarkTheme.primaryText}
            primaryOverlayColor={lightDarkTheme.primaryOverlay}
            darkerOverlayBackgroundColor={
              lightDarkTheme.darkerOverlayBackgroundColor
            }
            welcomeTextStyle={AppFontStyles.welcomeText}
            subWelcomeTextStyle={AppFontStyles.subWelcomeText}
            themeAheadOfLoading={themeAheadOfLoading}
            chartBorder={SMALL_CHART_BORDER}
            chartBorderColor={lightDarkTheme.primaryBackground}
            showLabels={false}
            chartRadius={SMALL_CHART_RADIUS}
          />
          <UserHistoryPieDataWrap
            friendStyle={themeAheadOfLoading}
            primaryColor={lightDarkTheme.primaryText}
            primaryOverlayColor={lightDarkTheme.primaryOverlay}
            darkerOverlayBackgroundColor={lightDarkTheme.darkerOverlayBackgroundColor}
            welcomeTextStyle={AppFontStyles.welcomeText}
            subWelcomeTextStyle={AppFontStyles.subWelcomeText}
        
            chartBorder={SMALL_CHART_BORDER}
               chartBorderColor={lightDarkTheme.primaryBackground}
            showLabels={false}
            chartRadius={SMALL_CHART_RADIUS}
          />
        </View>

        <TreeModalBigButtonHistory
          height={90}
          safeViewPaddingBottom={0}
          themeAheadOfLoading={themeAheadOfLoading}
          label={"History"}
          subLabel={"Sub label here"}
          labelColor={"hotpink"}
          onLeftPress={navigateBack}
          onMainPress={() => console.log("main press!")}
          onRightPress={() => console.log("right press!")}
        />
      </SafeViewAndGradientBackground>
    </>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 30,
    height: "auto",
    marginVertical: 0,
  },
});

export default ScreenHistory;
