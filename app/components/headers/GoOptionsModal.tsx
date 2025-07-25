import { v4 as uuidv4 } from "uuid";
import React from "react";
import { ScrollView, StyleSheet, View, Pressable, Text } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import HalfScreenModal from "../alerts/HalfScreenModal";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/NavigationTypes";
import { useUser } from "@/src/context/UserContext";

import { useNavigation } from "@react-navigation/native";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const GoOptionsModal = ({ isVisible, closeModal }) => {
  const { user } = useUser();

  const navigation = useNavigation<NavigationProp>();
  const { themeStyles, appSpacingStyles, appFontStyles, manualGradientColors } =
    useGlobalStyle();

  const navigateToMoments = () => {
    closeModal();
    navigation.navigate("Moments", { scrollTo: null });
  };

  const navigateToLocationSearch = () => {
    closeModal();
    navigation.navigate("LocationSearch");
  };

  const navigateToFinalize = () => {
    closeModal();
    navigation.navigate("Finalize");
  };

  return (
    <HalfScreenModal
      isFullscreen={false}
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"storefront-outline"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      questionText="What would you like to do?"
      children={
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          {/* <View style={styles.headerContainer}>
            <Text style={[styles.headerText, themeStyles.subHeaderText]}>
              Found a bug?
            </Text>
          </View> */}
          <View style={styles.sectionContainer}>
            <Pressable
              onPress={navigateToLocationSearch}
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                height: "auto",
                padding: 10,
                borderRadius: 10,
                backgroundColor: manualGradientColors.darkColor,
              }}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.subWelcomeText,
                  {
                    backgroundColor:
                      themeStyles.overlayBackgroundColor.backgroundColor,
                    borderRadius: 6,
                    padding: 10,
                  },
                ]}
              >
                Send a meetup location
              </Text>
            </Pressable>
          </View>
          <View style={styles.sectionContainer}>
            <Pressable
              onPress={navigateToMoments}
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                height: "auto",
                padding: 10,
                borderRadius: 10,
                backgroundColor: manualGradientColors.darkColor,
              }}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.subWelcomeText,
                  {
                    backgroundColor:
                      themeStyles.overlayBackgroundColor.backgroundColor,
                    borderRadius: 6,
                    padding: 10,
                  },
                ]}
              >
                Share my ideas
              </Text>
            </Pressable>
          </View>
          <View style={styles.sectionContainer}>
            <Pressable
              onPress={navigateToFinalize}
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                height: "auto",
                padding: 10,
                borderRadius: 10,
                backgroundColor: manualGradientColors.darkColor,
              }}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.subWelcomeText,
                  {
                    backgroundColor:
                      themeStyles.overlayBackgroundColor.backgroundColor,
                    borderRadius: 6,
                    padding: 10,
                  },
                ]}
              >
                Skip to save hello
              </Text>
            </Pressable>
          </View>
            <View style={styles.sectionContainer}>
            <Pressable
              onPress={closeModal}
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                height: "auto",
                padding: 10,
                borderRadius: 10,
                backgroundColor: manualGradientColors.darkColor,
              }}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.subWelcomeText,
                  {
                    backgroundColor:
                      themeStyles.overlayBackgroundColor.backgroundColor,
                    borderRadius: 6,
                    padding: 10,
                  },
                ]}
              >
                Close
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      }
      formHeight={610}
      onClose={closeModal}
      cancelText="Back"
    />
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  headerContainer: {
    margin: "2%",
  },
  sectionContainer: {
    margin: "2%",
    flexDirection: "row",
    fontWrap: "wrap",
  },
  headerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  text: {
    lineHeight: 21,
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default GoOptionsModal;
