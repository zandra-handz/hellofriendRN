import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import SvgIcon from "@/app/styles/SvgIcons";
import useImages from "@/src/hooks/ImageCalls/useImages";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
// import { useFriendDash } from "@/src/context/FriendDashContext";
import useFriendDash from "@/src/hooks/useFriendDash";

type Props = {
  userId: number;
  friendId: number;
  primaryColor: string;
  primaryOverlayColor: string;
};

const Pics = ({ userId, friendId, primaryColor, primaryOverlayColor }: Props) => {
  const navigation = useNavigation();
    const { loadingDash } = useFriendDash({userId: userId, friendId: friendId});
  const { imageList } = useImages({ userId: userId, friendId: friendId, enabled: !loadingDash});
  const { handleCaptureImage, handleSelectImage } = useImageUploadFunctions();

  const isLoading = loadingDash;

  const navigateToImages = () => {
    navigation.navigate("ImageView", { startingIndex: 0 });
  };

  return (
    <>
      {friendId && (
        <View
          style={[
            styles.outerContainer,
            {
              backgroundColor: isLoading ? "transparent" : primaryOverlayColor, // dynamic
            },
          ]}
        >
          <View style={styles.innerContainer}>
            {!isLoading && (
              <View style={styles.rowSpaceBetween}>
                <Pressable
                  hitSlop={10}
                  onPress={
                    imageList && imageList.length > 0
                      ? navigateToImages
                      : () => {}
                  }
                  style={styles.row}
                >
                  <SvgIcon
                    name="image_multiple_outline"
                    size={20}
                    color={primaryColor} // dynamic
                    style={styles.icon}
                  />
                  <Text
                    style={[
                      styles.titleText,
                      { color: primaryColor }, // dynamic
                    ]}
                  >
                    Pics ({imageList && imageList.length})
                  </Text>
                </Pressable>

                <View style={styles.rightButtonGroup}>
                  <Pressable hitSlop={10} onPress={handleCaptureImage}>
                    <Text
                      style={[
                        styles.actionText,
                        { color: primaryColor }, // dynamic
                      ]}
                    >
                      Camera
                    </Text>
                  </Pressable>

                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: primaryColor }, // dynamic
                    ]}
                  />

                  <Pressable hitSlop={10} onPress={handleSelectImage}>
                    <Text
                      style={[
                        styles.actionText,
                        { color: primaryColor }, // dynamic
                      ]}
                    >
                      Upload
                    </Text>
                  </Pressable>
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
    borderRadius: 20,
    flexDirection: "row",
    height: 40,
    width: "100%",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  rowSpaceBetween: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  icon: {
    marginBottom: 0,
  },
  titleText: {
    marginLeft: 15, 
    fontSize: 13,
    fontWeight: 'bold',
    // fontWeight: "bold",
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
