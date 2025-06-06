import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import ArrowLeftCircleOutline from "@/app/assets/svgs/arrow-left-circle-outline.svg";
import { useNavigation } from "@react-navigation/native";
import LoadingPage from "../appwide/spinner/LoadingPage";
import { useFriendList } from "@/src/context/FriendListContext";
import { LinearGradient } from "expo-linear-gradient";

// adjust 'height' by changing the padding next to the top container style
const GlobalAppHeader = ({
  title = "TITLE HERE",
  navigateTo = null,
  altView = false,
  icon: Icon,
  altViewIcon: AltViewIcon,
  transparentBackground = false,
  counter = null,
  totalCount = null,
}) => {
  const { appContainerStyles, appFontStyles } = useGlobalStyle();
  const { loadingNewFriend, selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const navigation = useNavigation();

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleNavigate = () => {
    if (selectedFriend && navigateTo) {
      navigation.navigate(navigateTo); // screen name
    }
  };

  return (
    <>
      <LinearGradient
        colors={[  
          // temporary to see how looks/if good approach
          transparentBackground ? "transparent" : themeAheadOfLoading.darkColor,
          transparentBackground ? "transparent" : themeAheadOfLoading.lightColor,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          appContainerStyles.headerAutoHeightContainer,
          { paddingVertical: 4 },
        ]} // maxHeight is 60, it autos smaller than that
      >
        {loadingNewFriend && themeAheadOfLoading && (
          <View
            style={[
              {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: themeAheadOfLoading.darkColor,
              },
            ]}
          >
            <LoadingPage
              loading={loadingNewFriend}
              spinnerType="flow"
              color={"transparent"} //themeAheadOfLoading.lightColor
              includeLabel={false}
            />
          </View>
        )}
        {!loadingNewFriend && (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignContent: "center",
                alignItems: "center",
                zIndex: 7000,
              }}
            >
              <TouchableOpacity onPress={handleNavigateBack}>
                <ArrowLeftCircleOutline
                  height={30}
                  width={30}
                  color={themeAheadOfLoading.fontColor}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "flex-end",
                paddingRight: "3%",
              }}
            >
              <Text
                style={[
                  appFontStyles.globalAppHeaderText,
                  {
                    color: themeAheadOfLoading.fontColorSecondary,
                    paddingRight: 0,
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}{" "}{counter && totalCount && `${counter}/${totalCount} `}{selectedFriend?.name ? `${selectedFriend.name}` : ""}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={handleNavigate}>
                {!altView && Icon && (
                  <Icon
                    height={36}
                    width={36}
                    color={themeAheadOfLoading.fontColorSecondary}
                  />
                )}
                {altView && AltViewIcon && (
                  <AltViewIcon
                    height={30}
                    width={30}
                    color={themeAheadOfLoading.fontColorSecondary}
                  />
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </LinearGradient>
    </>
  );
};

export default GlobalAppHeader;
