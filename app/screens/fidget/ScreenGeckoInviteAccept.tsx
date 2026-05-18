import React, { useCallback, useEffect, useState, useRef } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { View, Alert, StyleSheet, Pressable, Text } from "react-native";
import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import GlassGeckoWinAccept from "../fidget/GlassGeckoWinAccept";
import manualGradientColors from "@/app/styles/StaticColors";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useDecideGeckoGameMatchWinPending from "@/src/hooks/GeckoCalls/useDecideGeckoGameMatchWinPending";
import useDecideGeckoGameWinPending from "@/src/hooks/GeckoCalls/useDecideGeckoGameWinPending";
import useGeckoGameMatchWinPending from "@/src/hooks/GeckoCalls/useGeckoGameMatchWinPending";
import useGeckoGameWinPending from "@/src/hooks/GeckoCalls/useGeckoGameWinPending";
import useConfirmBeforeLeave from "@/src/hooks/useConfirmScreenLeave";
import useAcceptLiveSeshInvite from "@/src/hooks/LiveSeshCalls/useAcceptLiveSeshInvite";
import useLiveSeshInvites from "@/src/hooks/LiveSeshCalls/useLiveSeshInvites";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import { AppFontStyles } from "@/app/styles/AppFonts";
import { SafeAreaView } from "react-native-safe-area-context";

import SvgIcon from "@/app/styles/SvgIcons";

import OptionChoiceEdit from "@/app/components/headers/OptionChoiceEdit";
type Params = {
  pendingId?: number | null;
  oneDirectional?: boolean | null;
};

type AcceptInviteRoute = RouteProp<
  { GeckoWinAccept: Params },
  "GeckoWinAccept"
>;

// if pendingId is sent to this screen, uses the Gecko match flow
// if not, uses the one sided flow
const ScreenGeckoAcceptInvite = () => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();

  const { navigateBack, navigateToSecretGecko } = useAppNavigations();

  const route = useRoute<AcceptInviteRoute>();
  const inviteId = route.params?.inviteId ?? null;
  const senderName = route.params?.senderName ?? null;

  const [playModeSelected, setPlayModeSelected] = useState(2);

  // const handleUpdatePlayMode = (newValue: number) => {
 
  //   setPlayModeSelected(newValue);
  // };

  const { handleAcceptInvite, acceptMutation } = useAcceptLiveSeshInvite({
    userId: user?.id ?? 0,
  });

  const { playModes } = useLiveSeshInvites({
    userId: user?.id ?? 0,
    enabled: !!user?.id,
  });

  const playModeChoices = playModes.map((mode) => ({
    id: mode.value,
    label: mode.label,
  }));

  const backgroundColor = lightDarkTheme.primaryBackground;
  const textColor = lightDarkTheme.primaryText;
  const headerLabel = "Pick play mode";

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const confirmAccept = useCallback(() => {
    Alert.alert(
      "Accept invite?",
      `Accept live sesh invite from ${senderName}, playMode ${playModeSelected}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          style: "default",
          // onPress: () => handleAcceptInvite(inviteId, playModeSelected),
              onPress: () => handleAcceptInvite(inviteId, 1), // hardcode dig for now
        },
      ],
      { cancelable: true },
    );
  }, [inviteId, playModeSelected]);

  useEffect(() => {
    if (acceptMutation.isSuccess) {
      navigateToSecretGecko();
    }
  }, [acceptMutation.isSuccess]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        alignItems: "center",
      }}
    >
      <TextHeader
        label={headerLabel}
        color={textColor}
        fontStyle={welcomeTextStyle}
        showNext={false}
        nextEnabled={false}
      />

      <View style={styles.innerContainer}>
        {/* {playModeChoices && (
          <OptionChoiceEdit
            label={"test"}
            value={playModeSelected}
            choices={playModeChoices}
            onValueChange={handleUpdatePlayMode}
            onConfirm={() => {}}
            primaryColor={textColor}
            backgroundColor={lightDarkTheme.primaryBackground}
            buttonColor={lightDarkTheme.darkerGlassBackground}
            textStyle={subWelcomeTextStyle}
          />
        )} */}

        <Pressable
          onPress={confirmAccept}
          disabled={acceptMutation.isPending}
          style={[
            styles.acceptBtn,
            acceptMutation.isPending && { opacity: 0.5 },
            { backgroundColor: manualGradientColors.lightColor}
          ]}
        >
          <Text style={styles.acceptText}>Go</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  acceptBtn: { 
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  acceptText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    textAlign: "center",

    color: "#000000",
  },
  container: { flex: 1, width: "100%" },
  innerContainer: {
    flexDirection: "column", 
    alignItems: "center",
    height: 200,
    width: "100%",
    justifyContent: "space-between",
  },
  rowContainer: { flexDirection: "row" },
});

export default ScreenGeckoAcceptInvite;
