import React, { useEffect, useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserSettings from "@/src/hooks/useUserSettings";
import useUserGeckoCombinedData from "@/src/hooks/useUserGeckoCombinedData";
import { useLDTheme } from "@/src/context/LDThemeContext";
import CategoriesCard from "./CategoriesCard";
import StatsCard from "./StatsCard";
import UpNextCard from "./UpNextCard";
import { WelcomeCard } from "./HomeWelcomeCard";
import useSelectFriend from "@/src/hooks/useSelectFriend";
import useUser from "@/src/hooks/useUser";
import HomeScrollSoon from "@/app/components/home/HomeScrollSoon";
import useAppNavigations from "@/src/hooks/useAppNavigations";
// import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
// import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

import {
  showSpinner,
  hideSpinner,
} from "@/app/components/appwide/button/showSpinner";
import { prefetchFriendDash } from "@/src/hooks/prefetchFriendDashUtil";
import NoFriendsMessageUI from "@/app/components/home/NoFriendsMessageUI";

import HelloFriendFooter from "@/app/components/headers/HelloFriendFooter";
import { showModalMessage } from "@/src/utils/ShowModalMessage";
import { AppFontStyles } from "@/app/styles/AppFonts";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
import { formatDurationFromSeconds } from "@/app/components/headers/util_formatDurationFromSeconds";
const getDayLabel = () => {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const date = now.getDate();
  return `${day}, ${month} ${date}`;
};




const ScreenHome = ({skiaFontLarge, skiaFontSmall, shouldDelayAnimation }) => {
  // ─── all hooks first, no exceptions ────────────────────────────────────────
  const { user } = useUser();
  const { settings } = useUserSettings();
  const { geckoCombinedData } = useUserGeckoCombinedData();
  const queryClient = useQueryClient();
  // const { isOnline } = useNetworkStatus();
  const [isDelaying, setIsDelaying] = React.useState(shouldDelayAnimation);
  const { navigateToCategories, navigateToHistory } = useAppNavigations();


    const geckoTotalDuration = geckoCombinedData.total_duration || 0;
  const formattedDuration = formatDurationFromSeconds(geckoTotalDuration);

useEffect(() => {
  if (!geckoCombinedData) return;

  setTimeout(() => {
    showModalMessage({
      title: "Your gecko stats",
      body: `Total steps: ${geckoCombinedData.total_steps}\nTotal distance: ${geckoCombinedData.total_distance} \nTotal duration: ${formattedDuration}`,
 
 
    });
  }, 700);
}, [geckoCombinedData]);

  useEffect(() => {
    if (shouldDelayAnimation) {
      setIsDelaying(true);

      const timeout = setTimeout(() => {
        setIsDelaying(false);
      }, 1000);

      return () => clearTimeout(timeout);
    } else {
      setIsDelaying(false);
    }
  }, [shouldDelayAnimation]);

  const { lightDarkTheme } = useLDTheme();

  const { friendListAndUpcoming, friendListAndUpcomingIsSuccess } =
    useFriendListAndUpcoming({ userId: user.id });

  const friendList = friendListAndUpcoming?.friends;
  const friendListLength = friendList?.length || 0;

  const upcomingHelloes = friendListAndUpcoming?.upcoming;
  const upcomingId = friendListAndUpcoming?.next?.id;

  useEffect(() => {
    if (!user.id || !upcomingHelloes?.length) return;

    upcomingHelloes.slice(0, 1).forEach((hello) => {
      const friendId = hello?.friend?.id;
      if (friendId) {
        prefetchFriendDash(user.id, friendId, queryClient);
      }
    });
  }, [user.id, upcomingHelloes, queryClient]);

  const upcomingFriendName = useMemo(
    () => upcomingHelloes?.[0]?.friend?.name ?? null,
    [upcomingHelloes?.[0]?.friend?.name],
  );

  const upcomingFutureDateInWords = useMemo(
    () => upcomingHelloes?.[0]?.future_date_in_words ?? null,
    [upcomingHelloes?.[0]?.future_date_in_words],
  );

  const upcomingFutureDate = useMemo(
    () => upcomingHelloes?.[0]?.date ?? null,
    [upcomingHelloes?.[0]?.date],
  );

  const { handleSelectFriend } = useSelectFriend({
    userId: user?.id,
    friendList,
  });

  const onNextPress = useCallback(() => {
    if (upcomingId) {
      handleSelectFriend(upcomingId);
    }
  }, [upcomingId]);

  const onSoonPress = useCallback(
    (id) => {
      if (id) {
        handleSelectFriend(id);
        // navigateToFriendHome(id);
      }
    },
    [handleSelectFriend],
  );

  const isLoading = !friendListAndUpcomingIsSuccess;

  const userCreatedOn = user.created_on;

  const welcomeTextStyle = AppFontStyles.welcomeText;

  const textColor = lightDarkTheme.primaryText;

  const backgroundColor = lightDarkTheme.primaryBackground;
  const overlayColor = lightDarkTheme.overlayBackground;

  useEffect(() => {
    if (isDelaying) {
      showSpinner(backgroundColor);
    } else {
      hideSpinner();
    }
  }, [isDelaying, backgroundColor]);
 
 
// useEffect(() => {
//   if (isOnline === null) return;

//   if (isOnline) {
//     showFlashMessage("Back online", false);
//   } else {
//     showFlashMessage("No internet connection", false);
//   }
// }, [isOnline]);
  return (
    
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
          paddingHorizontal: 10,
        }}
      > 
        {friendListAndUpcomingIsSuccess && !isDelaying && (
          <>
            {settings?.id && friendListLength < 1 && (
              <View style={styles.noFriendsView}>
                <NoFriendsMessageUI
                  backgroundColor={overlayColor}
                  primaryColor={textColor}
                  welcomeTextStyle={welcomeTextStyle}
                  username={user.username || ""}
                  userCreatedOn={userCreatedOn || ""}
                />
              </View>
            )}
            <>
              {settings?.id && friendListLength > 0  && (
                <>
                  <WelcomeCard
                    eyebrow="Gecko:"
                    headingLine1={`Hi ${user.username}!`}
                    headingLine2="Welcome back!"
                    subtitle={`${getDayLabel()}`}
                  />
                  <UpNextCard
                    name={upcomingFriendName}
                    date={upcomingFutureDate}
                    futureDateInWords={upcomingFutureDateInWords}
                    onPress={onNextPress}
                  />

                  <HomeScrollSoon
                    lighterOverlayColor={
                      lightDarkTheme.lighterOverlayBackground
                    }
                    darkerOverlayColor={lightDarkTheme.darkerOverlayBackground}
                    isLoading={isLoading}
                    onSoonPress={onSoonPress}
                    handleSelectFriend={handleSelectFriend}
                    primaryColor={textColor}
                    overlayColor={overlayColor}
                    primaryBackground={backgroundColor}
                    friendList={friendList}
                    upcomingHelloes={upcomingHelloes}
                    itemListLength={friendList?.length}
                    height={300}
                    maxHeight={300}
                    borderRadius={10}
                    borderColor="black"
                  />

                  <View style={{marginBottom: 10}}>
              
                  <CategoriesCard
                    onPress={navigateToCategories}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                  />
                        
                  </View>

                  <StatsCard
                    onPress={navigateToHistory}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                  />
                </>
              )}
            </>

            <HelloFriendFooter
            // skiaFontLarge={skiaFontLarge}
            skiaFontSmall={skiaFontSmall}
              userId={user.id}
              username={user.username}
              lightDarkTheme={lightDarkTheme}
              geckoCombinedData={geckoCombinedData}
            />
          </>
        )}
      </SafeAreaView>
   
  );
};

const styles = StyleSheet.create({
  noFriendsView: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    paddingBottom: 60,
  }, 
});

export default ScreenHome;
