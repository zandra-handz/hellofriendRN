import { View, Text, Pressable } from "react-native";
import React, { useCallback } from "react";
import FriendModalIntegrator from "../friends/FriendModalIntegrator";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFriendList } from "@/src/context/FriendListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "../appwide/spinner/LoadingPage";

type Props = {};

const TopBar = (props: Props) => {
  const { appFontStyles, themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const navigation = useNavigation();
  const friendModalButtonHeight = 16;

const handleNavigateToFriendSelect = () => {
    navigation.navigate("SelectFriend");

};

  const RenderIcon = useCallback(
    () => (
        <Pressable onPress={handleNavigateToFriendSelect} style={{flexDirection: 'row'}}>
            <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}>
Switch 
            </Text>
      <MaterialCommunityIcons
        name="account-switch-outline"
        size={20}
        color={themeStyles.primaryText.color}
        style={{marginHorizontal: 10}}
      />
      
            
        </Pressable>
    ),
    [appFontStyles, handleNavigateToFriendSelect,  themeStyles]
  )
  return (
    <View style={{ height: 'auto', paddingBottom: 10, width: "100%", backgroundColor: themeStyles.primaryBackground.backgroundColor, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
          {loadingNewFriend && (
            <View style={{ width: '100%' }}>
              <LoadingPage
                loading={loadingNewFriend}
                spinnerType="flow"
                spinnerSize={30}
                color={themeAheadOfLoading.darkColor}
                includeLabel={false}
              />
            </View>
          )}
          {!loadingNewFriend && (
            <RenderIcon/>
          )}

    </View>
  );
};

export default TopBar;
