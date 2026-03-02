import { View, StyleSheet} from "react-native";
import React from "react";
import SwitchFriend from "../home/SwitchFriend";
import { AppFontStyles } from "@/app/styles/AppFonts";
import SelectedCategoryButton from "./SelectedCategoryButton"; 
import useFriendDash from "@/src/hooks/useFriendDash";
import LoadingPage from "../appwide/spinner/LoadingPage";
 

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
  const { loadingDash } = useFriendDash({ userId: userId, friendId: friendId });

  const welcomeTextStyle = AppFontStyles.welcomeText;
  return (
    <View style={styles.container}>
        {loadingDash && (
          <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View>

            <LoadingPage
              loading={true}
              color={themeColors.darkColor}
              spinnerType="flow"
              spinnerSize={30}
              includeLabel={false}
            />
            </View>
          </View>
        )}


   {!loadingDash && (
      <View
        style={styles.innerContainer}
      >
  
          <View style={{ maxWidth: "100%" }}>
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
            <View style={{ maxWidth: "65%", flexShrink: 1 }}>
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
         
    
      </View>
           )}
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

  },
  innerContainer: {
    width: "100%",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  
});

export default MomentFocusTray;
