import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Keyboard } from "react-native";

import TextEditBox from "@/app/components/appwide/input/TextEditBox";
import FlatListChangeChoice from "@/app/components/appwide/FlatListChangeChoice";
import LocationAddress from "@/app/components/locations/LocationAddress";
 
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "@/src/context/UserContext";
import {  useLDTheme } from "@/src/context/LDThemeContext";
 
import useDeleteLocation from "@/src/hooks/LocationCalls/useDeleteLocation";
import { AppFontStyles } from "@/app/styles/AppFonts"; 
import useUpdateLocation from "@/src/hooks/LocationCalls/useUpdateLocation";
import EscortBar from "@/app/components/moments/EscortBar";
// import SlideToDeleteHeader from "@/app/components/foranimations/SlideToDeleteHeader";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

const ScreenLocationEdit = () => {
  const route = useRoute();
  const location = route.params?.location ?? null;
  const category = route.params?.category ?? null;
  const notes = route.params?.notes ?? null;
  const parking = route.params?.parking ?? null;
  const focusOn = route.params?.focusOn ?? null;

  // const { friendListAndUpcoming} = useFriendListAndUpcoming();
  // const friendList = friendListAndUpcoming?.friends;
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();

  const { handleDeleteLocation, deleteLocationMutation } = useDeleteLocation({
    userId: user?.id,
    locationId: location?.id,
  });
  const { handleUpdateLocation, updateLocationMutation } = useUpdateLocation({
    userId: user?.id,
    locationId: location?.id,
  });

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const navigation = useNavigation();

  const { lightDarkTheme } = useLDTheme(); 

  const editedTextRef = useRef(null);
  const editedCategoryRef = useRef(null);

  const fontStyle = AppFontStyles.welcomeText;
  const primaryColor = lightDarkTheme.primaryText;
  const backgroundColor = lightDarkTheme.primaryBackground;

  // useLayoutEffect(() => {
  //   if ((focusOn === 'focusNotes') && editedTextRef && editedTextRef.current) {
  //     editedTextRef.current.focus();
  //   }

  //   if (focusOn === 'focusCategory' && editedCategoryRef.current) {
  //     editedCategoryRef.current.focus();
  //   }

  // }, [focusOn]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const parkingScores = [
    { label: "Free parking", value: "location has free parking lot" },
    { label: "Free parking nearby", value: "free parking lot nearby" },
    { label: "Street parking", value: "street parking" },
    {
      label: "Stressful parking",
      value: "fairly stressful or unreliable street parking",
    },
    { label: "No parking", value: "no parking whatsoever" },
    { label: "unspecified", value: "unspecified" },
  ];

  const updateCategoryEditString = (text) => {
    if (editedCategoryRef && editedCategoryRef.current) {
      editedCategoryRef.current.setText(text);
      console.log("in parent", editedCategoryRef.current.getText());
    }
  };

  const updateNoteEditString = (text) => {
    if (editedTextRef && editedTextRef.current) {
      editedTextRef.current.setText(text);
      console.log("in parent", editedTextRef.current.getText());
    }
  };

  const editedParkingScoreRef = useRef(null);

  const updateParkingScore = (text) => {
    if (editedParkingScoreRef && editedParkingScoreRef.current) {
      editedParkingScoreRef.current.setText(text);
 
    }
  };

  //weekdayTextData is coming from LocationHoursOfOperation component

  const handleDelete = (fluff) => {
    try {
      handleDeleteLocation();
    } catch (error) {
      console.log("error, location not deleted: ", error, location);
    }
  };

  const handleSubmit = () => {
    handleUpdateLocation(location.id, {
      category: editedCategoryRef.current.getText(),
      personal_experience_info: editedTextRef.current.getText(),
      parking_score: editedParkingScoreRef.current.getText(),
    });
  };

  useEffect(() => {
    if (updateLocationMutation.isSuccess) {
      navigation.goBack();
    }
  }, [updateLocationMutation]);

  useEffect(() => {
    if (deleteLocationMutation.isSuccess) {
      navigation.goBack();
    }
  }, [deleteLocationMutation]);

  const flattenedHeaderStyle = [fontStyle, { color: primaryColor }];

  return (
    <SafeViewAndGradientBackground
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useOverlayFade={false}
      useSolidOverlay={false}
      styles={[{ flex: 1 }]}
    >
      <View style={styles.headerWrapper}>
        <Text style={flattenedHeaderStyle}>Edit location</Text>
      </View>

      <View style={styles.bodyWrapper}>
        <View style={styles.everythingBesidesTypeWrapper}>
          <LocationAddress
            address={location?.address}
            primaryColor={primaryColor}
          />
          <TextEditBox
            ref={editedCategoryRef}
            autoFocus={focusOn === "focusCategory"}
            title={"Edit category"}
            mountingText={category}
            onTextChange={updateCategoryEditString}
            multiline={false}
            height={"100%"}
          />

          <View
            style={{
              height: isKeyboardVisible ? "50%" : "30%",
              flexGrow: 1,
              marginBottom: "3%",
            }}
          >
            <TextEditBox
              ref={editedTextRef}
              autoFocus={focusOn === "focusNotes"}
              title={"Edit notes"}
              mountingText={notes}
              onTextChange={updateNoteEditString}
              height={"100%"}
            />
          </View>
        </View>
        <View style={{ height: "20%", flexShrink: 1, marginBottom: "3%" }}>
          <FlatListChangeChoice 
            primaryColor={lightDarkTheme.primaryText}
            backgroundColor={lightDarkTheme.backgroundColor}
            darkColor={selectedFriend.darkColor} 
            horizontal={true}
            choicesArray={parkingScores}
            ref={editedParkingScoreRef}
            title={"Change parking score"}
            oldChoice={parking}
            onChoiceChange={updateParkingScore}
          />
        </View>
      </View>
      {!isKeyboardVisible && (
        <EscortBar
          primaryColor={primaryColor}
          primaryBackground={backgroundColor}
          forwardFlowOn={false}
          label={"Save changes"}
          onPress={handleSubmit}
        />
      )}
    </SafeViewAndGradientBackground>
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

export default ScreenLocationEdit;
