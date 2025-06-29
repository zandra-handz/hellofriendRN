import React, { useState, useCallback } from "react";
import { View, StyleSheet, Text, Pressable, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// app state
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useNavigationState } from "@react-navigation/native";
 
import GradientBackground from "../appwide/display/GradientBackground";

const UserCategorySelector = ({onPress }) => {
  const navigationState = useNavigationState((state) => state);
  const { onSignOut } = useUser();
  const currentRouteName = navigationState.routes[navigationState.index]?.name;
  const isOnActionPage = currentRouteName === "hellofriend";
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend, deselectFriend } = useSelectedFriend();
const { userCategories } = useUserSettings();
  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const footerPaddingBottom = 20;
  const footerIconSize = 28; 


  const [selectedId, setSelectedId ] = useState(null);

  const handleOnPress = (itemId) => {
    setSelectedId(itemId);
console.log(itemId)
    onPress(itemId);
  }

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `user-category-${index}`;

  const renderCategoryButton = ({ item }) => (
  <Pressable
    onPress={() => handleOnPress(item.id)}
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      height: 40,
      marginHorizontal: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor:
        selectedId === item.id
          ? "limegreen"
          : themeStyles.lighterOverlayBackgroundColor,
      width: "auto",
      marginVertical: 6,
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 40,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
      }}
    >
      <MaterialCommunityIcons
        name={"shape"}
        size={20}
        color={themeStyles.primaryText.color}
      />
    </View>

    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
      <Text style={[themeStyles.primaryText]}>{item.name}</Text>
    </View>
  </Pressable>
);

  return (
    <GradientBackground
      useFriendColors={!!selectedFriend}
      additionalStyles={[
        styles.container,
        {
          height: footerHeight,
          paddingBottom: footerPaddingBottom,
          opacity: 0.94,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            
            height: footerHeight,
            paddingBottom: footerPaddingBottom,
            backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          },
        ]}
      >


              {userCategories && userCategories.length > 0   && (
              
                  <FlatList
                    // ListHeaderComponent={renderHeaderItem}
                    data={userCategories} 
                    renderItem={renderCategoryButton}
                    horizontal
                    keyExtractor={extractItemKey}
                    // initialNumToRender={10}
                    // maxToRenderPerBatch={10}
                    // windowSize={10}
                    // removeClippedSubviews={true}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={() => <View style={{ height: 50 }} />}
                  /> 
              )}



      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 50000,
  },
  section: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    marginVertical: 10,
  },
});

export default UserCategorySelector;
