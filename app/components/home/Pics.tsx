import { View, Text, StyleSheet } from "react-native";
import GlobalPressable from "../appwide/button/GlobalPressable";
import React from "react";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import SvgIcon from "@/app/styles/SvgIcons";
import useImages from "@/src/hooks/ImageCalls/useImages";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
import useFriendDash from "@/src/hooks/useFriendDash";

const SHADOW_COLOR = "rgba(0,0,0,0.95)";
const OUTLINE_COLOR = "rgba(0,0,0,0.95)";
const OUTLINE_R = 1;

type Props = {
  userId: number;
  friendId: number;
  primaryColor: string;
  primaryOverlayColor: string;
};

const OutlinedText = ({ text, color, style }: { text: string; color: string; style: any }) => (
  <View style={styles.outlineContainer}>
    <Text style={[style, { color: OUTLINE_COLOR, position: "absolute", left: -OUTLINE_R }]}>{text}</Text>
    <Text style={[style, { color: OUTLINE_COLOR, position: "absolute", left: OUTLINE_R }]}>{text}</Text>
    <Text style={[style, { color: OUTLINE_COLOR, position: "absolute", top: -OUTLINE_R }]}>{text}</Text>
    <Text style={[style, { color: OUTLINE_COLOR, position: "absolute", top: OUTLINE_R }]}>{text}</Text>
    <Text style={[style, { color: SHADOW_COLOR, position: "absolute", top: 3 }]}>{text}</Text>
    <Text style={[style, { color }]}>{text}</Text>
  </View>
);

const Pics = ({ userId, friendId, primaryColor, primaryOverlayColor }: Props) => {
  const { navigateToImages } = useAppNavigations();
  const { loadingDash } = useFriendDash({ userId: userId, friendId: friendId });
  const { imageList } = useImages({ userId: userId, friendId: friendId, enabled: !loadingDash });
  const { handleCaptureImage, handleSelectImage } = useImageUploadFunctions();

  return (
    <>
      {friendId && (
        <View
          style={[
            styles.outerContainer,
            {
              backgroundColor: loadingDash ? "transparent" : primaryOverlayColor,
            },
          ]}
        >
          <View style={styles.innerContainer}>
            {!loadingDash && (
              <View style={styles.rowSpaceBetween}>
                <GlobalPressable
                  hitSlop={10}
                  onPress={
                    imageList && imageList.length > 0 ? navigateToImages : () => {}
                  }
                >
                  <View style={styles.leftContent}>
                    <View style={styles.iconShadow}>
                      <SvgIcon
                        name="image_multiple_outline"
                        size={20}
                        color={primaryColor}
                      />
                    </View>
                    <OutlinedText
                      text={`Pics (${imageList && imageList.length})`}
                      color={primaryColor}
                      style={[styles.titleText, { color: primaryColor }]}
                    />
                  </View>
                </GlobalPressable>

                <View style={styles.rightButtonGroup}>
                  <GlobalPressable hitSlop={10} onPress={handleCaptureImage}>
                    <OutlinedText
                      text="Camera"
                      color={primaryColor}
                      style={[styles.actionText, { color: primaryColor }]}
                    />
                  </GlobalPressable>

                  <View style={[styles.divider, { backgroundColor: primaryColor }]} />

                  <GlobalPressable hitSlop={10} onPress={handleSelectImage}>
                    <OutlinedText
                      text="Upload"
                      color={primaryColor}
                      style={[styles.actionText, { color: primaryColor }]}
                    />
                  </GlobalPressable>
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    overflow: "hidden",
    height: 30,
    flexShrink: 1,
    width: "100%",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
  },
  innerContainer: {
    flexDirection: "row",
    height: 40,
    width: "100%",
    alignItems: "center",
  },
  rowSpaceBetween: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconShadow: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.95,
    shadowRadius: 1,
    elevation: 4,
  },
  outlineContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    marginLeft: 15,
    fontSize: 13,
    fontWeight: "bold",
  },
  rightButtonGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    fontWeight: "bold",
    fontSize: 13,
  },
  divider: {
    width: 1,
    height: "100%",
    opacity: 0.7,
    marginHorizontal: 10,
  },
});

export default Pics;