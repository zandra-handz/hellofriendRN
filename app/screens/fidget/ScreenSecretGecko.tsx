import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGeckoEnergySocket } from "@/src/hooks/useGeckoEnergySocket";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useCurrentLiveSesh from "@/src/hooks/LiveSeshCalls/useCurrentLiveSesh";
import MemoizedMirrorPlayGecko from "@/app/assets/shader_animations/MirrorPlayGecko";
import manualGradientColors from "@/app/styles/StaticColors";
import GradientBackgroundAppDefault from "@/app/components/appwide/format/GradientBackgroundAppDefault";
import PeerGeckoPositionText from "@/app/components/fidget/PeerGeckoPositionText";
import useUser from "@/src/hooks/useUser";
// optional (only if you added backend broadcast)
// import PeerEnergyText from "@/app/components/debug/PeerEnergyText";

type Props = {};

const ScreenSecretGecko = (props: Props) => {
  const {
    socketStatus,
    liveSeshPartnerId,
    energySV,
    peerGeckoPositionSV,
    hostPeerGeckoPositionSV,

    // peerEnergySV, // only if you added it
    joinLiveSesh,
    leaveLiveSesh,
    sendGeckoPosition,
    sendGuestGeckoPosition,
    registerOnHostGeckoCoords,
  } = useGeckoEnergySocket(null);

const { user } = useUser();
  const { isHost } = useCurrentLiveSesh({userId: user?.id, enabled: true})

  const noopSendGuestGeckoPosition = useRef(() => {}).current;
  const sendGuestGeckoPositionRef = useRef(
    !isHost ? sendGuestGeckoPosition : noopSendGuestGeckoPosition
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
      <Text style={styles.title}>Secret Gecko</Text>

      <Text style={styles.label}>
        socket: {socketStatus}
      </Text>

      <Text style={styles.label}>
        partner: {liveSeshPartnerId ?? "—"}
      </Text>
 
      <PeerGeckoPositionText
        peerGeckoPositionSV={hostPeerGeckoPositionSV}
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
              hostPeerGeckoPositionSV={hostPeerGeckoPositionSV}
              sendGuestGeckoPositionRef={sendGuestGeckoPositionRef}
            />
          </View>
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