import { Text, ScrollView } from "react-native";
import React from "react";
import GlobalPressable from "../appwide/button/GlobalPressable"; 

// import { useFriendDash } from "@/src/context/FriendDashContext"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";

import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";

import useUpdateDefaultCategory from "@/src/hooks/SelectedFriendCalls/useUpdateDefaultCategory";

type Props = {
  categoryId: number;
};

const MakeDefaultCats = ({
  userId,
  userDefaultCategory,
  friendId,
  friendName = "friend name here",
  friendDefaultCategory,
  categoryId,
  primaryColor,
  subWelcomeTextStyle,
}: Props) => { 
 

  const { updateSettings } = useUpdateSettings({ userId: userId });
  const { handleUpdateDefaultCategory } = useUpdateDefaultCategory({
    userId: userId,
    friendId: friendId,
  });

  const isUserDefault = categoryId === userDefaultCategory;
  const isFriendDefault = categoryId === friendDefaultCategory;

  const handleRemoveUserDefault = async () => {
    await updateSettings({ user_default_category: null });
  };

  const handleMakeUserDefault = async () => {
    await updateSettings({ user_default_category: categoryId });
  };

  const handleRemoveFriendDefault = () => {
    handleUpdateDefaultCategory({ categoryId: null });
  };

  const handleMakeFriendDefault = () => {
    handleUpdateDefaultCategory({ categoryId: categoryId });
  };

  const FONT_SIZE = 12;
  const ICON_SIZE = 18;

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{
        flexDirection: "row",
        // backgroundColor: "pink",
        height: "auto",

        // width: "100%",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <GlobalPressable
        onPress={
          isUserDefault ? handleRemoveUserDefault : handleMakeUserDefault
        }
        style={{
          alignItems: "center",
          paddingVertical: 6,
          paddingHorizontal: 20,
          borderRadius: 999,
          flexDirection: "row",
          width: "100%",

          //   backgroundColor: "red",
        }}
      >
        <MaterialCommunityIcons
          name={isUserDefault ? "star" : "star-outline"}
          color={primaryColor}
          style={{ marginRight: 10 }}
          size={ICON_SIZE}
        />
        <Text
          style={[ 
            subWelcomeTextStyle,
            { color: primaryColor, fontSize: FONT_SIZE },
          ]}
        >
          {isUserDefault ? `app default` : `Make app default`}{" "}
        </Text>
      </GlobalPressable>
      <GlobalPressable
        onPress={
          isFriendDefault ? handleRemoveFriendDefault : handleMakeFriendDefault
        }
        style={{
          alignItems: "center",
          paddingVertical: 6,
          paddingHorizontal: 20,
          borderRadius: 999,
          flexDirection: "row",
          width: "100%",
          //  backgroundColor: "red",
          height: "auto",
        }}
      >
        <MaterialCommunityIcons
          name={isFriendDefault ? "star" : "star-outline"}
          color={primaryColor}
          style={{ marginRight: 10 }}
          size={ICON_SIZE}
        />

        <Text
          style={[ 
            subWelcomeTextStyle,
            {color: primaryColor, fontSize: FONT_SIZE },
          ]}
        >
          {isFriendDefault
            ? `default for ${friendName}`
            : `Make default for ${friendName} `}{" "}
        </Text>
      </GlobalPressable>
    </ScrollView>
  );
};

export default MakeDefaultCats;
