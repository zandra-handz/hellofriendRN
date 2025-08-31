import React, { useCallback } from "react";
import { View, Text, Pressable, DimensionValue } from "react-native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import LoadingPage from "../appwide/spinner/LoadingPage";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
 

import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons"; 

interface FriendModalIntegratorProps {
  addToPress: () => void;
  color: string;
  height: DimensionValue;
  addToOpenModal: () => void;
  includeLabel: boolean;
  navigationDisabled: boolean;
  useGenericTextColor?: boolean;
  iconSize: number;
  width: DimensionValue;
  customLabel: string | null;
  customFontStyle: object | null;
}

const FriendModalIntegrator: React.FC<FriendModalIntegratorProps> = ({
  addToPress,
  color,
  height = "auto",
  customLabel = "",
  customFontStyle,
  addToOpenModal,
  useGenericTextColor = false,
  includeLabel = false,
  iconSize = 22,
  width = "auto",
  // friendId, // trying to just use name, but this is available if needed
  friendName,
  themeAheadOfLoading,
  primaryColor='orange',
}) => {
  // console.log("FRIEND SELECTOR RERENDERED");
 
  const navigation = useNavigation(); 
  const { loadingDash } = useFriendDash(); 

  const firstSelectLabel = customLabel ? customLabel : `Pick friend: `;

  const defaultLabelStyle = {
    fontWeight: "bold",
    fontSize: 15,
  };

  const RenderText = useCallback(
    () => (
      <Text
        style={[
          customFontStyle ? customFontStyle : defaultLabelStyle,
          {
            color:
              friendName && !useGenericTextColor
                ? themeAheadOfLoading.fontColorSecondary
                : primaryColor,

            zIndex: 2,
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {(!useGenericTextColor && `For:  ${friendName}`) ||
          firstSelectLabel}
      </Text>
    ),
    [
      customFontStyle,

      defaultLabelStyle,
      friendName,
      themeAheadOfLoading,
      primaryColor,
    ]
  );

  const RenderIcon = useCallback(
    () => (
      <MaterialCommunityIcons
        name="account-switch-outline"
        size={iconSize}
        color={
          loadingDash
            ? "transparent"
            : friendName && !useGenericTextColor
              ? color || themeAheadOfLoading.fontColorSecondary
              : primaryColor
        }
      />
    ),
    [loadingDash, friendName, themeAheadOfLoading, primaryColor]
  );

  return (
    <>
      <Pressable
        // onPress={openModal}
        onPress={() => navigation.navigate("SelectFriend")}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Friend selector button"
        style={{
          flexDirection: "row",
          height: height,
          alignItems: "center",

          width: width,
        }}
      >
        <View
          style={{
            width: "auto",
            height: "100%",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          {loadingDash && (
            <View style={{ paddingRight: "14%" }}>
              <LoadingPage
                loading={true}
                spinnerType="flow"
                spinnerSize={30}
                color={themeAheadOfLoading.darkColor}
                includeLabel={false}
              />
            </View>
          )}

          {!loadingDash && includeLabel && <RenderText />}

          <View style={{ paddingLeft: 0, marginLeft: 6 }}>
            <RenderIcon />
          </View>
        </View>
      </Pressable>
    </>
  );
};

export default FriendModalIntegrator;
