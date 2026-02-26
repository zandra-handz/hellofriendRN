import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useMemo } from "react";

import useAppNavigations from "@/src/hooks/useAppNavigations";
import SvgIcon from "@/app/styles/SvgIcons";
import useHelloes from "@/src/hooks/useHelloes";
import useFriendDash from "@/src/hooks/useFriendDash";

type Props = {
  primaryColor: string;
  primaryOverlayColor: string;
  friendId: string;
};

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
    return (
      helloesList?.filter((hello) => hello.manual_reset === undefined) ?? []
    );
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
                  <SvgIcon
                    name="calendar"
                    size={20}
                    color={primaryColor}
                    style={styles.icon}
                  />
                  <Text style={[styles.titleText, { color: primaryColor }]}>
                    Helloes ({trueHelloesInList && trueHelloesInList.length})
                  </Text>
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
    fontWeight: "bold",
  }, 
});

export default Helloes;
