import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import ArrowLeftCircleOutline from "../assets/svgs/arrow-left-circle-outline.svg";
import { useNavigation } from "@react-navigation/native";
import LoadingPage from "../components/LoadingPage";
import { useFriendList } from "../context/FriendListContext";
import { LinearGradient } from "expo-linear-gradient";
import ThoughtBubbleOutlineSvg from "../assets/svgs/thought-bubble-outline.svg"; // Import the SVG
import LeavesTwoFallingOutlineThickerSvg from "../assets/svgs/leaves-two-falling-outline-thicker.svg";
import LeavesSingleStemOutlineSvg from "../assets/svgs/leaves-single-stem-outline.svg";
import LeafSingleOutlineThickerSvg from "../assets/svgs/leaf-single-outline-thicker.svg";


const HeaderMoment = ({ title = "ADD MOMENT", writeView = false }) => {
  const { themeStyles } = useGlobalStyle();
  const { loadingNewFriend, selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const navigation = useNavigation();

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleNavigateToAllMoments = () => {
    if (selectedFriend) {
    navigation.navigate("Moments");
    
  }
  };

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
                width: "50%",
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

            <Text
              style={[
                styles.headerText,
                themeStyles.headerText,
                {
                  color: themeAheadOfLoading.fontColorSecondary,
                  paddingRight: 0,
                },
              ]}
            >
              {title}
            </Text>
            <View>
              <TouchableOpacity onPress={handleNavigateToAllMoments}>
                {!writeView && (
                  <LeavesTwoFallingOutlineThickerSvg
                    height={36}
                    width={36}
                    color={themeAheadOfLoading.fontColorSecondary}
                  />
                )}
                {writeView && (
                  <LeafSingleOutlineThickerSvg
                    height={36}
                    width={36}
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

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    padding: 10,
    paddingTop: 66,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    height: 110,
  },
  headerText: {
    fontSize: 20,
    paddingVertical: 2,
    fontFamily: "Poppins-Bold",
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

export default HeaderMoment;