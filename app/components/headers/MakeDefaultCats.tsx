import { View, Text, ScrollView } from "react-native";
import React from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import { useUserSettings } from "@/src/context/UserSettingsContext";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useUser } from "@/src/context/UserContext";

import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";

import useUpdateDefaultCategory from "@/src/hooks/SelectedFriendCalls/useUpdateDefaultCategory";

type Props = {
  categoryId: number;
};

const MakeDefaultCats = ({ categoryId }: Props) => {
  const { user } = useUser();
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { selectedFriend } =
    useSelectedFriend();

    const { friendDash } = useFriendDash();
  const { settings } = useUserSettings();
 

  const { updateSettings } = useUpdateSettings({userId: user?.id});
  const {handleUpdateDefaultCategory } = useUpdateDefaultCategory({userId: user?.id, friendId: selectedFriend?.id})

  const isUserDefault = categoryId === settings.user_default_category;
  const isFriendDefault =
    categoryId === friendDash?.friend_faves.friend_default_category;

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
        overflow: 'hidden',
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
           width: '100%',

       //   backgroundColor: "red",
        }}
      >
        <MaterialCommunityIcons
          name={isUserDefault ? "star" : "star-outline"}
          color={themeStyles.primaryText.color}
          style={{ marginRight: 10 }}
          size={ICON_SIZE}
        />
        <Text
          style={[
            themeStyles.primaryText,
            appFontStyles.subWelcomeText,
            { fontSize: FONT_SIZE },
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
        width: '100%',
        //  backgroundColor: "red",
          height: 'auto',
        }}
      >
        <MaterialCommunityIcons
          name={isFriendDefault ? "star" : "star-outline"}
          color={themeStyles.primaryText.color}
          style={{ marginRight: 10 }}
          size={ICON_SIZE}
        />
     
            
        <Text
          style={[
            themeStyles.primaryText,
            appFontStyles.subWelcomeText,
            { fontSize: FONT_SIZE  },
          ]}
        >
          {isFriendDefault
            ? `default for ${selectedFriend.name}`
            : `Make default for ${selectedFriend.name} `}{" "}
        </Text>
         
      </GlobalPressable>
    </ScrollView>
  );
};

export default MakeDefaultCats;
