import { View, Pressable, Text, StyleSheet, Alert } from "react-native";
import React, { useMemo, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";
import GoOptionsModal from "../headers/GoOptionsModal";

type Props = {
  padding: number;
  height: number;
  borderRadius: number;
};

const SuggestedHello = ({ padding, height, borderRadius = 10 }: Props) => {
  const navigation = useNavigation();
  const { themeStyles, manualGradientColors, appFontStyles } = useGlobalStyle();
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const [ optionsModalVisible, setOptionsModalVisible ] = useState(false);

  const handleGoPress = () => {
setOptionsModalVisible(true);
  };
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
            {friendDashboardData?.future_date_in_words ||
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
          // onPress={navigateToMoments}
          onPress={handleGoPress}
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
          <View style={{bottom: -1, position: 'absolute', alignItems: 'center', flexDirection: 'row', width: '100%', left: 2}}>
            <Text style={{color: manualGradientColors.homeDarkColor, fontSize: 18, fontWeight: 'bold'}}>GO{' '}</Text>
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
      {optionsModalVisible && (
        <GoOptionsModal
        isVisible={optionsModalVisible}
        closeModal={() => setOptionsModalVisible(false)}
        />
      ) }
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
