import { View } from "react-native";
import React from "react";
import SwitchFriend from "../home/SwitchFriend";
import { AppFontStyles } from "@/app/styles/AppFonts";
import SelectedCategoryButton from "./SelectedCategoryButton";
import { useFriendDash } from "@/src/context/FriendDashContext";
// import useFriendDash from "@/src/hooks/useFriendDash";
import LoadingPage from "../appwide/spinner/LoadingPage";
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
  userDefaultCategory,
  themeColors,
  primaryColor,
  primaryBackground,
  lighterOverlayColor,

  capsuleList,

  updateExistingMoment,
  freezeCategory,
  onPress,
  label,
  categoryId,
  friendId,
  friendName,
  friendDefaultCategory,
}: Props) => {
  const ICON_SIZE = 16;

  const FONT_SIZE = 12;
  const { loadingDash } = useFriendDash();
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const welcomeTextStyle = AppFontStyles.welcomeText;
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
        {loadingDash && (
          <View style={{}}>
            <LoadingPage
              loading={true}
              color={themeColors.darkColor}
              spinnerType="flow"
              spinnerSize={30}
              includeLabel={false}
            />
          </View>
        )}

        {!loadingDash && (
          <>
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
                userDefaultCategory={userDefaultCategory}
                themeColors={themeColors} 
                primaryColor={primaryColor}
                lighterOverlayColor={lighterOverlayColor}
                primaryBackground={primaryBackground}
                capsuleList={capsuleList}
                friendDefaultCategory={friendDefaultCategory}
                fontSize={FONT_SIZE}
                fontSizeEditMode={FONT_SIZE}
                freezeCategory={freezeCategory}
                onPress={onPress}
                label={label}
                categoryId={categoryId}
                iconSize={ICON_SIZE}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default MomentFocusTray;
