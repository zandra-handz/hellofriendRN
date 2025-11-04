import { View, StyleSheet, Pressable } from "react-native";
import React from "react";
import SwitchFriend from "../home/SwitchFriend";
import { AppFontStyles } from "@/app/styles/AppFonts";
import SelectedCategoryButton from "./SelectedCategoryButton";
// import { useFriendDash } from "@/src/context/FriendDashContext";
import useFriendDash from "@/src/hooks/useFriendDash";
import LoadingPage from "../appwide/spinner/LoadingPage";
import ActionAndBack from "./ActionAndBack";
import SvgIcon from "@/app/styles/SvgIcons";

type Props = {
  updateExistingMoment: boolean;
  paddingTop: number;
  freezeCategory: boolean;
  onPress: () => void;
  label: string;
  categoryId: number;
  friendId: number;
  friendName: string;
  userId: number;
  userDefaultCategory: number;

};

const MomentFocusTray = ({
  userId,
  userDefaultCategory,
  handleSave,
  themeColors,
  primaryColor,
  primaryBackground,
  lighterOverlayColor,
  navigateBack,
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
  const { loadingDash } = useFriendDash({ userId: userId, friendId: friendId });

  const welcomeTextStyle = AppFontStyles.welcomeText;
  return (
    <View style={styles.container}>
      <View
        style={styles.innerContainer}
      >
        <Pressable
          hitSlop={10}
          style={styles.backButtonWrapper}
          onPress={navigateBack}
        >
          <SvgIcon name={"chevron_left"} size={20} color={primaryColor} />
        </Pressable>

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
          <View style={{ maxWidth: "80%" }}>
              <SwitchFriend
              lighterOverlayColor={lighterOverlayColor}
              nameLabel={friendName}
                primaryColor={primaryColor}
                welcomeTextStyle={welcomeTextStyle}
                maxWidth={"100%"}
                fontSize={FONT_SIZE}
                editMode={!updateExistingMoment}
                iconSize={ICON_SIZE}
              />
            </View>
            <View style={{ maxWidth: "35%", flexShrink: 1 }}>
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
        <View style={styles.saveButtonWrapper}>
          <ActionAndBack onPress={handleSave} rounded={true} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  innerContainer: {
    width: "100%",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  saveButtonWrapper: {
    paddingHorizontal: 10,
  },
  backButtonWrapper: {
    paddingHorizontal: 10,
    borderRadius: 999,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MomentFocusTray;
