import React, { useEffect, useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useUser from "@/src/hooks/useUser";
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import useFriendDash from "@/src/hooks/useFriendDash";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import { useLDTheme } from "@/src/context/LDThemeContext";
import AnimatedBackdrop from "@/app/components/appwide/format/AnimatedBackdrop";
import { useSharedValue } from "react-native-reanimated";
import GradientBackgroundBreathing from "@/app/fidgets/GradientBackgroundBreathing";

import SafeViewMomentView from "@/app/components/appwide/format/SafeViewMomentView";
import { BackHandler } from "react-native";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import GlassMoment from "../fidget/GlassMoment";
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import useDeleteMoment from "@/src/hooks/CapsuleCalls/useDeleteMoment";
const ScreenMomentView = () => {
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { lightDarkTheme } = useLDTheme();
  const { capsuleList } = useCapsuleList();
  const route = useRoute();
  const currentIndex = route.params?.index ?? null;
  //   const momentId = route.params?.momentId ?? null;
  //   const moment = route.params?.moment ?? {};
  const momentId = route.params?.momentId ?? null;
  const moment = capsuleList.find((c) => c.id === momentId) ?? null;

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => subscription.remove();
    }, []),
  );

  const { navigateBack } = useAppNavigations();

  const [triggerClose, setTriggerClose] = useState(false);

  const startWithBackdropTimestamp =
    route.params?.startWithBackdropTimestamp ?? null;
  const startWithBackdropValue = useSharedValue(!!startWithBackdropTimestamp);

  useEffect(() => {
    if (startWithBackdropTimestamp) {
      startWithBackdropValue.value = false;
    }
  }, [startWithBackdropTimestamp]);

  const { handleDeleteMoment, deleteMomentMutation } = useDeleteMoment({
    userId: user.id,
    friendId: selectedFriend?.id,
  });

  const { handlePreAddMoment, preAddMomentMutation } = usePreAddMoment({
    userId: user.id,
    friendId: selectedFriend?.id,
  });

  useEffect(() => {
    if (preAddMomentMutation.isError) {
      showFlashMessage(`Could not add moment`, true, 1000);
    }
  }, [preAddMomentMutation.isError]);

  const { friendDash, loadingDash } = useFriendDash({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const phoneNumber = friendDash?.suggestion_settings?.phone_number || null;

  const saveToHello = useCallback(() => {
    if (!selectedFriend?.id || !moment?.id) {
      showFlashMessage(`Moment not added`, true, 1000);
      return;
    }
    showFlashMessage(`Moment added!`, false, 1000);
    handlePreAddMoment({
      friendId: selectedFriend.id,
      capsuleId: moment?.id,
      isPreAdded: true,
    });
  }, [selectedFriend, moment]);

  const deleteMoment = useCallback(() => {
    if (!selectedFriend?.id || !moment?.id) {
      showFlashMessage(`Moment not deleted`, true, 1000);
      return;
    }
    showFlashMessage("Moment deleted", false, 1000);
    handleDeleteMoment({
      friend: selectedFriend.id,
      id: moment?.id,
      user_category_name: moment.user_category_name,
    });
  }, [selectedFriend, moment]);

  useEffect(() => {
    if (preAddMomentMutation.isSuccess) {
      setTriggerClose(true); 
    }
  }, [preAddMomentMutation.isSuccess]);

    useEffect(() => {
    if (deleteMomentMutation.isSuccess) {
      setTriggerClose(true); 
    }
  }, [deleteMomentMutation.isSuccess]);

  const TIME_SCORE = 100;

  return (
    <>
      <SafeViewFriendStatic
        friendColorLight={selectedFriend.lightColor}
        friendColorDark={selectedFriend.darkColor}
        useOverlay={false}
        backgroundOverlayColor={lightDarkTheme.primaryBackground}
        style={[
          {
            flex: 1,
            padding: 10,
          },
        ]}
      >
        <AnimatedBackdrop
          color={lightDarkTheme.backdropColor}
          zIndex={5}
          isVisibleValue={startWithBackdropValue}
        />

        {/* <EmptyFooter backgroundColor={lightDarkTheme.darkerOverlayBackground} /> */}
      </SafeViewFriendStatic>
      <GlassMoment
        color={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.darkerOverlayBackground}
        borderColor={"transparent"}
        moment={moment?.id ? moment : null}
        hasContent={true}
        noContentText={""}
        friendId={selectedFriend.id}
        onPressBack={navigateBack}
        saveToHello={saveToHello}
        deleteMoment={deleteMoment}
        triggerClose={triggerClose}
        // onPressEdit={(handleNavigateToMoment)}
        // onPressNew={handleNavigateToCreateNew}
      />
    </>
  );
};

const styles = StyleSheet.create({
  gradientBreathingStyle: {
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  leafWrapper: {
    position: "absolute",
    top: -170,
    left: -300,
  },
  leaf: {
    flexDirection: "row",
    justifyContent: "flex-start",
    // zIndex: 4000,
    position: "absolute",
    opacity: 0.6,
  },
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: { zIndex: 0 },
  label: {},
});

export default ScreenMomentView;
