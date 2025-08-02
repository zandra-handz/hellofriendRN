import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  SlideInDown,
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";

import { useCapsuleList } from "@/src/context/CapsuleListContext";

interface MomentsAddedProps {
  visibilityValue: SharedValue<number>;
}

const MomentsAdded: React.FC<MomentsAddedProps> = ({ visibilityValue }) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();

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
          <Animated.View
            entering={SlideInDown.duration(0)}
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
                borderRadius: 999,
                padding: 10,
              },
            ]}
          >
            <Text
              style={[
                themeStyles.primaryText,
                appFontStyles.welcomeText,
                { fontSize: 14 },
              ]}
            >
              Total ideas: {capsuleCount}
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.welcomeText,
                  { fontSize: 14 },
                ]}
              >
                Added to hello: {preAddedCount}
              </Text>

              {preAddedCount > 0 && (
                <Pressable
                  style={[{ height: "100%", alignItems: "center" }]}
                  onPress={() => navigation.navigate("PreAdded")}
                >
                  <Text
                    style={[
                      themeStyles.primaryText,
                      appFontStyles.welcomeText,
                      {
                        marginLeft: 10,
                        fontSize: 14,
                        paddingHorizontal: 14,
                        borderRadius: 999,
                        // fontFamily: "Poppins-Bold",
                        backgroundColor: themeStyles.darkerOverlayBackgroundColor.backgroundColor,
                      },
                    ]}
                  >
                    Restore
                  </Text>
                </Pressable>
              )}
            </View>
          </Animated.View>
        )}
      </View>
    </>
  );
};

export default MomentsAdded;
