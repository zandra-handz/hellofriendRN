import React, { useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { useUser } from "@/src/context/UserContext";
import useUser from "@/src/hooks/useUser";
import useCreateLocation from "@/src/hooks/LocationCalls/useCreateLocation";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import ContentAddLocation from "@/app/components/locations/ContentAddLocation";
import { AppFontStyles } from "@/app/styles/AppFonts"; 
import { useLDTheme } from "@/src/context/LDThemeContext";
const ScreenLocationCreate = () => {
  const route = useRoute();
  const location = route.params?.location ?? null;
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { selectedFriend } = useSelectedFriend(); 

  const fontStyle = AppFontStyles.welcomeText;
  const primaryColor = lightDarkTheme.primaryText;
  const backgroundColor = lightDarkTheme.primaryBackground;

  const flattenedHeaderStyle = [fontStyle, { color: primaryColor }];

  const navigation = useNavigation();

  const { createLocationMutation } = useCreateLocation({ userId: user?.id });

  useEffect(() => {
    if (createLocationMutation.isSuccess) {
      navigation.goBack();
    }
  }, [createLocationMutation]);

  return (
    <SafeViewFriendStatic
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      useOverlay={true}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      style={[
        {
          flex: 1,
          padding: 10,
        },
      ]}
    >
      <View style={styles.headerWrapper}>
        <Text style={flattenedHeaderStyle}>Add location</Text>
      </View>

      <ContentAddLocation
        userId={user?.id}
        lightDarkTheme={lightDarkTheme}
        
        primaryColor={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.primaryBackground}
                    themeColors={{
              lightColor: selectedFriend.lightColor,
              darkColor: selectedFriend.darkColor,
              fontColor: selectedFriend.fontColor,
              fontColorSecondary: selectedFriend.fontColorSecondary,
            }}  
        title={location.title}
        address={location.address}
      />
    </SafeViewFriendStatic>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    padding: 10,
  },
  bodyWrapper: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  typeWrapper: {
    width: "100%",
    height: 100,
  },
  everythingBesidesTypeWrapper: {
    width: "100%",
    height: 100,
    marginTop: 10,
    zIndex: 5000,
  },
});

export default ScreenLocationCreate;
