import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import { LinearGradient } from "expo-linear-gradient";
import DoubleChecker from "@/app/components/alerts/DoubleChecker"; 
import DetailRow from "@/app/components/appwide/display/DetailRow";
import SettingsStyleHeader from "@/app/components/appwide/SettingsStyleHeader";
import WrenchOutlineSvg from "@/app/assets/svgs/wrench-outline.svg";
import { useUser } from "@/src/context/UserContext";
import TrashOutlineSvg from "@/app/assets/svgs/trash-outline.svg";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useFriendStyle } from "@/src/context/FriendStyleContext";



const ScreenUserDetails = () => {
  const { user  } = useUser();
  const { themeStyles, gradientColorsHome, manualGradientColors } = useGlobalStyle();
  const { updateSafeViewGradient, themeAheadOfLoading } = useFriendStyle();
  const { darkColor, lightColor } = gradientColorsHome;
  const [isDoubleCheckerVisible, setIsDoubleCheckerVisible] = useState(false);
  useEffect(() => {
  updateSafeViewGradient(false);
}, []);

  const openDoubleChecker = () => {
    setIsDoubleCheckerVisible(true);
  };

  const toggleDoubleChecker = () => {
    setIsDoubleCheckerVisible((prev) => !prev);
  };

  return (
    <SafeViewAndGradientBackground
    
            startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
      friendId={selectedFriend?.id}
    style={{flex: 1}}>
      <LinearGradient
        colors={[darkColor, lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, themeStyles.container]}
      >
        <SettingsStyleHeader isLoadingComplete={!!(user?.id)} displayText={user?.username} />
        <ScrollView
          contentContainerStyle={[styles.backColorContainer, { padding: 10 }]}
          style={{ width: "100%" }}
        >
          <View style={styles.section}>
            <View style={styles.subTitleRow}>
              <Text style={[styles.modalSubTitle, themeStyles.modalText]}>
                USERNAME
              </Text>
              <View style={styles.subTitleButtonContainer}>
                <WrenchOutlineSvg
                  onPress={() => {}}
                  height={26}
                  width={26}
                  color={themeStyles.genericText.color}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.divider,
              { borderBottomColor: themeStyles.modalText.color },
            ]}
          ></View>
          <View style={styles.section}>
            <View style={styles.subTitleRow}>
              <Text style={[styles.modalSubTitle, themeStyles.modalText]}>
                EMAIL
              </Text>
              <View style={styles.subTitleButtonContainer}>
                <WrenchOutlineSvg
                  onPress={() => {}}
                  height={26}
                  width={26}
                  color={themeStyles.genericText.color}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.divider,
              { borderBottomColor: themeStyles.modalText.color },
            ]}
          ></View>
          <View style={styles.section}>
            <View style={styles.subTitleRow}>
              <Text style={[styles.modalSubTitle, themeStyles.modalText]}>
                PHONE
              </Text>
              <View style={styles.subTitleButtonContainer}>
                <WrenchOutlineSvg
                  onPress={() => {}}
                  height={26}
                  width={26}
                  color={themeStyles.genericText.color}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.divider,
              { borderBottomColor: themeStyles.modalText.color },
            ]}
          ></View>
          <View style={styles.section}>
            <View style={styles.subTitleRow}>
              <Text style={[styles.modalSubTitle, themeStyles.modalText]}>
                PASSWORD
              </Text>
              <View style={styles.subTitleButtonContainer}>
                <WrenchOutlineSvg
                  onPress={() => {}}
                  height={26}
                  width={26}
                  color={themeStyles.genericText.color}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.divider,
              { borderBottomColor: themeStyles.modalText.color },
            ]}
          ></View>
          <View style={styles.section}>
            <View style={styles.subTitleRow}>
              <Text style={[styles.modalSubTitle, themeStyles.modalText]}>
                ADDRESSES
              </Text>
              <View style={styles.subTitleButtonContainer}>
                <WrenchOutlineSvg
                  onPress={() => {}}
                  height={26}
                  width={26}
                  color={themeStyles.genericText.color}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.divider,
              { borderBottomColor: themeStyles.modalText.color },
            ]}
          ></View>
          <View style={styles.section}>
            <View style={styles.subTitleRow}>
              <Text style={[styles.modalSubTitle, themeStyles.dangerZoneText]}>
                DANGER ZONE
              </Text>
            </View>

            <TouchableOpacity onPress={openDoubleChecker}>
              <DetailRow
                iconSize={20}
                label={`Delete`}
                svg={TrashOutlineSvg}
                color={themeStyles.dangerZoneText.color}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {isDoubleCheckerVisible && (
          <DoubleChecker
            isVisible={isDoubleCheckerVisible}
            toggleVisible={toggleDoubleChecker}
            singleQuestionText={`Delete account?`}
            onPress={() => {}}
          />
        )}
      </LinearGradient>
    </SafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height: "100%",
    width: "100%",
  },
  subTitleRow: {
    flexDirection: "row",
    marginBottom: "4%",
    justifyContent: "space-between",
    width: "100%",
  },
  subTitleButtonContainer: {
    //width: '8%',
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    //zIndex: 1000,
  },
  section: {
    //flexGrow: 1,

    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: "2%",
    paddingVertical: "5%",
  },
  rowText: {
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 21,
  },
  modalSubTitle: {
    fontSize: 19,
    fontFamily: "Poppins-Regular",
  },
  divider: {
    borderBottomWidth: 0.8,
  },
  friendNameText: {
    fontSize: 28,
    fontFamily: "Poppins-Regular",
  },
  headerText: {
    fontSize: 20,
    marginTop: 0,
    fontFamily: "Poppins-Regular",
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 14,
  },

  backColorContainer: {
    //flex: 1,
    paddingHorizontal: "2%",
    paddingTop: "10%",
    width: "101%",
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
});

export default ScreenUserDetails;
