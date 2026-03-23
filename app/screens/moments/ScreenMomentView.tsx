import React, { useEffect, useCallback, useRef, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useUser from "@/src/hooks/useUser";
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { Linking } from "react-native";
import useFriendDash from "@/src/hooks/useFriendDash";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import usePreAddMoment from "@/src/hooks/CapsuleCalls/usePreAddMoment";
import { useLDTheme } from "@/src/context/LDThemeContext";
import AnimatedBackdrop from "@/app/components/appwide/format/AnimatedBackdrop";
import { useSharedValue } from "react-native-reanimated";
import GradientBackgroundBreathing from "@/app/fidgets/GradientBackgroundBreathing";
import { showModalInput, dismissModalInput } from "@/src/utils/ShowModalInput";
import useUpdateFriendSettings from "@/src/hooks/useUpdateFriendSettings";
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

  const [ideaSent, setIdeaSent] = useState(false);
  const [inputNumberVisible, setInputNumberVisible] = useState(false);

  const { handleUpdateFriendSettings, updateFriendSettingsMutation } =
    useUpdateFriendSettings({
      userId: user?.id,
      friendId: selectedFriend?.id,
    });
  const { friendDash, loadingDash } = useFriendDash({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });


  const shouldResetRef = useRef(false);
 

const handleAddPhone = () => {
  showModalInput({
    title: "Add Phone Number",
    placeholder: "Phone number...",
    confirmLabel: "Save",
    keyboardType: "phone-pad",
    validate: (val) => {
      const cleaned = val.replace(/[^\d]/g, "");
      if (!cleaned) return "Please enter a phone number";
      if (cleaned.length < 10) return "Must be at least 10 digits";
      return null;
    },
    onConfirm: (val) => {
      const cleaned = val.replace(/[^\d]/g, "");
      handleUpdateFriendSettings({ phoneNumber: cleaned });
    },
  });
};

// Watch for success and close — same logic as your useEffect:
useEffect(() => {
  if (updateFriendSettingsMutation.isSuccess) {
    dismissModalInput();
  }
}, [updateFriendSettingsMutation.isSuccess]);
  const phoneNumber = friendDash?.suggestion_settings?.phone_number || "";

  const handleSend = (fn: string, truncated: string) => {
    setIdeaSent(true);
    Linking.openURL(`sms:${fn}?body=${encodeURIComponent(truncated)}`);
  };

  const handleSendAlert = useCallback(() => {
    if (!moment?.id) return;
    const momentCapsule = moment?.capsule || "";
    const truncated = `${momentCapsule.slice(0, 30)}${momentCapsule.length > 31 ? `...` : ``}`;
    if (phoneNumber) {
      Alert.alert("Send idea", `Send ${truncated}?`, [
        { text: "Go back", style: "cancel" },
        { text: "Yes", onPress: () => handleSend(phoneNumber, truncated) },
      ]);
    } else {
      handleAddPhone();
    }
  }, [currentIndex, phoneNumber]);

  const startWithBackdropTimestamp =
    route.params?.startWithBackdropTimestamp ?? null;

  const { navigateBack } = useAppNavigations();

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

  useFocusEffect(
    useCallback(() => {
      if (ideaSent && moment?.id) {
        saveToHello();
        setIdeaSent(false);
      }
    }, [ideaSent, moment?.id]),
  );

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => subscription.remove();
    }, []),
  );

  const [triggerClose, setTriggerClose] = useState(false);

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
      shouldResetRef={shouldResetRef}
        color={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.darkerOverlayBackground}
        borderColor={"transparent"}
        moment={moment?.id ? moment : null}
        hasContent={true}
        noContentText={""}
        friendId={selectedFriend.id}
        onPressBack={navigateBack}
        onPressShare={handleSendAlert}
        saveToHello={saveToHello}
        deleteMoment={deleteMoment}
        triggerClose={triggerClose}
        inputNumberVisible={inputNumberVisible}
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
