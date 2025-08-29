import { View, Text, Pressable } from "react-native";
import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import LoadingPage from "../appwide/spinner/LoadingPage";
import { ThemeAheadOfLoading } from "@/src/types/FriendTypes";

interface FontStyles {
  welcome: object;
  subWelcome: object;
}

type Props = {
  loading: boolean;
  style: ThemeAheadOfLoading; // friendStyle
  textStyle: object;
  textColor: string;
  fontStyles: FontStyles;

  backgroundColor: string; // themeStyles.primaryBackground
  onPress: () => void;
};

const TopBarHome = ({
  loading,
  style,
  textStyle,
  textColor,

  fontStyle,
  backgroundColor,
  onPress,
}: Props) => {
  const navigation = useNavigation();

  const handleNavigateToFriendSelect = () => {
    navigation.navigate("SelectFriend");
  };

  const RenderIcon = useCallback(
    () => (
      <Pressable
        onPress={handleNavigateToFriendSelect}
        style={{ flexDirection: "row" }}
      >
        <Text style={[fontStyle, { color: textColor }]}>Switch</Text>
        <MaterialCommunityIcons
          name="account-switch-outline"
          size={20}
          color={textColor}
          style={{ marginHorizontal: 10 }}
        />
      </Pressable>
    ),
    [handleNavigateToFriendSelect, textStyle, fontStyle]
  );
  return (
    <View
      style={{
        height: "auto",
        paddingBottom: 10,
        width: "100%",
        backgroundColor: backgroundColor,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {loading && (
        <View style={{ width: "100%" }}>
          <LoadingPage
            loading={true}
            spinnerType="flow"
            spinnerSize={30}
            color={style.darkColor}
            includeLabel={false}
          />
        </View>
      )}
      {!loading && <RenderIcon />}
    </View>
  );
};

export default TopBarHome;
