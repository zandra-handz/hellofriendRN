import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { AppFontStyles } from "@/app/styles/AppFonts";
import useAppNavigations from "@/src/hooks/useAppNavigations";

const MomentsAddedStatic: React.FC<MomentsAddedProps> = ({
  overlayBackgroundColor,
  darkerOverlayColor,
  primaryColor,
  capsuleList,
  preAdded,
}) => {
  const navigation = useNavigation();
  const { navigateToPreAdded } = useAppNavigations();

  return (
    <View style={styles.outerWrapper}>
      <View style={[styles.innerWrapper, { backgroundColor: overlayBackgroundColor }]}>
        {/* <Text style={[AppFontStyles.subWelcomeText, styles.text, { color: primaryColor }]}>
          Total ideas: {capsuleList?.length + preAdded?.length}
        </Text> */}
        <View style={styles.row}>
          {/* <Text style={[
            //AppFontStyles.subWelcomeText,
             styles.text, { color: primaryColor }]}>
            Added: {preAdded?.length}
          </Text> */}
          {preAdded?.length > 0 && (
            <Pressable style={styles.restoreButton} onPress={navigateToPreAdded}>
              <Text
                style={[
                  AppFontStyles.subWelcomeText,
                  styles.restoreText,
                  { color: primaryColor, backgroundColor: darkerOverlayColor },
                ]}
              >
                Restore  ({preAdded?.length})
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    height: 100,
    width: "100%",
    // alignItems: "center",
    flexDirection: "column",
   // position: "absolute",
    // justifyContent: "center",
    top: 100,
    bottom: 200,
    right: 0,
    left: 0,
    zIndex: 1,
    paddingHorizontal: 20,
  },
  innerWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    height: "auto",
    width: "100%",
    borderRadius: 999,
    padding: 10,
  },
  row: {
  //  paddingHorizontal: 10,
    flexDirection: "row",
    width: "100%",
    // justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
  },
  restoreButton: {
    height: "100%",
    alignItems: "center",
  },
  restoreText: {
   // marginLeft: 6,
    fontSize: 13,
    paddingHorizontal: 14,
    borderRadius: 999,
    fontWeight: 'bold',
  },
});

export default MomentsAddedStatic;