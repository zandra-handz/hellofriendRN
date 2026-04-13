import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGeckoEnergySocket } from "@/src/hooks/useGeckoEnergySocket";
import { useLDTheme } from "@/src/context/LDThemeContext";
import MemoizedMirrorPlayGecko from "@/app/assets/shader_animations/MirrorPlayGecko";
import manualGradientColors from "@/app/styles/StaticColors";
import GradientBackgroundAppDefault from "@/app/components/appwide/format/GradientBackgroundAppDefault";
import PeerGeckoPositionText from "@/app/components/fidget/PeerGeckoPositionText";
// optional (only if you added backend broadcast)
// import PeerEnergyText from "@/app/components/debug/PeerEnergyText";

type Props = {};

const ScreenSecretGecko = (props: Props) => {
  const {
    socketStatus,
    liveSeshPartnerId,
    energySV,
    peerGeckoPositionSV,
    // peerEnergySV, // only if you added it
    joinLiveSesh,
    leaveLiveSesh,
    sendGeckoPosition,
  } = useGeckoEnergySocket(null);

  const sendGeckoPositionRef = useRef(sendGeckoPosition);
  useEffect(() => {
    sendGeckoPositionRef.current = sendGeckoPosition;
  }, [sendGeckoPosition]);

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
        peerGeckoPositionSV={peerGeckoPositionSV}
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
              peerGeckoPositionSV={peerGeckoPositionSV}
              sendGeckoPositionRef={sendGeckoPositionRef}
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