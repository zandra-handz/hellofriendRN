import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import SvgIcon from "@/app/styles/SvgIcons";
import useLinkUserToFriend from "@/src/hooks/FriendCalls/useLinkUserToFriend";

interface Props {
  userId: number;
  friendId: number;
  color: string;
  viewCode: boolean;
}

const LinkUserWithCode: React.FC<Props> = ({ userId, friendId, color, viewCode }) => {
  const { handleLinkUser, linkMutation } = useLinkUserToFriend({ userId, friendId });
  const [code, setCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const hasScannedRef = React.useRef(false);

  const handleSubmit = () => {
    if (!code.trim()) return;
    handleLinkUser(code.trim());
  };

  const handleToggleScanner = async () => {
    if (scanning) {
      setScanning(false);
      return;
    }
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    hasScannedRef.current = false;
    setScanning(true);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (hasScannedRef.current) return;
    hasScannedRef.current = true;
    setCode(data);
    setScanning(false);
  };

  return (
    <View style={styles.container}>
      {scanning ? (
        <View style={styles.scannerWrapper}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleBarCodeScanned}
          />
          <Pressable onPress={() => setScanning(false)} style={styles.closeScannerButton}>
            <SvgIcon name="close" size={18} color="#ffffff" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.qrWrapper}>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.codeInput, { color, borderColor: color }]}
              placeholder="Enter code"
              placeholderTextColor={color + "60"}
              value={code}
              onChangeText={setCode}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable onPress={handleToggleScanner} style={[styles.qrButton, { borderColor: color }]}>
              <SvgIcon name="qrcode_scan" size={22} color={color} />
            </Pressable>
          </View>

          <Pressable
            style={[styles.sendBtn, linkMutation.isPending && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={linkMutation.isPending || !code.trim()}
          >
            {linkMutation.isPending ? (
              <ActivityIndicator size="small" color="rgba(255,255,255,0.9)" />
            ) : (
              <Text style={styles.sendText}>Link user</Text>
            )}
          </Pressable>

          {linkMutation.isSuccess && (
            <Text style={[styles.messageText, { color }]}>User linked!</Text>
          )}
          {linkMutation.isError && (
            <Text style={[styles.messageText, { color: "red" }]}>
              {linkMutation.error?.message ?? "Failed to link user"}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    gap: 12,
    height: 200,
  },
  qrWrapper: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  codeInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
  },
  qrButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    width: 46,
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
  messageText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    marginTop: 8,
  },
  scannerWrapper: {
    width: "100%",
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  closeScannerButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },
});

export default LinkUserWithCode;
