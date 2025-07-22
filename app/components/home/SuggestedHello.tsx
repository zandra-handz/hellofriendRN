import { View, Pressable, Text, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";

type Props = {
  padding: number;
  height: number;
  borderRadius: number;
};

const SuggestedHello = ({ padding, height, borderRadius = 10 }: Props) => {
  const navigation = useNavigation();
  const { themeStyles, manualGradientColors, appFontStyles } = useGlobalStyle();
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const navigateToMoments = () => {
    navigation.navigate("Moments", { scrollTo: null });
  };

  const renderSuggestedHello = useMemo(() => {
    return (
      <View>
        <>
          <Text
            style={[
              {
                fontFamily: "Poppins-Regular",
                fontSize: appFontStyles.subWelcomeText.fontSize + 3,

                color: themeStyles.primaryText.color,
                opacity: 0.9,
                // color: manualGradientColors.homeDarkColor,
              },
            ]}
          >
            {selectedFriend && friendDashboardData ? "Suggested hello" : "None"}
          </Text>
          <Text
            style={[
              themeStyles.primaryText,
              {
                // alignSelf: 'center',
                lineHeight: 28,
                fontSize: appFontStyles.welcomeText.fontSize - 5,
                opacity: 0.9,
                paddingRight: 50,
              },
            ]}
          >
            {friendDashboardData?.[0]?.future_date_in_words ||
              "No date available"}
          </Text>
        </>
      </View>
    );
  }, [
    selectedFriend,
    friendDashboardData,
    appFontStyles,
    themeStyles,
    manualGradientColors,
    styles,
  ]);

  return (
    <View
      style={{
        marginVertical: 4,

        maxHeight: height + 40,
        flexShrink: 1,
        alignItems: "center",
        flexDirection: "row",

        justifyContent: "space-between",
        borderRadius: borderRadius,
        // backgroundColor: 'orange',
        padding: padding,
        paddingRight: 10,
        width: "100%",
        backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
      }}
    >
      <View style={styles.textContainer}>
        {renderSuggestedHello}
        <Pressable
          onPress={navigateToMoments}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            backgroundColor: manualGradientColors.lightColor,
            justifyContent: "center",
            borderRadius: 10,
            padding: 4,
            width: "auto",
            minWidth: 50,
            height: "100%",
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: "absolute",
              opacity: 0.9,
              position: "absolute",
              top:-60,
              right: 0,
              transform: [{ rotate: "90deg" }],
          
            }}
          >
            <GeckoSolidSvg
              width={140}
              height={140}
              color={manualGradientColors.homeDarkColor}
              style={{ opacity: 1 }}
            />
          </View>
          <View style={{bottom: 0, position: 'absolute', width: '100%', right: -20}}>
            
          <FontAwesome6
            name={"arrow-right"}
            size={20}
            color={manualGradientColors.homeDarkColor}
          />
          
          </View>
        </Pressable>
      </View>

      <View
        style={{
          borderRadius: 20,
          // height: "100%",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    zIndex: 5,
    // flexDirection: "column",
    width: "100%",
    flexWrap: "wrap",
    height: "100%",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SuggestedHello;
