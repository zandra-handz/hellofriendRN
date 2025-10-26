import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useHelloes } from "@/src/context/HelloesContext";
import { useFriendDash } from "@/src/context/FriendDashContext";

type Props = {
  primaryColor: string;
  primaryOverlayColor: string;
  friendId: string;
};

const Helloes = ({ primaryColor, primaryOverlayColor, friendId }: Props) => {
  const { helloesList } = useHelloes();
  const { loadingDash } = useFriendDash();
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
            { backgroundColor: isLoading ? "transparent" : primaryOverlayColor },
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
                  <MaterialCommunityIcons
                    name="calendar-heart"
                    size={20}
                    color={primaryColor}
                    style={styles.icon}
                  />
                  <Text style={[styles.titleText, { color: primaryColor }]}>
                    Helloes ({trueHelloesInList && trueHelloesInList.length})
                  </Text>
                </Pressable>

                <Pressable hitSlop={10} onPress={navigateToHelloes}>
                  <Text style={[styles.actionText, { color: primaryColor }]}>
                    Details
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

export default Helloes;
