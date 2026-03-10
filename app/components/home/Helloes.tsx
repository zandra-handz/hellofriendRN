import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useMemo } from "react";

import useAppNavigations from "@/src/hooks/useAppNavigations";
import SvgIcon from "@/app/styles/SvgIcons";
import useHelloes from "@/src/hooks/useHelloes";
import useFriendDash from "@/src/hooks/useFriendDash";

const SHADOW_COLOR = "rgba(0,0,0,0.95)";
const OUTLINE_COLOR = "rgba(0,0,0,0.95)";
const OUTLINE_R = 1;

type Props = {
  primaryColor: string;
  primaryOverlayColor: string;
  friendId: string;
  userId: number;
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

const Helloes = ({
  primaryColor,
  primaryOverlayColor,
  userId,
  friendId,
}: Props) => {
  const { helloesList } = useHelloes({ userId: userId, friendId: friendId });
  const { loadingDash } = useFriendDash({ userId: userId, friendId: friendId });
  const isLoading = loadingDash;

  const trueHelloesInList = useMemo(() => {
    return helloesList?.filter((hello) => hello.manual_reset === undefined) ?? [];
  }, [helloesList]);

  const { navigateToHelloes } = useAppNavigations();

  return (
    <>
      {friendId && (
        <View
          style={[
            styles.outerContainer,
            {
              backgroundColor: isLoading ? "transparent" : primaryOverlayColor,
            },
          ]}
        >
          <View style={styles.innerContainer}>
            {!isLoading && (
              <View style={styles.rowSpaceBetween}>
                <Pressable
                  hitSlop={10}
                  onPress={
                    trueHelloesInList && trueHelloesInList.length > 0
                      ? navigateToHelloes
                      : () => {}
                  }
                  style={styles.row}
                >
                  <View style={styles.iconShadow}>
                    <SvgIcon
                      name="chart_timeline_variant_shimmer"
                      size={20}
                      color={primaryColor}
                      style={styles.icon}
                    />
                  </View>
                  <OutlinedText
                    text={`Helloes (${trueHelloesInList && trueHelloesInList.length})`}
                    color={primaryColor}
                    style={[styles.titleText, { color: primaryColor }]}
                  />
                </Pressable>
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
});

export default Helloes;