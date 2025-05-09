import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import ArrowLeftCircleOutline from "@/app/assets/svgs/arrow-left-circle-outline.svg";
import { useNavigation } from "@react-navigation/native";
import LoadingPage from "../appwide/spinner/LoadingPage";
import { useFriendList } from "@/src/context/FriendListContext";
import { LinearGradient } from "expo-linear-gradient"; 
import CoffeeSvg from '@/app/assets/svgs/coffee-solid.svg';

const HeaderHelloes = ({ title = "HELLOES", writeView = false }) => {
  const { themeStyles } = useGlobalStyle();
  const { loadingNewFriend, selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const navigation = useNavigation();

  const handleNavigateBack = () => {
    navigation.goBack();
  };

//   const handleNavigateToAllMoments = () => {
//     if (selectedFriend) {
//     navigation.navigate("Moments");
    
//   }
//   };

  return (
    <> 
      <LinearGradient
        colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.headerContainer]}
      >
        {loadingNewFriend && themeAheadOfLoading && (
          <View
            style={[
              styles.loadingWrapper,
              { backgroundColor: themeAheadOfLoading.darkColor },
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
                //flexShrink: 1,
                justifyContent: "flex-start",
                alignContent: "center",
                alignItems: "center",
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
<View style={styles.headerTextContainer}>
  
<Text
  style={[
    styles.headerText,
    themeStyles.headerText,
    {
      color: themeAheadOfLoading.fontColorSecondary,
      paddingRight: 0,
    },
  ]}
  numberOfLines={1} // Limit to one line
  ellipsizeMode="tail" // Show "..." if text overflows
>
  {title}: {selectedFriend?.name ? ` ${selectedFriend.name}` : ''}
</Text>
            
</View>
<View
              style={{
                flexDirection: "row",
                //flexShrink: 1,
                justifyContent: "flex-end",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              {/* <TouchableOpacity onPress={handleNavigateToAllMoments}> */}
                {!writeView && (
                  <CoffeeSvg
                    height={36}
                    width={36}
                    color={themeAheadOfLoading.fontColorSecondary}
                  />
                )}
                {writeView && (
                  <CoffeeSvg
                    height={36}
                    width={36}
                    color={themeAheadOfLoading.fontColorSecondary}
                  />
                )}
              {/* </TouchableOpacity> */}
            </View>
          </>
        )}
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    padding: 10,
    paddingTop: 0,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
  },
  headerTextContainer: {
    flexDirection: 'row',
    //backgroundColor: 'pink',
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: '3%',
    //flexWrap: 'wrap',


  },
  headerText: {
    fontSize: 20,  
    fontFamily: "Poppins-Bold",
    textTransform: 'uppercase',
  },
  usernameText: {
    fontSize: 14,
    paddingVertical: 2,
    fontFamily: "Poppins-Bold",
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HeaderHelloes;
