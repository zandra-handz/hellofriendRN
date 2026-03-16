import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import SvgIcon from "@/app/styles/SvgIcons";
// import useFriendDash from "@/src/hooks/useFriendDash";

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

const History = ({ userId, friendId, primaryColor, primaryOverlayColor }: Props) => {
  const { navigateToFriendHistory } = useAppNavigations();
  // const { loadingDash } = useFriendDash({ userId: userId, friendId: friendId });

  return (
    <>
      {friendId && (
        <View
          style={[
            styles.outerContainer,
            {
              backgroundColor:  primaryOverlayColor,
            },
          ]}
        >
          <View style={styles.innerContainer}>
            {/* {!loadingDash && ( */}
              <View style={styles.rowSpaceBetween}>
                <Pressable
                  hitSlop={10}
                  onPress={navigateToFriendHistory}
                  style={styles.row}
                >
                  <View style={styles.iconShadow}>
                    <SvgIcon
                      name="pie_chart"
                      size={20}
                      color={primaryColor}
                      style={styles.icon}
                    />
                  </View>
                  <OutlinedText
                    text="History"
                    color={primaryColor}
                    style={[styles.titleText, { color: primaryColor }]}
                  />
                </Pressable>
              </View>
            {/* )} */}
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
    alignItems: "center",
  },
  rowSpaceBetween: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  icon: {
    marginBottom: 0,
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

export default History;