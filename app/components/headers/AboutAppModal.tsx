import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { TouchableOpacity, AccessibilityInfo } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";

interface AboutAppModalProps {
  isVisible: boolean;
  closeModal: () => void;
  bottomSpacer: number;
}

const AboutAppModal: React.FC<AboutAppModalProps> = ({
  isVisible,
  closeModal,
  bottomSpacer,
}) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle();

  const headerIconSize = 26;

  // React.useEffect(() => {
  //   if (isModalVisible) {
  //     AccessibilityInfo.announceForAccessibility("Information opened");
  //   }
  // }, [isModalVisible]);

  return (
    // <ModalWithGoBack
    <ModalScaleLikeTree
      bottomSpacer={bottomSpacer}
      useModalBar={true}
      rightSideButtonItem={
        <Image
          source={require("@/app/assets/shapes/redheadcoffee.png")}
          style={{
            position: "absolute",
            width: 80,
            height: 80,

            top: -26,
            right: 0,
          }}
          resizeMode="contain"
        />
      }
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"information-outline"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      buttonTitle="About hellofriend"
      questionText="How to use"
      children={
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              Thank you for downloading!
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              Hellofriend is an IRL-meet-up assistant that lets you store notes
              (moments) to share with friends ahead of meeting up with them. It
              generates suggestions for meet-up dates and helps you decide
              locations as well!
            </Text>
          </View>

          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, themeStyles.subHeaderText]}>
              What is a 'Moment'?
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              A moment is literally any thought or idea you want to share with
              your friend the next time you see them.
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              Specifically, it refers to those moments when something reminds us
              of a person who has the audacity to not be anywhere near us at the
              time for us to tell them. These types of moments can accumulate
              over time if mostly-forgotten and never shared, and leave us with
              a sense of sadness we have lost the ability to pinpoint.
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              This app was born out of a desire to see less of these
              so-very-human moments lost.
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              That sounds all deep and stuff, but a moment can be as serious or
              as silly as you'd like!
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              Simply: a moment is a gift.
            </Text>
          </View>

          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, themeStyles.subHeaderText]}>
              I can just text them my 'Moments'.
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              Absolutely! Any form of connection is great!!
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              And, while you CAN log digital 'meet-ups' as well -- this app is
              ultimately intended for helping encourage and facilitate in-person
              interactions. For the people in our lives we especially want to
              make an effort to see more of than we do and we're not sure how;
              or for whom timing is a bit more complex of a factor.
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              It is also for those of us who WANT to meet up in person more but
              get DANG ANXIOUS about the logistics (hint: me!).
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              It is also for adults who are busy or timeblind.
            </Text>
          </View>
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, themeStyles.subHeaderText]}>
              How can this app help me pick locations?
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              Hellofriend can: search and save locations, pin favorite locations
              to individual friend dashboards, calculate the difference in
              travel times between you and your friend for any given location,
              and also find midpoint locations between you and your friend if
              you would rather choose one this way. You can also add your own
              notes and a parking score to each location for future reference.
            </Text>
          </View>
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, themeStyles.subHeaderText]}>
              Anything special about the images feature?
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              You can take and store pictures with the app itself, keeping them
              separate from gallery on your phone and avoiding clutter/making
              retrieval easier, if you struggle with this sort of thing.
            </Text>
          </View>
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, themeStyles.subHeaderText]}>
              To log a meet-up... 'add Hello'?
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              Yes! There is no in-app reward for completing the goal, but it's
              how the app knows when to generate a new suggested date.
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              (The app will also simply regenerate if you miss a date. They are
              just suggestions. Missing them means absolutely nothing to the
              app. It will not count against you in any way.)
            </Text>
          </View>

          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, themeStyles.subHeaderText]}>
              These names are kinda dumb.
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              Sorry! I like them.
            </Text>
          </View>
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, themeStyles.subHeaderText]}>
              One last thing. Why the lizard?
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              During a somewhat lonely time in my life, a lil gecko would come
              visit my window every night while I was studying and hang out
              there upside down for hours, and I would say 'hello, friend!'.
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={[styles.text, themeStyles.genericText]}>
              Never quite got the image out of my head.
            </Text>
          </View>
        </ScrollView>
      }
      onClose={closeModal}
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
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 30,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
});

export default AboutAppModal;
