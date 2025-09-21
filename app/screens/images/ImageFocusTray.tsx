import { View } from "react-native";
import React from "react"; 
import SwitchFriend from "@/app/components/home/SwitchFriend";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
 
import { useFriendDash } from "@/src/context/FriendDashContext";
 ;
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
type Props = {
  updateExistingMoment: boolean;
  paddingTop: number;
  freezeCategory: boolean;
  onPress: () => void;
  label: string;
  categoryId: number;
  friendId: number;
};

const ImageFocusTray = ({
  userId,
  userDefaultCategory,
  themeAheadOfLoading,
  primaryColor, 
}: Props) => {
  const ICON_SIZE = 16;

  const FONT_SIZE = 12;
  const { loadingDash } = useFriendDash(); 

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
              color={themeAheadOfLoading.darkColor}
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
                editMode={true} //change this if using this image add screen as dual create/edit screen in future
                iconSize={ICON_SIZE}
              />
            </View>
 
          </>
        )}
      </View>
    </View>
  );
};

export default ImageFocusTray;
