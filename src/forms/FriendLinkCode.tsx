import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Pressable,
} from "react-native";
import useFriendLinkCode from "../hooks/useFriendLinkCode";
import manualGradientColors from "@/app/styles/StaticColors";
import QRCode from "react-native-qrcode-skia";
import SendTextButton from "@/app/components/appwide/button/SendTextButton";

interface FriendLinkCodeProps {
  userId: number;
  viewCode: boolean;
  color: string;
}

const FriendLinkCode: React.FC<FriendLinkCodeProps> = ({
  userId,
  viewCode = false,
  color = "orange",
}) => {
  const { data, code, secondsTillExpires, refetch, isLoading } = useFriendLinkCode({
    userId: userId,
    enabled: viewCode,
  });

  const [countdown, setCountdown] = useState(secondsTillExpires ?? 0);

  useEffect(() => {
    if (!secondsTillExpires) return;
    setCountdown(secondsTillExpires);
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          refetch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [data?.expires_at]);

  return (
    <View style={styles.container}>
      <View style={styles.qrWrapper}>
        {!code ? (
          <ActivityIndicator size="large" color={color} />
        ) : code ? (
          <>
            <QRCode color={color} size={150} value={code} />
            <View style={styles.codeTextWrapper}>
              <Text style={[styles.codeText, {color: color}]}>{code}</Text>
            </View>
            <Text style={{color: color}}>{countdown}s</Text>
            <SendTextButton
              phoneNumber={null}
              message={`My hellofriend code: ${code}`}
              confirmTitle="Share code"
              onAddPhoneNumber={() => {}}
            >
              <View style={styles.sendBtn}>
                <Text style={styles.sendText}>Text code</Text>
              </View>
            </SendTextButton>
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1, 
    gap: 12,
    height: 340,
  },
  qrWrapper: {
    width: "100%",
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
  },
  codeText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  codeTextWrapper: {
    marginVertical: 10,
  },
  sendBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  sendText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  fullWidth: { width: "100%" },
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  tabActive: {
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  tabSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  tabLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
  },
  tabLabelActive: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Poppins_700Bold",
  },
  pickerWrapper: {
    width: "100%",
    gap: 8,
  },
  panel: {
    borderRadius: 12,
    height: 160, // much shorter than default
  },
  hue: {
    borderRadius: 12,
    marginTop: 8,
  },
  preview: {
    flexDirection: "row",
    height: 28,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  previewHalf: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  swapBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  swapText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: manualGradientColors.lightColor,
    alignItems: "center",
  },
  saveText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
    color: manualGradientColors.homeDarkColor,
  },
});

export default FriendLinkCode;
