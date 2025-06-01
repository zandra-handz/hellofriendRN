import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useNavigation } from "@react-navigation/native";
import {
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";

import { useCapsuleList } from "@/src/context/CapsuleListContext";

interface MomentsAddedProps {
  visibilityValue: SharedValue<number>;
}

const MomentsAdded: React.FC<MomentsAddedProps> = ({ visibilityValue }) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const [hide, setHide] = useState(false);
  const { capsuleList, preAdded } = useCapsuleList();
  const navigation = useNavigation();

  const preAddedCount = preAdded.length;
  const capsuleCount = capsuleList.length + preAddedCount;

  useAnimatedReaction(
    () => visibilityValue.value,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        runOnJS(setHide)(!!newVal);
      }
    }
  );

  return (
    <>
      <View
        style={[
          {
            height: 300,
            width: "100%",
            alignItems: "center",
            flexDirection: "column",
            position: "absolute",
            justifyContent: "center",
            top: 100,
            bottom: 200,
            right: 0,
            left: 0,
            zIndex: hide ? 0 : 2000,
            paddingHorizontal: 20,
          },
        ]}
      >
        {!hide && (
          <View
            style={[
              themeStyles.overlayBackgroundColor,
              {
                flexDirection: "column",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
                height: "auto",
                width: "100%",
                borderRadius: 10,
                padding: 10,
              },
            ]}
          >
            <Text style={[themeStyles.primaryText, appFontStyles.welcomeText]}>
              Talking points: {capsuleCount}
            </Text>
            <Text style={[themeStyles.primaryText, appFontStyles.welcomeText]}>
              Added to hello: {preAddedCount}
            </Text>
            <TouchableOpacity
            style={[themeStyles.primaryBackground, {borderRadius: 10, padding: 10}]}
            onPress={() => navigation.navigate('PreAdded')}>
              <Text
                style={[themeStyles.primaryText, appFontStyles.welcomeText]}
              >
                Restore a moment?
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
};

export default MomentsAdded;
