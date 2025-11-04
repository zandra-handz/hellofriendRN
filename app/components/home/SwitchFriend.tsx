import { View, Text, StyleSheet } from "react-native";
import GlobalPressable from "../appwide/button/GlobalPressable";
import React from "react";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import SvgIcon from "@/app/styles/SvgIcons";

type Props = {
  fontSize: number;
  hideLabel: boolean;
  editMode: boolean;
  iconSize: number;
  maxWidth: number;
  zIndex: number;
};

//similar to topbar but has its own spinner instead of centering based on parent component
const SwitchFriend = ({
  nameLabel = "",
  primaryColor = "orange",
  lighterOverlayColor = 'red',
  fontSize = 13,
  editMode = false,
  maxWidth = 100,
  zIndex = 3,
}: Props) => {
  const { navigateToSelectFriend } = useAppNavigations();
 

  const handleNavigateToFriendSelect = () => {
    if (editMode) {
      navigateToSelectFriend({ useNavigateBack: true });
    } else {
      return;
    }
  };

  return (
    <>
      <GlobalPressable
        zIndex={zIndex}
        style={[styles.container, { borderColor: lighterOverlayColor }]}
        onPress={handleNavigateToFriendSelect}
      >
        <View>
          <View
            style={styles.topRowWrapper}
          > <SvgIcon name={'account'} size={10} color={primaryColor} /></View>

          <View style={{ flexDirection: "row" }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                {
                  zIndex: 2,
                  color: primaryColor,
                  fontSize: fontSize,
                  maxWidth: editMode ? maxWidth : maxWidth,
                },
              ]}
            >
              {nameLabel
                ? nameLabel.length > 12
                  ? `${nameLabel.slice(0, 12)}...`
                  : nameLabel
                : "Pick friend"}
            </Text>
          </View>
        </View>
      </GlobalPressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingHorizontal: 18,
    paddingTop: 3,
    height: 40,
    borderWidth: 0.8,
    borderRadius: 999,
    width: "100%",
    flexDirection: "column",
  },
    topRowWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    height: 10,
    flex: 1.
  },
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

export default SwitchFriend;
