import { View, Text, Modal } from "react-native";
import React from "react";
import QRCode from "react-native-qrcode-skia";
import AppModal from "@/app/components/alerts/AppModal";
import SvgIcon from "@/app/styles/SvgIcons";
type Props = {
  textColor: string;
  backgroundColor: string;
  isVisible: boolean;
  onClose: () => void;
};

const QRCodeModal = ({
  textColor,
  backgroundColor,
  isVisible = false,
  onClose,
}: Props) => {
  return (
    <>
      {isVisible && (
        <AppModal
          primaryColor={textColor}
          backgroundColor={backgroundColor}
          isFullscreen={false}
          isVisible={isVisible}
          headerIcon={
            <SvgIcon name={"cog-outline"} size={30} color={textColor} />
          }
          questionText="Choose selection mode"
          onClose={onClose}
          modalIsTransparent={false}
        >
          <Text>QRCodeModal</Text>
        </AppModal>
      )}
    </>
  );
};

export default QRCodeModal;
