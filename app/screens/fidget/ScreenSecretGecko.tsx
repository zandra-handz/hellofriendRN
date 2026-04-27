import React, { useCallback, useEffect, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  AppState,
  Pressable,
} from "react-native";
import useCancelCurrentLiveSesh from "@/src/hooks/LiveSeshCalls/useCancelLiveSesh";
import { useGeckoWebsocket } from "@/src/context/GeckoWebsocketContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useCurrentLiveSesh from "@/src/hooks/LiveSeshCalls/useCurrentLiveSesh";
import MemoizedMirrorPlayGecko from "@/app/assets/shader_animations/MirrorPlayGecko";
import manualGradientColors from "@/app/styles/StaticColors";
import GradientBackgroundAppDefault from "@/app/components/appwide/format/GradientBackgroundAppDefault";
import PeerGeckoPositionText from "@/app/components/fidget/PeerGeckoPositionText";
import useUser from "@/src/hooks/useUser";
import GlassPreviewBottomSecret from "./GlassPreviewBottomSecret";
import GlassTopBarLight from "./GlassTopBarLight";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
// optional (only if you added backend broadcast)
// import PeerEnergyText from "@/app/components/debug/PeerEnergyText";

type Props = {
  skiaFontLarge: SkFont;
  skiaFontSmall: SkFont;
};

const ScreenSecretGecko = ({ skiaFontLarge, skiaFontSmall }: Props) => {
  const {
    socketStatusSV,
    peerJoinedStatusSV,
    geckoMessageSV,

    liveSeshPartner,
    energySV,
    peerGeckoPositionSV,
    guestPeerGeckoPositionSV,
    hostPeerGeckoPositionSV,
    connect,
    disconnect,
    setWantsConnection,
    joinLiveSesh,
    leaveLiveSesh,
    sendGeckoPosition,
    sendGuestGeckoPosition,
    registerOnHostGeckoCoords,
    requestPresenceStatus,
    triggerNav,
  } = useGeckoWebsocket();
  const { user } = useUser();

  const { lightDarkTheme } = useLDTheme();

  const { navigateBack, navigateToSecretGeckoWinAccept } = useAppNavigations();
  const handleExit = React.useCallback(() => {
    leaveLiveSesh();
    navigateBack();
  }, [leaveLiveSesh, navigateBack]);
  const { handleCancelCurrentLiveSesh } = useCancelCurrentLiveSesh({
    userId: user?.id,
  });
  const handleCancelPress = React.useCallback(() => {
    Alert.alert(
      "End session?",
      "This will end the session for both you and your partner.",
      [
        { text: "Keep it", style: "cancel" },
        {
          text: "End session",
          style: "destructive",
          onPress: async () => {
            await handleCancelCurrentLiveSesh();
            leaveLiveSesh();
            navigateBack();
          },
        },
      ],
    );
  }, [handleCancelCurrentLiveSesh, leaveLiveSesh, navigateBack]);
  const { isHost } = useCurrentLiveSesh({ userId: user?.id, enabled: true });

  const noopSendGuestGeckoPosition = useRef(() => {}).current;
  const sendGuestGeckoPositionRef = useRef(
    !isHost ? sendGuestGeckoPosition : noopSendGuestGeckoPosition,
  );
  useEffect(() => {
    sendGuestGeckoPositionRef.current = !isHost
      ? sendGuestGeckoPosition
      : noopSendGuestGeckoPosition;
  }, [sendGuestGeckoPosition, isHost, noopSendGuestGeckoPosition]);

  // useEffect(() => {
  //   // auto join when screen mounts
  //   joinLiveSesh();

  //   return () => {
  //     leaveLiveSesh();
  //   };
  // }, [joinLiveSesh, leaveLiveSesh]);

  useFocusEffect(
    useCallback(() => {
      requestPresenceStatus();
    }, [requestPresenceStatus]),
  );

const prevPendingIdRef = useRef<number | null>(null);

useEffect(() => {
  if (!triggerNav?.pending_id) return;
  if (triggerNav.pending_id === prevPendingIdRef.current) return;

  prevPendingIdRef.current = triggerNav.pending_id;

  navigateToSecretGeckoWinAccept({
    pendingId: triggerNav.pending_id,
  });
}, [triggerNav, navigateToSecretGeckoWinAccept]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") requestPresenceStatus();
    });
    return () => sub.remove();
  }, [requestPresenceStatus]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const setup = async () => {
        console.log("[SECRET GECKO] focus -> connect");
        setWantsConnection(true);
        await connect();

        if (!isActive) return;

        console.log("[SECRET GECKO] focus -> joinLiveSesh");
        joinLiveSesh();
      };

      setup();

      return () => {
        isActive = false;
        console.log(
          "[SECRET GECKO] blur -> leaveLiveSesh + setWantsConnection(false)",
        );
        leaveLiveSesh();
        setWantsConnection(false);
      };
    }, [connect, setWantsConnection, joinLiveSesh, leaveLiveSesh]),
  );

  return (
    <GradientBackgroundAppDefault style={styles.backgroundContainer}>
      {/* <View style={{ width: "100%", alignItems: "center", bottom: -50 }}>
        <Text style={styles.label}>socket: {socketStatus}</Text>

        <Text style={styles.label}>partner: {liveSeshPartnerId ?? "—"}</Text>

        <PeerGeckoPositionText
          peerGeckoPositionSV={hostPeerGeckoPositionSV}
          color="white"
        />
      </View> */}

      {/* <EnergyText
        energySV={energySV}
        color="white"
      /> */}

      {/* 
      <PeerEnergyText
        peerEnergySV={peerEnergySV}
        color="white"
      />
      */}
      <View style={[StyleSheet.absoluteFill]}>
        <MemoizedMirrorPlayGecko
          color1={manualGradientColors.lightColor}
          color2={manualGradientColors.homeLightColor}
          bckgColor1={manualGradientColors.lightColor}
          bckgColor2={manualGradientColors.homeLightColor}
          //   startingCoord0={0.2}
          //   startingCoord1={-1}
          //   restPoint0={0.5}
          //   restPoint1={0.7}
          startingCoord0={0.1}
          startingCoord1={-0.5}
          restPoint0={0.5}
          restPoint1={0.6}
          scale={1}
          gecko_scale={1}
          //   gecko_size={1.6}
          gecko_size={1.7}
          reset={0}
          hostPeerGeckoPositionSV={hostPeerGeckoPositionSV}
          sendGuestGeckoPositionRef={sendGuestGeckoPositionRef}
        />
      </View>

      <GlassTopBarLight
        socketStatusSV={socketStatusSV}
        peerJoinedStatusSV={peerJoinedStatusSV}
        geckoMessageSV={geckoMessageSV}
        liveSeshPartner={liveSeshPartner}
        textColor={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.darkerOverlayBackground}
        requestPresenceStatus={requestPresenceStatus}
        // friendId={selectedFriend.id}
        friendName={"Unknown"}
        highlight={false}
        fontSmall={skiaFontSmall}
      />
{/* 
      <Pressable
      onPress={navigateToSecretGeckoWinAccept}
        style={{
          width: 50,
          height: 50,
          position: "absolute",
          bottom: 120,
          left: 20,
          backgroundColor: "orange",
          borderRadius: 999,
        }}
      ></Pressable> */}
      <GlassPreviewBottomSecret
        color={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.darkerGlassBackground}
        borderColor={"transparent"}
        onPress_exit={handleExit}
        onPress_cancel={handleCancelPress}
      />
    </GradientBackgroundAppDefault>
  );
};

export default ScreenSecretGecko;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  title: {
    color: "white",
    fontSize: 18,
    marginBottom: 8,
  },
  label: {
    color: "white",
    fontSize: 13,
  },
});
