import { View } from "react-native";
import React from "react";
import SwitchFriend from "../home/SwitchFriend";

import SelectedCategoryButton from "./SelectedCategoryButton";

type Props = {
  updateExistingMoment: boolean;
  paddingTop: number;
  freezeCategory: boolean;
  onPress: () => void;
  label: string;
  categoryId: number;
  friendId: number;
};

const MomentFocusTray = ({
  userId,
  welcomeTextStyle,
  primaryColor,
  primaryBackground,
  manualGradientColors,
  subWelcomeTextStyle,
  userCategories,
  capsuleList,
  updateExistingMoment,
  paddingTop = 10,
  freezeCategory,
  onPress,
  label,
  categoryId,
  friendId,
  friendName,
  friendDefaultCategory,
}: Props) => {
  const ICON_SIZE = 20;

  const FONT_SIZE = 13;
  return (
    <View
      style={{
        width: "100%",
        height: 40,

        //  position: "absolute",

        // top: paddingTop,
        paddingRight: 20,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <View style={{ paddingRight: 30 }}>
          <SwitchFriend
            primaryColor={primaryColor}
            welcomeTextStyle={welcomeTextStyle}
            maxWidth={"100%"}
            fontSize={FONT_SIZE}
            editMode={!updateExistingMoment}
            iconSize={ICON_SIZE}
          />
        </View>
        <View style={{ maxWidth: "50%" }}>
          <SelectedCategoryButton
          userId={userId}
            friendId={friendId}
            friendName={friendName}
          primaryColor={primaryColor}
          primaryBackground={primaryBackground}
         subWelcomeTextStyle={subWelcomeTextStyle}
            manualGradientColors={manualGradientColors}
            userCategories={userCategories}
            capsuleList={capsuleList}
            welcomeTextStyle={welcomeTextStyle}
          
            friendDefaultCategory={friendDefaultCategory}
            maxWidth={"100%"}
            zIndex={3}
            fontSize={FONT_SIZE}
            fontSizeEditMode={FONT_SIZE}
            freezeCategory={freezeCategory}
            onPress={onPress}
            label={label}
            categoryId={categoryId}
            editMode={true}
            iconSize={ICON_SIZE}
          />
        </View>
      </View>
    </View>
  );
};

export default MomentFocusTray;
