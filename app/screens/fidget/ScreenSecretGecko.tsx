import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import useCancelCurrentLiveSesh from "@/src/hooks/LiveSeshCalls/useCancelLiveSesh";
import { useGeckoEnergySocket } from "@/src/hooks/useGeckoEnergySocket";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useCurrentLiveSesh from "@/src/hooks/LiveSeshCalls/useCurrentLiveSesh";
import MemoizedMirrorPlayGecko from "@/app/assets/shader_animations/MirrorPlayGecko";
import manualGradientColors from "@/app/styles/StaticColors";
import GradientBackgroundAppDefault from "@/app/components/appwide/format/GradientBackgroundAppDefault";
import PeerGeckoPositionText from "@/app/components/fidget/PeerGeckoPositionText";
import useUser from "@/src/hooks/useUser";
import { useNavigation } from "@react-navigation/native";
import GlassPreviewBottomSecret from "./GlassPreviewBottomSecret";
// optional (only if you added backend broadcast)
// import PeerEnergyText from "@/app/components/debug/PeerEnergyText";

type Props = {};

const ScreenSecretGecko = (props: Props) => {
  const {
    socketStatus,
    liveSeshPartnerId,
    energySV,
    peerGeckoPositionSV,
    guestPeerGeckoPositionSV,
    hostPeerGeckoPositionSV,

    // peerEnergySV, // only if you added it
    joinLiveSesh,
    leaveLiveSesh,
    sendGeckoPosition,
    sendGuestGeckoPosition,
    registerOnHostGeckoCoords,
  } = useGeckoEnergySocket(null);

  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const navigation = useNavigation();
  const handleExit = React.useCallback(() => {
    leaveLiveSesh();
    navigation.goBack();
  }, [leaveLiveSesh, navigation]);
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
            navigation.goBack();
          },
        },
      ],
    );
  }, [handleCancelCurrentLiveSesh, leaveLiveSesh, navigation]);
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

  useEffect(() => {
    // auto join when screen mounts
    joinLiveSesh();

    return () => {
      leaveLiveSesh();
    };
  }, [joinLiveSesh, leaveLiveSesh]);

  return (
    <GradientBackgroundAppDefault style={styles.backgroundContainer}>
      <Text style={styles.label}>socket: {socketStatus}</Text>

      <Text style={styles.label}>partner: {liveSeshPartnerId ?? "—"}</Text>

      <PeerGeckoPositionText
        peerGeckoPositionSV={guestPeerGeckoPositionSV}
        color="white"
      />

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
          hostPeerGeckoPositionSV={peerGeckoPositionSV}
          sendGuestGeckoPositionRef={sendGuestGeckoPositionRef}
        />
      </View>
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
